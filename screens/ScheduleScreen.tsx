import React from "react"

import { useCallback, useRef, useState } from "react"
import { View, StyleSheet, ActivityIndicator, ToastAndroid, Image } from "react-native"
import { editorImages, globalStyles, palette } from "../styles/global"

import ScheduleDayComponent from "../components/ScheduleComponents/ScheduleDay"
import { useEffect } from "react"
import SettingsService, { DisplayEmptyDaysMode } from "../services/SettingsService"
import ScheduleModel from "../models/ScheduleModel"

import { useErrorBoundary } from "react-error-boundary"
import { ScrollView } from "react-native-gesture-handler"
import _ from "lodash"
import { workDays } from "../constants/Days"
import ScheduleNotificationsService from "../services/ScheduleNotificationsService"
import ScheduleLoaderService, { ScheduleFile } from "../services/ScheduleLoaderService"
import { SettingsContext } from "../contexts/settingsContext"
import { ensureExtension, ensureNoExtension, isRunningInBrowser } from "../utilities/utilities"
import IntroductoryCarousel from "./IntroductoryCarousel/IntroductoryCarousel"
import AsyncStorage from "@react-native-async-storage/async-storage"
import GetWeekType, { WeekType } from "../utilities/getWeekType"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import AppText from "../shared/AppText"
import ScheduleHeader from "../components/ScheduleComponents/ScheduleHeader"
import { Event } from "../constants/Events"

// TODO: scroll to current day on mount only instead of doing so on every rerender?

export default function ScheduleScreen({ isEditable = false }: { isEditable: boolean }) {
  // [web] a workaround to render drawer menu content without explicitly opening it

  if (isRunningInBrowser()) {
    const navigation = useNavigation()
    navigation.openDrawer()
    navigation.closeDrawer()
  }

  // const { showBoundary } = useErrorBoundary()
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

  const scheduleNameStateRef = useRef<string>()
  scheduleNameStateRef.current = scheduleName

  const [weekType, setWeekType] = React.useState<WeekType>(GetWeekType())

  const onSettingsUpdated = useCallback(
    async (settingsService: SettingsService) => {
      // if schedule didn't change then there is nothing to do here
      console.log(" - - - deciding whether to update schedule or not - - -")
      let settingsScheduleName = ensureNoExtension(settingsService.currentScheduleName, ".json")
      let currentScheduleName = ensureNoExtension(scheduleNameStateRef.current, ".json")
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
        // (in editor, everything is always unfolded and there is no need to update)
        if (isEditable) return
        setState({})
      }
    },
    [scheduleName]
  )

  useEffect(() => {
    async function onMount() {
      let settingsService = await SettingsService.GetInstance()

      console.log("[Schedule.tsx] settingsService instance: ", settingsService)

      let scheduleLoaderInstance = await ScheduleLoaderService.GetInstance()

      settingsServiceRef.current = settingsService

      let schedule = new ScheduleModel("groupname_groupyear", "groupname", 5)

      // check whether the schedule that settings service is referencing exists. Otherwise load first available schedule
      let scheduleFile = scheduleLoaderInstance.getScheduleFileByFileName(settingsService.currentScheduleName)
      let firstScheduleFile = scheduleLoaderInstance.scheduleFiles[0]

      scheduleFileRef.current = _.cloneDeep(scheduleFile ?? firstScheduleFile)

      await schedule.getScheduleFromScheduleLoader(
        scheduleFile ? settingsService.currentScheduleName : firstScheduleFile.filename
      )

      // configure notifications for schedule, but only if it's not in editor
      if (!isEditable) {
        ScheduleNotificationsService.GetInstance().then((i) => {
          console.log("will call configureNotificationsForSchedule on schedule: ", schedule.name)
          i.configureNotificationsForSchedule(schedule)
        })
      }

      console.log("[Schedule.tsx] schedule: ", schedule)

      settingsService.SettingsEventEmmiter.on(Event.SETTINGS_UPDATED, onSettingsUpdated)
      console.log("subscribed to settings updated event")
      console.log("n of subscribers: ", settingsService.SettingsEventEmmiter.listenerCount(Event.SETTINGS_UPDATED))

      scheduleRef.current = schedule

      setIsFirstTimeLaunch(await AsyncStorage.getItem("isFirstTimeLaunch"))

      setScheduleName(schedule.name)
      setScheduleLoaded(true)
    }

    onMount()

    return () => {
      SettingsService.GetInstance().then((settingsService: SettingsService) => {
        settingsService.SettingsEventEmmiter.removeListener(Event.SETTINGS_UPDATED, onSettingsUpdated)
      })
    }
  }, [])

  const onWeekTypeChanged = (weekType: number) => {
    console.log("week type changed to: ", weekType)
    // display toast message if in editor
    // switching to it takes longer...
    if (isEditable) {
      // TODO: make cross platform version of toast
      if (!isRunningInBrowser()) {
        ToastAndroid.show("Завантаження...", ToastAndroid.LONG)
      }
    }
    setWeekType(weekType)
  }

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
          <ActivityIndicator size="large" animating={true} color={palette.navigationBackground} />
        </View>
      </View>
    )
  }

  // TODO: implement web version of Onboarding screen
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
          {/* explanatory card if in editor */}

          {isEditable ? (
            <View style={[styles.scheduleDayCard]}>
              <View
                style={[
                  {
                    marginVertical: 5,
                    paddingHorizontal: 10,
                    paddingLeft: 5,
                    paddingVertical: 3,
                  },
                  { flexDirection: "row" },
                ]}
              >
                <View
                  style={[
                    {
                      marginRight: 5,
                    },
                  ]}
                >
                  <Image source={editorImages.lightbulb} style={{ height: 50, width: 50 }} />
                </View>
                <View>
                  {/* TODO: bolden the action words */}
                  <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
                    Перемістити: затиснути та перетягнути
                  </AppText>

                  <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
                    Видалити: свайп ліворуч
                  </AppText>

                  <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
                    Редагувати: натиснути на пару
                  </AppText>
                </View>
              </View>
            </View>
          ) : null}
          {/* temp slice for performance reasons */}
          {workDays.slice(0, 111).map((day, idx) => {
            const item = day
            const isEmpty = scheduleRef.current!.scheduleDays[idx].getCurrentWeekClasses().length === 0
            const shouldDisplayEmptyDay = settingsServiceRef.current!.displayEmptyDays != DisplayEmptyDaysMode.Hide

            if (!isEditable && isEmpty && !shouldDisplayEmptyDay) {
              return <View style={globalStyles.noDisplay} key={day + weekType}></View>
            }

            let scheduleDay = scheduleRef.current!.scheduleDays[idx]
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
    </SettingsContext.Provider>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    // width: "70%",
    // alignSelf: "center",

    // paddingBottom: 60,
    ...globalStyles.screen,

    // flex: 0,
    backgroundColor: "#F5F5F5",
  },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },

  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },

  modalContent: {
    flex: 1,
  },

  selected: {
    backgroundColor: "white",
    color: "black",
    padding: 5,
    borderRadius: 10,
    marginBottom: 5,
  },

  placeholderView: {
    height: 35,
  },
  cardContainer: {
    // height: 350,
    padding: 5,
  },

  scheduleDaySelector: {
    padding: 5,
    zIndex: 9999,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  scheduleDayCard: {
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "white",

    paddingVertical: 2,
    paddingHorizontal: 5,

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
