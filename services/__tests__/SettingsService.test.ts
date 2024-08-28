import AsyncStorage from "@react-native-async-storage/async-storage"
import SettingsService from "../SettingsService/SettingsService"
import { ScheduleAppSettings } from "../SettingsService/Types"
import { STORAGE_KEY } from "../../constants/Keys"
import { Event } from "../../constants/Events"

beforeEach(() => {
  // delete already existing instance for .init() to run again
  SettingsService.instance = null

  // resets spy statistics, but not implementation
  jest.clearAllMocks()
})

describe("Settings Service", () => {
  // TODO: fix the types
  // const asyncStorage: typeof AsyncStorage.default = AsyncStorage

  it("initiates properly when run for the first time & no settings have been persisted to async storage", async () => {
    // const asyncStorage = AsyncStorage
    // const asyncStorageEverything = AsyncStorageEverything
    // console.log("[Settings Service Test] Mocked Async Storage", asyncStorage)
    // console.log("[Settings Service Test] Mocked Async Storage Everything", asyncStorageEverything)

    const settingService = await SettingsService.GetInstance()

    expect(settingService.currentScheduleName).toBeTruthy()
  })

  it("initiates properly by reading persisted settings from async-storage", async () => {
    // -- arrange --

    const settingsObject: ScheduleAppSettings = {
      notifyBeforeClassOffsetMinutes: 20,
    }
    const jsonValue = JSON.stringify(settingsObject)

    AsyncStorage.setItem("notifyBeforeClassOffsetMinutes", "20")
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue)

    // -- act --

    const settingService = await SettingsService.GetInstance()

    // -- assert --

    expect(settingService.notifyBeforeClassOffsetMinutes).toBe(20)
  })

  it("constructs settings object from service properties", async () => {
    // -- arrange --

    // -- act --

    const settingService = await SettingsService.GetInstance()
    const settingsObject = settingService.constructSettingsObjectFromProperties()

    // -- assert --

    // expect settings object to not have empty values

    expect(Object.values(settingsObject).every((value) => Boolean(value) || value == 0)).toBeTruthy()
  })

  it("notifies subscribers when settings are saved to storage", async () => {
    const settings = await SettingsService.GetInstance()

    const onSettingsSaved = jest.fn()
    settings.SettingsEventEmitter.on(Event.SETTINGS_UPDATED, onSettingsSaved)

    await settings.saveToStorage()

    expect(settings.SettingsEventEmitter.listenerCount(Event.SETTINGS_UPDATED)).toBe(1)
    expect(onSettingsSaved).toHaveBeenCalledTimes(1)
    expect(onSettingsSaved).toHaveBeenCalledWith(settings)
  })
})
