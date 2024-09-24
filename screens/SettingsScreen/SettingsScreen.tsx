// EXTERNAL DEPENDENCIES

import React, { useEffect, useState } from "react"
import { View, ScrollView, ActivityIndicator } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import EntypoIcon from "react-native-vector-icons/Entypo"
import { Ionicons } from "@expo/vector-icons"

// INTERNAL DEPENDENCIES

import CustomSwitch from "../../components/shared/Switch"
import SettingsService from "../../services/SettingsService/SettingsService"
import { DisplayEmptyDaysMode, DisplayTeacherMode, ScheduleAppSettings } from "../../services/SettingsService/Types"
import { globalStyles, palette } from "../../styles/global"
import OptionPickerModal from "../../components/OptionPickerModalComponent/OptionPickerModal"
import ScheduleNotificationsService from "../../services/ScheduleNotificationsService"
import ScheduleModel from "../../models/ScheduleModel/ScheduleModel"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import { ensureExtension, ensureNoExtension, isRunningInBrowser } from "../../utilities/utilities"
import AppText from "../../components/shared/AppText"
import { styles } from "./Styles"

// TODO: Fix settings page visually spazzing out on mount
// it's not the switches
// it's not the effect that saves updated settings to disk
// it's not notification events updating state
// it's not other setters
// this is something that only happens when the main content is rendered
// removing activity indicator as alternative layout breaks settings service integration and makes schedule picker fail to load options
// hell. Let's start with simply refactoring the layout into components

type ScheduleAppSettingsWithoutCurrentScheduleName = Omit<ScheduleAppSettings, "currentScheduleName">

// settings fields are identical to ScheduleAppSettings, except for currentScheduleName. It is represented as selectedSchedule in this component
type SettingFields = Record<keyof ScheduleAppSettingsWithoutCurrentScheduleName | "selectedSchedule", any>

export default function Settings() {
  const settingsServiceRef = React.useRef<SettingsService | null>(null)

  // REACTIVE VARIABLES

  const [schedulePickerData, setSchedulePickerData] = useState<string[]>([])

  // Note: Update place 0
  // TODO: use a type for settingsValues
  const [settingsValues, setSettingsValues] = useState<SettingFields>({
    selectedSchedule: "",
    displayRoomNumber: false,
    notifyBeforeClass: false,
    displayEmptyDays: "...",
    displayTeacherName: "...",
    notifyBeforeClassOffsetMinutes: 0,
  })

  const [schedulePickerModalVisible, setSchedulePickerModalVisible] = useState(false)
  const [schedulePickerModalDisabled, setSchedulePickerModalDisabled] = useState(false)

  const [emptyDayDisplayModalVisible, setEmptyDayDisplayModalVisible] = useState(false)

  const [displayTeacherModeModalVisible, setDisplayTeacherModeModalVisible] = useState(false)
  const [notifyBeforehandModalVisible, setNotifyBeforehandModalVisible] = useState(false)

  const [isReady, setIsReady] = useState(false)

  // EFFECTS

  // mount effect
  useEffect(() => {
    async function onMount() {
      const settingsService = await SettingsService.GetInstance()
      settingsServiceRef.current = settingsService

      // Note: Update place 1

      const {
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

      const scheduleLodaderInstance = await ScheduleLoaderService.GetInstance()

      const schedulePickerData = scheduleLodaderInstance.scheduleFiles.map((f) =>
        ensureNoExtension(f.filename, ".json")
      )
      setSchedulePickerData(schedulePickerData)

      setIsReady(true)
    }
    onMount()
  }, [])

  // settings change effect
  // write settings to disk on each update to make sure they aren't lost
  useEffect(() => {
    if (!isReady) return

    // Note: Update place 2
    const {
      selectedSchedule,
      displayRoomNumber,
      notifyBeforeClass,
      displayEmptyDays,
      displayTeacherName,
      notifyBeforeClassOffsetMinutes,
    } = settingsValues

    // TODO: Refactor this
    const settingsService = settingsServiceRef.current!
    settingsService.currentScheduleName = ensureExtension(selectedSchedule, ".json")
    settingsService.displayRoomNumber = displayRoomNumber
    settingsService.notifyBeforeClass = notifyBeforeClass
    settingsService.displayEmptyDays = displayEmptyDays as DisplayEmptyDaysMode
    settingsService.displayTeacherName = displayTeacherName as DisplayTeacherMode
    settingsService.notifyBeforeClassOffsetMinutes = notifyBeforeClassOffsetMinutes

    settingsService.saveToStorage()
  }, [settingsValues])

  // Used in corresponding onPress callback. Enables or disables schedule notifications
  async function toggleNotifs(enable: boolean) {
    const scheduleNotifService = await ScheduleNotificationsService.GetInstance()
    if (enable) {
      // TODO: Refactor. Find a way to reference currently selected schedule in ScheduleScreen
      const schedule = new ScheduleModel("foo", "bar", 99)
      schedule.getScheduleFromScheduleLoader(settingsServiceRef.current!.currentScheduleName)
      scheduleNotifService.configureNotificationsForSchedule(schedule)
    } else {
      await scheduleNotifService.cancelAllScheduledNotificationsAsync()
    }
  }

  if (!isReady) {
    // return spinner
    return ActivityIndicatorLarge
  }

  // setTimeout(() => {
  //   setIsReady(true)
  // }, 500)

  // notifications aren't implemented in browser (although they could have been)
  const notificationsSection = !isRunningInBrowser() ? (
    <View>
      {constructCategoryHeader(
        "Сповіщення",
        <FontAwesomeIcon name="bell-o" style={styles.settingsSectionIcon}></FontAwesomeIcon>
      )}

      <View style={styles.settingsCategory}>
        {constructSettingsRow(
          "Нагадувати про початок пари",
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
        )}
        <View style={styles.separator}></View>

        {constructSettingsRow(
          "Сповіщати заздалегідь",
          <View>
            <TouchableOpacity onPress={() => setNotifyBeforehandModalVisible(true)}>
              <View style={styles.settingValueContainer}>
                <AppText style={styles.settingValue}>{settingsValues.notifyBeforeClassOffsetMinutes + " хв."}</AppText>
                <EntypoIcon name="chevron-small-right" style={styles.grayIcon}></EntypoIcon>
              </View>
            </TouchableOpacity>

            <OptionPickerModal
              hasSearchBar={false}
              isOpen={notifyBeforehandModalVisible}
              options={[0, 5, 10, 15, 20].map((n) => n + " хв.")}
              selectedOption={settingsValues.notifyBeforeClassOffsetMinutes + " хв."}
              onCloseModal={() => setNotifyBeforehandModalVisible(false)}
              onSelected={(selected) => {
                const selectedInt = parseInt(selected)
                setSettingsValues({
                  ...settingsValues,
                  notifyBeforeClassOffsetMinutes: selectedInt,
                })

                toggleNotifs(settingsValues.notifyBeforeClass)
              }}
            />
          </View>
        )}

        <View style={styles.separator}></View>

        {constructSettingsRow(
          "Звук, місце появи сповіщення та ін.",
          <View style={[styles.settingValueContainer, { marginRight: 3 }]}>
            {/* TODO: Unhardcode margin right */}

            <TouchableOpacity onPress={settingsServiceRef.current?.openAndroidSystemSettingsForNotifications}>
              <Ionicons name="open" size={14} color={palette.navigationBackground} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  ) : null

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollViewDirect} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.pageBackground}>
          {notificationsSection}

          {constructCategoryHeader(
            "Розклад",
            <FontAwesomeIcon name="calendar-o" style={styles.settingsSectionIcon}></FontAwesomeIcon>
          )}
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
                        options={schedulePickerData}
                        selectedOption={settingsValues.selectedSchedule}
                        onCloseModal={() => setSchedulePickerModalVisible(false)}
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

                {constructSettingsRow(
                  "Відображати номер аудиторії",
                  <CustomSwitch
                    initVal={settingsValues.displayRoomNumber}
                    onValueChange={(nv) => {
                      setSettingsValues({
                        ...settingsValues,
                        displayRoomNumber: nv,
                      })
                    }}
                  />
                )}

                <View style={styles.separator} />

                {constructSettingsRow(
                  "Відображати викладача",
                  <View>
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
                      options={[
                        DisplayTeacherMode.Full,
                        DisplayTeacherMode.SurnameAndInitials,
                        DisplayTeacherMode.Hide,
                      ]}
                      selectedOption={settingsValues.displayTeacherName}
                      onCloseModal={() => setDisplayTeacherModeModalVisible(false)}
                      onSelected={(selected) => {
                        setSettingsValues({
                          ...settingsValues,
                          displayTeacherName: selected,
                        })
                      }}
                    />
                  </View>
                )}

                <View style={styles.separator}></View>

                {constructSettingsRow(
                  "Порожні дні",
                  <View>
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
                      options={[DisplayEmptyDaysMode.Display, DisplayEmptyDaysMode.Darken, DisplayEmptyDaysMode.Hide]}
                      selectedOption={settingsValues.displayEmptyDays}
                      onCloseModal={() => setEmptyDayDisplayModalVisible(false)}
                      onSelected={(selected) => {
                        setSettingsValues({
                          ...settingsValues,
                          displayEmptyDays: selected,
                        })
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const ActivityIndicatorLarge = (
  <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, styles.loadingIndicatorOverlay]}>
    <ActivityIndicator size="large" color={palette.navigationBackground} />
  </View>
)

// markdown constructors to avoid repeating the same layout code
function constructCategoryHeader(categoryName: string, categoryIcon: JSX.Element) {
  return (
    <View style={styles.categoryHeader}>
      {categoryIcon}
      <AppText style={styles.settingsSectionName}>{categoryName}</AppText>
    </View>
  )
}

function constructSettingsRow(settingDescription: string, changeSettingComponent: JSX.Element) {
  return (
    <View style={styles.settingRow}>
      <AppText style={styles.settingName}>{settingDescription}</AppText>
      {changeSettingComponent}
    </View>
  )
}
