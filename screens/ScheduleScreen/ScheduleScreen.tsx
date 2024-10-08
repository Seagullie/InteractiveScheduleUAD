// EXTERNAL DEPENDENCIES

import React from "react"
import { useCallback, useRef, useState, useEffect } from "react"
import { View, ActivityIndicator, ToastAndroid } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import ldash from "lodash"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

// INTERNAL DEPENDENCIES

import { globalStyles, palette } from "../../styles/global"
import ScheduleDayComponent from "../../components/ScheduleComponents/ScheduleDayComponent/ScheduleDay"
import SettingsService from "../../services/SettingsService/SettingsService"
import { DisplayEmptyDaysMode } from "../../services/SettingsService/Types"
import ScheduleModel from "../../models/ScheduleModel/ScheduleModel"
import { workDays } from "../../constants/Days"
import ScheduleNotificationsService from "../../services/ScheduleNotificationsService"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import { ScheduleFile } from "../../services/ScheduleLoaderService/Types"
import { SettingsContext } from "../../contexts/settingsContext"
import { ensureExtension, ensureNoExtension, isRunningInBrowser } from "../../utilities/utilities"
import IntroductoryCarousel from "../IntroductoryCarousel/IntroductoryCarousel"
import GetWeekType, { WeekType } from "../../utilities/getWeekType"
import ScheduleHeader from "../../components/ScheduleComponents/ScheduleHeaderComponent/ScheduleHeader"
import { Event } from "../../constants/Events"
import EditActionsExplanatoryCard from "../../components/ScheduleEditorComponents/EditActionsExplanatoryCard"
import DateOverviewCard from "../../components/ScheduleComponents/DateOverviewCard"
import { WeekTypeContext } from "../../contexts/weekTypeContext"
import { styles } from "./Styles"
import { IS_FIRST_TIME_LAUNCH_KEY } from "../../constants/AsyncStorageKeys"
import { OnLayoutChange } from "./Utils/OnLayoutChange"

// TODO: scroll to current day on mount only instead of doing so on every rerender?

export default function ScheduleScreen({ isEditable = false }: { isEditable: boolean }) {
  // [web] a workaround to render drawer menu content without explicitly opening it
  if (isRunningInBrowser()) {
    const navigation = useNavigation()
    // @ts-ignore
    navigation.openDrawer()
    // @ts-ignore
    navigation.closeDrawer()
  }

  // state for unconditional rerendering
  const [_, setState] = useState({})
  const [isFirstTimeLaunch, setIsFirstTimeLaunch] = useState<string | null>("false") // async storage can't store anything other than strings

  const scheduleRef = useRef<ScheduleModel | null>(null)
  const scheduleFileRef = useRef<ScheduleFile | null>(null)
  const settingsServiceRef = useRef<SettingsService>(null)

  const scrollViewContainerRef = useRef<ScrollView | null>(null)

  const [isScheduleLoaded, setScheduleLoaded] = useState(false)
  const [scheduleName, setScheduleName] = useState("")
  // y coords of each day card
  const [dataSourceCoords, setDataSourceCoords] = useState<number[]>([])

  const scheduleNameRef = useRef<string>()
  scheduleNameRef.current = scheduleName

  const [weekType, setWeekType] = React.useState<WeekType>(GetWeekType())

  const onSettingsUpdated = useCallback(
    async (settingsService: SettingsService) => {
      // if schedule didn't change then there is nothing to do here
      console.log(" - - - deciding whether to update schedule or not - - -")
      const settingsScheduleName = ensureNoExtension(settingsService.currentScheduleName, ".json")
      const currentScheduleName = ensureNoExtension(scheduleNameRef.current, ".json")
      console.log("settings schedule name: ", settingsScheduleName)
      console.log("schedule name: ", currentScheduleName)

      const shouldUpdateSchedule = settingsScheduleName !== currentScheduleName
      console.log(" - - -")

      if (shouldUpdateSchedule) {
        // construct new schedule object and setState for schedule name
        const newSchedule = new ScheduleModel("groupname_groupyear", "groupname", 5)
        await newSchedule.getScheduleFromScheduleLoader(settingsService.currentScheduleName)

        // configure notifications for schedule, but only if it's not in editor
        if (!isEditable) {
          const notifService = await ScheduleNotificationsService.GetInstance()
          await notifService.configureNotificationsForSchedule(newSchedule)
        }

        scheduleRef.current = newSchedule
        const scheduleLoaderService = await ScheduleLoaderService.GetInstance()
        const updatedSchedule = scheduleLoaderService.getScheduleFileByFileName(
          ensureExtension(settingsService.currentScheduleName, ".json")
        )
        // TODO: Refactor XD
        scheduleFileRef.current = ldash.cloneDeep(updatedSchedule) ?? null

        setScheduleName(settingsService.currentScheduleName)
      } else {
        // assume that something else changed and we need to rerender to reflect those changes
        // (in editor everything is always unfolded and there is no need to update)
        if (isEditable) return
        setState({})
      }
    },
    [scheduleName]
  )

  useEffect(() => {
    async function onMount() {
      const settingsService = await SettingsService.GetInstance()
      settingsServiceRef.current = settingsService

      console.log("[Schedule.tsx] settingsService instance: ", settingsService)

      const scheduleLoaderInstance = await ScheduleLoaderService.GetInstance()

      const schedule = new ScheduleModel("groupname_groupyear", "groupname", 5)

      // check whether the schedule that settings service is referencing exists. Otherwise load first available schedule
      const scheduleFile = scheduleLoaderInstance.getScheduleFileByFileName(settingsService.currentScheduleName)
      const firstScheduleFile = scheduleLoaderInstance.scheduleFiles[0]

      scheduleFileRef.current = ldash.cloneDeep(scheduleFile ?? firstScheduleFile)

      const nameOfScheduleToLoad = scheduleFile ? settingsService.currentScheduleName : firstScheduleFile.filename

      await schedule.getScheduleFromScheduleLoader(nameOfScheduleToLoad)

      // configure notifications for schedule, but only if it's not in editor
      if (!isEditable) {
        ScheduleNotificationsService.GetInstance().then((i) => {
          console.log("will call configureNotificationsForSchedule on schedule: ", schedule.name)
          i.configureNotificationsForSchedule(schedule)
        })
      }

      console.log("[Schedule.tsx] schedule: ", schedule)

      settingsService.SettingsEventEmitter.on(Event.SETTINGS_UPDATED, onSettingsUpdated)
      console.log("subscribed to settings updated event")
      console.log("n of subscribers: ", settingsService.SettingsEventEmitter.listenerCount(Event.SETTINGS_UPDATED))

      scheduleRef.current = schedule

      const isFirstTimeLaunch = await AsyncStorage.getItem(IS_FIRST_TIME_LAUNCH_KEY)
      setIsFirstTimeLaunch(isFirstTimeLaunch)

      setScheduleName(schedule.name)
      setScheduleLoaded(true)
    }

    onMount()

    // on unmount
    return () => {
      SettingsService.GetInstance().then((settingsService: SettingsService) => {
        settingsService.SettingsEventEmitter.removeListener(Event.SETTINGS_UPDATED, onSettingsUpdated)
      })
    }
  }, [])

  const onWeekTypeChanged = (weekType: number) => {
    console.log("week type changed to: ", weekType)
    // display toast message if in editor
    // the switching takes longer in editor...
    if (isEditable) {
      // TODO: make cross platform version of toast
      if (!isRunningInBrowser()) {
        ToastAndroid.show("Завантаження...", ToastAndroid.LONG)
      }
    }
    setWeekType(weekType)
  }

  // runs when screen gets focus
  useFocusEffect(
    useCallback(() => {
      if (isEditable) return

      // compare current schedule file with the one in loader
      // if they are different, update schedule

      // return if schedule or schedule file is not loaded yet
      if (!scheduleRef.current || !scheduleFileRef.current) {
        console.log("[schedule screen focus] schedule or schedule file is not loaded yet")
        return
      }

      const currentScheduleFile = scheduleFileRef.current
      ScheduleLoaderService.GetInstance().then((instance) => {
        const scheduleFile = instance.getScheduleFileByFileName(currentScheduleFile!.filename)
        // debugger

        // have to compare them this way because the objects themselves have different ids
        if (JSON.stringify(currentScheduleFile.json_parsed) != JSON.stringify(scheduleFile!.json_parsed)) {
          console.log("[schedule screen focus] schedule file changed, rerendering...")
          // setScheduleLoaded(false)

          // update refs
          scheduleFileRef.current = ldash.cloneDeep(scheduleFile) ?? null

          const newSchedule = new ScheduleModel("groupname_groupyear", "groupname", 5)
          scheduleRef.current! = newSchedule
          newSchedule.getScheduleFromScheduleLoader(scheduleFile!.filename).then(() => {
            setState({})
          })
        } else {
          console.log("[schedule screen focus] schedule file didn't change")
        }
      })

      // show toast
      // ToastAndroid.show("У переглядачі", ToastAndroid.SHORT)

      return () => {
        // ToastAndroid.show("Поза переглядачем", ToastAndroid.SHORT)
      }
    }, [])
  )

  if (!isScheduleLoaded) {
    return (
      <View style={styles.rootContainer}>
        <ScheduleHeader title="Розклад" onWeekTypeChanged={onWeekTypeChanged} />
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <ActivityIndicator
            testID="scheduleScreenActivityIndicator"
            size="large"
            animating={true}
            color={palette.navigationBackground}
          />
        </View>
      </View>
    )
  }

  if (isFirstTimeLaunch != "false") {
    return (
      <IntroductoryCarousel
        onClose={() => {
          setIsFirstTimeLaunch("false")
          AsyncStorage.setItem("isFirstTimeLaunch", "false")
        }}
      />
    )
  }

  console.log("[Schedule View] will render schedule screen")

  return (
    <SettingsContext.Provider value={settingsServiceRef.current}>
      <WeekTypeContext.Provider value={weekType}>
        <View style={styles.rootContainer}>
          <ScheduleHeader title={scheduleName} onWeekTypeChanged={onWeekTypeChanged} />

          <ScrollView
            style={
              {
                // flex: 1
                // ^breaks it on mobile
              }
            }
            contentContainerStyle={{ paddingBottom: 0 }}
            ref={scrollViewContainerRef}
            // nestedScrollEnabled={false}
          >
            {/* explanatory card if in editor, otherwise date overview card */}

            {isEditable ? <EditActionsExplanatoryCard /> : <DateOverviewCard />}
            {workDays.map((day, idx) => {
              const item = day

              const schedule = scheduleRef.current!
              const scheduleDay = schedule.scheduleDays[idx]

              const currentlySelectedWeekClasses =
                weekType == 0 ? scheduleDay.getNominatorClasses() : scheduleDay.getDenominatorClasses()

              const isEmpty = currentlySelectedWeekClasses.length === 0
              const shouldDisplayEmptyDay = settingsServiceRef.current!.displayEmptyDays != DisplayEmptyDaysMode.Hide

              if (!isEditable && isEmpty && !shouldDisplayEmptyDay) {
                return <View style={globalStyles.noDisplay} key={day + weekType}></View>
              }

              const classes = weekType == 0 ? scheduleDay.getNominatorClasses() : scheduleDay.getDenominatorClasses()

              return (
                <View
                  style={styles.cardContainer}
                  key={day + weekType}
                  // runs twice for each day.
                  onLayout={(event) => {
                    // gather coords data
                    const layout = event.nativeEvent.layout
                    dataSourceCoords[idx] = layout.y
                    setDataSourceCoords(dataSourceCoords)

                    // try to scroll to today
                    OnLayoutChange({
                      dataSourceCoords,
                      scrollViewContainerRef,
                    })
                  }}
                >
                  <ScheduleDayComponent
                    classesCollection={classes}
                    scheduleObject={scheduleRef.current!}
                    dayName={item}
                    // dayIndex={idx}
                    scheduleDay={scheduleRef.current!.scheduleDays[idx]}
                    displayRoomNumber={!isEditable ? settingsServiceRef.current!.displayRoomNumber : true}
                    // showSeparator={idx !== workDays.length - 1}
                    weekType={weekType}
                    fade={
                      !isEditable
                        ? isEmpty && settingsServiceRef.current!.displayEmptyDays == DisplayEmptyDaysMode.Darken
                        : false
                    }
                    isEditable={isEditable}
                  ></ScheduleDayComponent>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </WeekTypeContext.Provider>
    </SettingsContext.Provider>
  )
}
