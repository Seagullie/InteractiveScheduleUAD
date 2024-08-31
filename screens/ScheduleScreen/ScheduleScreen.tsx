// EXTERNAL DEPENDENCIES

import React from "react"
import { useCallback, useRef, useState, useEffect } from "react"
import { View, ActivityIndicator, ToastAndroid } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import _ from "lodash"
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

// TODO: scroll to current day on mount only instead of doing so on every rerender?

export default function ScheduleScreen({ isEditable = false }: { isEditable: boolean }) {
  // [web] a workaround to render drawer menu content without explicitly opening it
  if (isRunningInBrowser()) {
    const navigation = useNavigation()
    navigation.openDrawer()
    navigation.closeDrawer()
  }

  const todayIndex = _.clamp(new Date().getDay() - 1, 0, 4)

  // state for unconditional rerendering
  const [state, setState] = useState({})
  const [isFirstTimeLaunch, setIsFirstTimeLaunch] = useState<string | null>("false") // async storage can't store anything other than strings

  let scheduleRef = useRef<ScheduleModel | null>(null)
  let scheduleFileRef = useRef<ScheduleFile | null>(null)
  let settingsServiceRef = useRef<SettingsService>(null)

  let scrollViewContainerRef = useRef<ScrollView | null>(null)

  const [scheduleLoaded, setScheduleLoaded] = useState(false)
  const [scheduleName, setScheduleName] = useState("")
  const [dataSourceCords, setDataSourceCords] = useState<any[]>([])

  const scheduleNameRef = useRef<string>()
  scheduleNameRef.current = scheduleName

  const [weekType, setWeekType] = React.useState<WeekType>(GetWeekType())

  const onSettingsUpdated = useCallback(
    async (settingsService: SettingsService) => {
      // if schedule didn't change then there is nothing to do here
      console.log(" - - - deciding whether to update schedule or not - - -")
      let settingsScheduleName = ensureNoExtension(settingsService.currentScheduleName, ".json")
      let currentScheduleName = ensureNoExtension(scheduleNameRef.current, ".json")
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
        let scheduleLoaderService = await ScheduleLoaderService.GetInstance()
        let updatedSchedule = scheduleLoaderService.getScheduleFileByFileName(
          ensureExtension(settingsService.currentScheduleName, ".json")
        )
        // TODO: Refactor XD
        scheduleFileRef.current = _.cloneDeep(updatedSchedule) ?? null

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
      let settingsService = await SettingsService.GetInstance()
      settingsServiceRef.current = settingsService

      console.log("[Schedule.tsx] settingsService instance: ", settingsService)

      let scheduleLoaderInstance = await ScheduleLoaderService.GetInstance()

      let schedule = new ScheduleModel("groupname_groupyear", "groupname", 5)

      // check whether the schedule that settings service is referencing exists. Otherwise load first available schedule
      let scheduleFile = scheduleLoaderInstance.getScheduleFileByFileName(settingsService.currentScheduleName)
      let firstScheduleFile = scheduleLoaderInstance.scheduleFiles[0]

      scheduleFileRef.current = _.cloneDeep(scheduleFile ?? firstScheduleFile)

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

      let currentScheduleFile = scheduleFileRef.current
      ScheduleLoaderService.GetInstance().then((instance) => {
        let scheduleFile = instance.getScheduleFileByFileName(currentScheduleFile!.filename)
        // debugger

        // have to compare them this way because the objects themselves have different ids
        if (JSON.stringify(currentScheduleFile.json_parsed) != JSON.stringify(scheduleFile!.json_parsed)) {
          console.log("[schedule screen focus] schedule file changed, rerendering...")
          // setScheduleLoaded(false)

          // update refs
          scheduleFileRef.current = _.cloneDeep(scheduleFile) ?? null

          let newSchedule = new ScheduleModel("groupname_groupyear", "groupname", 5)
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

  if (!scheduleLoaded) {
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
            {/* temp slice for performance reasons */}
            {workDays.slice(0, 111).map((day, idx) => {
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

              let classes = weekType == 0 ? scheduleDay.getNominatorClasses() : scheduleDay.getDenominatorClasses()

              return (
                <View
                  style={styles.cardContainer}
                  key={day + weekType}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout
                    dataSourceCords[idx] = layout.y
                    setDataSourceCords(dataSourceCords)
                    // console.log("- - - component layout data (start) - - - ")
                    // console.log(dataSourceCords)
                    // console.log("height:", layout.height)
                    // console.log("width:", layout.width)
                    // console.log("x:", layout.x)
                    // console.log("y:", layout.y)
                    // console.log("- - - component layout data (end) - - - ")

                    if (dataSourceCords.length < todayIndex) return
                    if (this.scrolledToToday == true) return

                    // this should happen only once
                    scrollViewContainerRef.current!.scrollTo({
                      x: 0,
                      y: dataSourceCords[todayIndex],
                      animated: true,
                    })

                    // TODO: Refactor
                    if (dataSourceCords.length == 5) {
                      this.scrolledToToday = true
                    }
                  }}
                >
                  <ScheduleDayComponent
                    classesCollection={classes}
                    scheduleObject={scheduleRef.current!}
                    dayName={item}
                    dayIndex={idx}
                    scheduleDay={scheduleRef.current!.scheduleDays[idx]}
                    displayRoomNumber={!isEditable ? settingsServiceRef.current!.displayRoomNumber : true}
                    showSeparator={idx !== workDays.length - 1}
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
