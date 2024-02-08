import AsyncStorage from "@react-native-async-storage/async-storage"
import EventEmitter from "events"
import ScheduleLoaderService from "./ScheduleLoaderService"
import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import * as IntentLauncher from "expo-intent-launcher"
import { NOTIFICATIONS_CHANNEL_ID } from "../constants/Constants"
import { STORAGE_KEY } from "../constants/Keys"
import { Event } from "../constants/Events"

// TODO: avoid creating duplicate handlers for "settings updated" event

export enum DisplayEmptyDaysMode {
  Display = "Відображати",
  Darken = "Затемняти",
  Hide = "Приховати",
}

export enum DisplayTeacherMode {
  Full = "ПІБ",
  SurnameAndInitials = "Прізвище та ініціали",
  Hide = "Приховати",
}

// update place 1 for new setting
export type ScheduleAppSettings = {
  currentScheduleName: string
  notifyBeforeClass: boolean
  notifyBeforeClassOffsetMinutes: number
  displayRoomNumber: boolean
  displayTeacherName: DisplayTeacherMode

  displayEmptyRows: boolean // TODO: use enum here
  displayEmptyDays: DisplayEmptyDaysMode
}

interface ISettingsService extends ScheduleAppSettings {
  saveToStorage: () => Promise<void>
  readFromStorage: () => Promise<ScheduleAppSettings | null>
}

// update place 2 for new setting
// as of now in order to add a new setting you have to modify 2 places
// that doesn't sound great.
// make sure you start with ScheduleAppSettings type

/**
 * Represents a service for managing settings in the application.
 * Loads and saves settings to async storage. Provides a way to subscribe to settings change event.
 */
export default class SettingsService implements ISettingsService {
  displayEmptyDays: DisplayEmptyDaysMode = DisplayEmptyDaysMode.Display
  currentScheduleName = "" // Object.keys(scheduleFilesJSON)[0] // this has to match the name of the file in assets/schedules
  notifyBeforeClass = true
  notifyBeforeClassOffsetMinutes = 0
  displayRoomNumber = true
  displayTeacherName = DisplayTeacherMode.Full
  displayEmptyRows = true

  private static instance: SettingsService

  SettingsEventEmitter: EventEmitter = new EventEmitter()

  static async GetInstance(): Promise<SettingsService> {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService()
      await SettingsService.instance.init()
      console.log("settings service instance constructed successfully")
    }

    return SettingsService.instance
  }

  private async init() {
    // get first schedule from ScheduleLoaderService and use it as default

    let scheduleLoader = await ScheduleLoaderService.GetInstance()
    this.currentScheduleName = scheduleLoader.scheduleFiles[0].filename

    const fetchedSettings = await this.readFromStorage()
    if (!fetchedSettings) return

    // gotta make sure that each and every property is set

    console.log("[SettingsService] fetched settings:")
    console.log(fetchedSettings)

    console.log("settings fetched. Populating properties...")
    for (const [key, value] of Object.entries(fetchedSettings)) {
      console.log(`[fetched settings] ${key}: ${value}`)
      this[key] = value
    }

    console.log(`[SettingsService] current schedule name: ${this.currentScheduleName}`)
    if (this.currentScheduleName == "" || this.currentScheduleName == ".json") {
      console.log("current schedule name is empty. setting it to default...")
      this.currentScheduleName = scheduleLoader.scheduleFiles[0].filename
    }

    // TODO: remove this before next publish
    this.SettingsEventEmitter = new EventEmitter()
  }

  // TODO: move all settings to separate object
  constructSettingsObjectFromProperties(): ScheduleAppSettings {
    let settingsObject = { ...this }

    // exclude event emitter from settings object

    delete settingsObject.SettingsEventEmitter

    return settingsObject
  }

  // TODO: Refactor
  // "settings updated" event should be emmitted every time they're updated, but not necessarily saved to storage
  async saveToStorage() {
    try {
      const settingsObject = this.constructSettingsObjectFromProperties()
      const jsonValue = JSON.stringify(settingsObject)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)

      this.SettingsEventEmitter.emit(Event.SETTINGS_UPDATED, this)
    } catch (e) {
      // saving error
      console.error(e)
    }
  }

  async readFromStorage(): Promise<ScheduleAppSettings | null> {
    try {
      console.log("trying to read settings from storage... storage key is: ", STORAGE_KEY)
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log("failed to parse whatever was read from settings. returning null...")
      // error reading value
      console.error(e)
      return null
    }
  }

  async openAndroidSystemSettingsForNotifications() {
    // const pkg = Constants.manifest.android.package
    const pkg = Constants.expoConfig.android.package

    const channel = await Notifications.getNotificationChannelAsync(NOTIFICATIONS_CHANNEL_ID)
    const allChannels = await Notifications.getNotificationChannelsAsync()
    console.log("[Notification Tests] All channels of this app: ")
    console.log(allChannels)
    console.log("[Notification Tests] Channel id for main channel: " + channel?.id)

    // TODO: fix expo go notification settings not opening when the code is running in expo go

    IntentLauncher.startActivityAsync("android.settings.CHANNEL_NOTIFICATION_SETTINGS", {
      // data: "package:" + pkg,
      extra: {
        "android.provider.extra.CHANNEL_ID": pkg == "host.exp.exponent" ? "expo-experience" : NOTIFICATIONS_CHANNEL_ID,
        "android.provider.extra.APP_PACKAGE": pkg,
      },
    })
  }
}
