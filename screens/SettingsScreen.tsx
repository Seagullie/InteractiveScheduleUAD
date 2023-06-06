import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import EntypoIcon from "react-native-vector-icons/Entypo"
import { ScrollView } from "react-native"
import CustomSwitch from "../shared/Switch"
import SettingsService, { DisplayEmptyDaysMode, DisplayTeacherMode } from "../services/SettingsService"
import { globalStyles, palette } from "../styles/global"
import { TouchableOpacity } from "react-native-gesture-handler"
import OptionPickerModal from "../components/OptionPickerModal"
import ScheduleNotificationsService from "../services/ScheduleNotificationsService"
import ScheduleModel from "../models/ScheduleModel"
import ScheduleLoaderService from "../services/ScheduleLoaderService"
import { ensureExtension, ensureNoExtension } from "../utilities/utilities"
import AppText from "../shared/AppText"
import FlatButton from "../shared/Button"
import OutlinedButton from "../shared/OutlinedButton"
import { Ionicons } from "@expo/vector-icons"

// TODO: Fix settings page visually spazzing out on mount
// it's not the switches
// it's not the effect that saves updated settings to disk
// it's not notification events updating state
// it's not other setters
// this is something that only happens when the main content is rendered
// removing activity indicator as alternative layout breaks settings service integration and makes schedule picker fail to load options
// hell. Let's start with simply refactoring the layout into components

export default function Settings() {
  let [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  const settingsServiceRef = React.useRef<SettingsService | null>(null)

  // Note: Update place 0
  let [settingsValues, setSettingsValues] = useState({
    selectedSchedule: "",
    displayRoomNumber: false,
    notifyBeforeClass: false,
    displayEmptyDays: "...",
    displayTeacherName: "...",
    notifyBeforeClassOffsetMinutes: 0,
  })

  let [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)
  let [schedulePickerModalDisabled, setSchedulePickerModalDisabled] = useState(false)

  let [emptyDayDisplayModalVisible, setEmptyDayDisplayModalVisible] = useState(false)

  let [displayTeacherModeModalVisible, setDisplayTeacherModeModalVisible] = useState(false)
  let [notifyBeforehandModalVisible, setNotifyBeforehandModalVisible] = useState(false)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function onMount() {
      const settingsService = await SettingsService.GetInstance()
      settingsServiceRef.current = settingsService

      // Note: Update place 1

      let {
        currentScheduleName,
        displayRoomNumber,
        notifyBeforeClass,
        displayEmptyDays,
        displayTeacherName,
        notifyBeforeClassOffsetMinutes,
      } = settingsServiceRef.current

      setSettingsValues({
        selectedSchedule: ensureNoExtension(currentScheduleName, ".json"),
        displayRoomNumber,
        notifyBeforeClass,
        displayEmptyDays,
        displayTeacherName,
        notifyBeforeClassOffsetMinutes,
      })

      console.log("[settings screen init] settingsService.currentSchedule:", settingsService.currentScheduleName)

      // setDisplayEmptyDayMode(settingsServiceRef.current.displayEmptyDays)

      // disable schedule picker modal when notifications are being configured
      const notifService = await ScheduleNotificationsService.GetInstance()

      notifService.onConfigureNotificationsForScheduleStart = () => {
        setSchedulePickerModalDisabled(true)
        // ToastAndroid.show("Configuring notifications...", ToastAndroid.SHORT)
      }
      notifService.onConfigureNotificationsForScheduleEnd = () => {
        setSchedulePickerModalDisabled(false)

        // ToastAndroid.show("Notifications have been configured", ToastAndroid.SHORT)
      }

      let scheduleLodaderInstance = await ScheduleLoaderService.GetInstance()

      let schedulePickerData = scheduleLodaderInstance.scheduleFiles.map((f) => ensureNoExtension(f.filename, ".json"))
      setSchedulePickerData(schedulePickerData)

      setIsReady(true)
    }
    onMount()
  }, [])

  // write settings to disk on each update to make sure they aren't lost
  useEffect(() => {
    if (!isReady) return

    // Note: Update place 2
    let {
      selectedSchedule,
      displayRoomNumber,
      notifyBeforeClass,
      displayEmptyDays,
      displayTeacherName,
      notifyBeforeClassOffsetMinutes,
    } = settingsValues

    // TODO: Refactor this
    let settingsService = settingsServiceRef.current!
    settingsService.currentScheduleName = ensureExtension(selectedSchedule, ".json")
    settingsService.displayRoomNumber = displayRoomNumber
    settingsService.notifyBeforeClass = notifyBeforeClass
    settingsService.displayEmptyDays = displayEmptyDays as DisplayEmptyDaysMode
    settingsService.displayTeacherName = displayTeacherName as DisplayTeacherMode
    settingsService.notifyBeforeClassOffsetMinutes = notifyBeforeClassOffsetMinutes

    settingsService.saveToStorage()
  }, [settingsValues])
  async function toggleNotifs(enable: boolean) {
    let scheduleNotifService = await ScheduleNotificationsService.GetInstance()
    if (enable) {
      // TODO: Refactor. Find a way to reference currently selected schedule in ScheduleScreen
      let schedule = new ScheduleModel("foo", "bar", 99)
      schedule.getScheduleFromScheduleLoader(settingsServiceRef.current!.currentScheduleName)
      scheduleNotifService.configureNotificationsForSchedule(schedule)
    } else {
      await scheduleNotifService.cancelAllScheduledNotificationsAsync()
    }
  }

  function constructSettingsRow(settingDescription: string, changeSettingComponent: JSX.Element) {
    return (
      <View style={styles.settingRow}>
        <AppText style={styles.settingName}>{settingDescription}</AppText>
        {changeSettingComponent}
      </View>
    )
  }

  if (!isReady) {
    return (
      <View
        style={[
          { flex: 1, justifyContent: "center", alignItems: "center" },
          styles.loadingIndicatorOverlay,
          isReady ? globalStyles.noDisplay : {},
        ]}
      >
        <ActivityIndicator size="large" color={palette.navigationBackground} />
      </View>
    )
  }

  // setTimeout(() => {
  //   setIsReady(true)
  // }, 500)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollViewDirect} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.pageBackground}>
          <View style={styles.notificationHeader}>
            <FontAwesomeIcon name="bell-o" style={styles.settingsSectionIcon}></FontAwesomeIcon>
            <AppText style={styles.settingsSectionName}>Сповіщення</AppText>
          </View>
          <View style={styles.settingsCategory}>
            <View style={styles.settingRow}>
              <AppText style={styles.settingName}>Нагадувати про початок пари</AppText>
              <CustomSwitch
                onValueChange={(nv) => {
                  setSettingsValues({
                    ...settingsValues,
                    notifyBeforeClass: nv,
                  })

                  toggleNotifs(nv)
                }}
                initVal={settingsValues.notifyBeforeClass}
                disabled={false}
              />
            </View>
            <View style={styles.separator}></View>

            <View style={styles.settingRow}>
              <AppText style={styles.settingName}>Сповіщати заздалегідь</AppText>

              <TouchableOpacity onPress={() => setNotifyBeforehandModalVisible(true)}>
                <View style={styles.settingValueContainer}>
                  <AppText style={styles.settingValue}>
                    {settingsValues.notifyBeforeClassOffsetMinutes + " хв."}
                  </AppText>
                  <EntypoIcon name="chevron-small-right" style={styles.grayIcon}></EntypoIcon>
                </View>
              </TouchableOpacity>

              <OptionPickerModal
                hasSearchBar={false}
                isOpen={notifyBeforehandModalVisible}
                initialOptions={[0, 5, 10, 15, 20].map((n) => n + " хв.")}
                initialSelectedOption={settingsValues.notifyBeforeClassOffsetMinutes + " хв."}
                closeModal={() => setNotifyBeforehandModalVisible(false)}
                onSelected={(selected) => {
                  let selectedInt = parseInt(selected)
                  setSettingsValues({
                    ...settingsValues,
                    notifyBeforeClassOffsetMinutes: selectedInt,
                  })

                  toggleNotifs(settingsValues.notifyBeforeClass)
                }}
              />
            </View>

            <View style={styles.separator}></View>

            {constructSettingsRow(
              "Звук, місце появи сповіщення та ін.",
              <View style={[styles.settingValueContainer, { marginRight: 3 }]}>
                {/* TODO: Unhardcode margin right */}

                <TouchableOpacity onPress={settingsServiceRef.current?.openSystemSettingsForNotifications}>
                  <Ionicons name="open" size={14} color={palette.navigationBackground} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.notificationHeader}>
            <FontAwesomeIcon name="calendar-o" style={styles.settingsSectionIcon}></FontAwesomeIcon>
            <AppText style={styles.settingsSectionName}>Розклад</AppText>
          </View>
          <View style={styles.settingsCategory}>
            <View>
              <View>
                <View style={styles.settingRow}>
                  <AppText style={styles.settingName}>Мій розклад</AppText>

                  <TouchableOpacity
                    onPress={() => {
                      console.log("selected schedule before toggling modal:", settingsValues.selectedSchedule)
                      setSchedulePickerModalVisible(true)
                    }}
                    disabled={schedulePickerModalDisabled}
                    style={styles.centeredTextAndIcon}
                  >
                    {/* TODO: Remove hardcoded margins. Those were set to make activity indicator and actual content to have same size */}

                    {schedulePickerModalDisabled ? (
                      <ActivityIndicator
                        style={{ marginRight: 10, marginVertical: 3.5 }}
                        size="small"
                        color={palette.navigationBackground}
                      />
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <AppText style={styles.settingValue}>
                          {ensureNoExtension(settingsValues.selectedSchedule, ".json")}
                        </AppText>
                        <EntypoIcon name="chevron-small-right" style={styles.grayIcon}></EntypoIcon>
                      </View>
                    )}

                    {/* TODO: remove the temp fix. The issue is that I don't know why updated prop doesn't rerender the modal */}
                    {settingsValues.selectedSchedule != "" ? (
                      <OptionPickerModal
                        headerText="Вибери свою групу"
                        isOpen={schedulePickerModalVisible}
                        initialOptions={schedulePickerData}
                        initialSelectedOption={settingsValues.selectedSchedule}
                        closeModal={() => setSchedulePickerModalVisible(false)}
                        onSelected={(selected) => {
                          setSettingsValues({
                            ...settingsValues,
                            selectedSchedule: ensureExtension(selected, ".json"),
                          })
                        }}
                      />
                    ) : (
                      <View style={globalStyles.noDisplay} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.separator} />

                <View style={styles.settingRow}>
                  <AppText style={styles.settingName}>Відображати номер аудиторії</AppText>
                  <CustomSwitch
                    initVal={settingsValues.displayRoomNumber}
                    onValueChange={(nv) => {
                      setSettingsValues({
                        ...settingsValues,
                        displayRoomNumber: nv,
                      })
                    }}
                    disabled={false}
                  ></CustomSwitch>
                </View>

                <View style={styles.separator} />

                <View style={styles.settingRow}>
                  <AppText style={styles.settingName}>Відображати викладача</AppText>
                  <TouchableOpacity
                    onPress={() => setDisplayTeacherModeModalVisible(true)}
                    style={styles.centeredTextAndIcon}
                  >
                    <AppText style={styles.settingValue}>{settingsValues.displayTeacherName}</AppText>
                    <EntypoIcon name="chevron-small-right" style={styles.grayIcon}></EntypoIcon>
                  </TouchableOpacity>
                  <OptionPickerModal
                    hasSearchBar={false}
                    isOpen={displayTeacherModeModalVisible}
                    initialOptions={[
                      DisplayTeacherMode.Full,
                      DisplayTeacherMode.SurnameAndInitials,
                      DisplayTeacherMode.Hide,
                    ]}
                    initialSelectedOption={settingsValues.displayTeacherName}
                    closeModal={() => setDisplayTeacherModeModalVisible(false)}
                    onSelected={(selected) => {
                      setSettingsValues({
                        ...settingsValues,
                        displayTeacherName: selected,
                      })
                    }}
                  />
                </View>

                <View style={styles.separator}></View>

                <View style={styles.settingRow}>
                  <AppText style={styles.settingName}>Порожні дні</AppText>
                  <TouchableOpacity
                    onPress={() => setEmptyDayDisplayModalVisible(true)}
                    style={styles.centeredTextAndIcon}
                  >
                    <AppText style={styles.settingValue}>{settingsValues.displayEmptyDays}</AppText>
                    <EntypoIcon name="chevron-small-right" style={styles.grayIcon}></EntypoIcon>
                  </TouchableOpacity>
                  <OptionPickerModal
                    hasSearchBar={false}
                    isOpen={emptyDayDisplayModalVisible}
                    initialOptions={[
                      DisplayEmptyDaysMode.Display,
                      DisplayEmptyDaysMode.Darken,
                      DisplayEmptyDaysMode.Hide,
                    ]}
                    initialSelectedOption={settingsValues.displayEmptyDays}
                    closeModal={() => setEmptyDayDisplayModalVisible(false)}
                    onSelected={(selected) => {
                      setSettingsValues({
                        ...settingsValues,
                        displayEmptyDays: selected,
                      })
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export const styles = StyleSheet.create({
  scrollViewContentContainer: {
    // backgroundColor: "green",
  },

  loadingIndicatorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,

    width: "100%",
    height: "100%",
    backgroundColor: palette.background,

    zIndex: 9999,
  },

  scrollViewDirect: {
    ...globalStyles.screen,
    paddingBottom: 24,
  },

  pageBackground: {
    // minHeight: "100%",
  },

  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginLeft: 24,
  },
  settingsSectionName: {
    fontFamily: "raleway-600",
    color: "rgba(90,90,90,1)",
    fontSize: 14,

    marginLeft: 6,
  },
  iconRow: {
    height: 16,
    flexDirection: "row",
    flex: 1,
    marginRight: -88,
  },
  settingsCategory: {
    padding: 10,
    paddingBottom: 5,
    margin: 11,

    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 9,
  },

  separator: {
    width: "100%",
    height: 1,
    borderWidth: 0,
    borderTopWidth: 1,
    borderColor: "rgba(242,242,242,1)",
  },

  centeredTextAndIcon: {
    flexDirection: "row",
    alignItems: "center",
  },

  розклад: {
    fontFamily: "raleway-600",
    color: "rgba(90,90,90,1)",
    fontSize: 14,
    marginLeft: 7,
  },
  icon6Row: {
    height: 16,
    flexDirection: "row",
    flex: 1,
    marginLeft: -21,
  },

  settingName: {
    fontFamily: "raleway-500",
    color: "rgba(82,82,82,1)",
    fontSize: 15,
  },
  settingValue: {
    fontFamily: "montserrat-medium",
    color: "rgba(136,136,136,1)",
    height: 17,
    textAlign: "right",
    fontSize: 12,
  },
  grayIcon: {
    ...globalStyles.grayIcon,
  },

  settingsSectionIcon: {
    color: "rgba(90,90,90,1)",
    fontSize: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // ^ doesn't work as expected

    marginVertical: 10,
  },
})
