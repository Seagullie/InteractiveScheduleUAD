import NetInfo from "@react-native-community/netinfo"
import _ from "lodash"
import * as FileSystem from "expo-file-system"

import ScheduleLoaderService from "../ScheduleLoaderService/ScheduleLoaderService"

beforeEach(() => {
  // delete already existing instance for init to run again
  ScheduleLoaderService.instance = null

  // resets spy statistics, but not implementation
  jest.clearAllMocks()
})

describe("Schedule Loader Service", () => {
  it("loads schedules from local storage (schedules are available locally)", async () => {
    // -- arrange --

    // debugger
    const getInfoAsyncSpy = FileSystem.getInfoAsync as jest.MockedFunction<typeof FileSystem.getInfoAsync>
    expect(jest.isMockFunction(FileSystem.getInfoAsync)).toBeTruthy()

    // disable checkForUpdatesAsync
    jest.spyOn(ScheduleLoaderService.prototype, "checkForUpdatesAsync").mockResolvedValue(Promise.resolve())

    const getSchedulesFromFileSystemSpy = jest.spyOn(ScheduleLoaderService.prototype, "getSchedulesFromFileSystem")

    // -- act --

    const scheduleLoaderService = await ScheduleLoaderService.GetInstance()

    // -- assert --

    expect(getInfoAsyncSpy).toHaveBeenCalledTimes(1)

    expectLastInvokationToHaveResolvedWith(getInfoAsyncSpy, { exists: true })

    expect(getSchedulesFromFileSystemSpy).toHaveBeenCalledTimes(1)
    expect(scheduleLoaderService.scheduleFiles.length).toBeGreaterThan(0)
    expect(scheduleLoaderService.scheduleFiles[0].filename).toBeTruthy()
  })

  it("loads schedule from contentful (schedules are not available locally)", async () => {
    // -- arrange --

    const getInfoAsyncSpy = jest.spyOn(FileSystem, "getInfoAsync").mockImplementation(() => {
      return Promise.resolve({ exists: false })
    })

    // disable checkForUpdatesAsync
    jest.spyOn(ScheduleLoaderService.prototype, "checkForUpdatesAsync").mockResolvedValue(Promise.resolve())

    const getSchedulesFromContentfulSpy = jest.spyOn(ScheduleLoaderService.prototype, "getSchedulesFromContentful")

    // -- act --

    const scheduleLoaderService = await ScheduleLoaderService.GetInstance()

    // -- assert --

    expect(getInfoAsyncSpy).toHaveBeenCalledTimes(1)
    expectLastInvokationToHaveResolvedWith(getInfoAsyncSpy, { exists: false })

    expect(scheduleLoaderService.scheduleFiles.length).toBeGreaterThan(0)
    expect(getSchedulesFromContentfulSpy).toHaveBeenCalledTimes(1)

    // -- clean up --
    // revert mock implementation of getInfoAsync to that declared in module factory

    const mockGetInfoAsyncImplementation = () => {
      return Promise.resolve({ exists: true })
    }

    jest.spyOn(FileSystem, "getInfoAsync").mockImplementation(mockGetInfoAsyncImplementation)
  })

  it("updates old schedules", async () => {
    // todo: mock new schedules being available

    // -- arrange --

    const getInfoAsyncSpy = jest.spyOn(FileSystem, "getInfoAsync")

    const checkForUpdatesAsyncSpy = jest.spyOn(ScheduleLoaderService.prototype, "checkForUpdatesAsync")
    const getSchedulesFromFileSystemSpy = jest.spyOn(ScheduleLoaderService.prototype, "getSchedulesFromFileSystem")
    const getSchedulesFromContentfulSpy = jest.spyOn(ScheduleLoaderService.prototype, "getSchedulesFromContentful")
    expect(getSchedulesFromContentfulSpy).not.toHaveBeenCalled()

    // -- act --

    const scheduleLoaderService = await ScheduleLoaderService.GetInstance()

    // -- assert --

    expect(getInfoAsyncSpy).toHaveBeenCalledTimes(1)
    expectLastInvokationToHaveResolvedWith(getInfoAsyncSpy, { exists: true })

    expect(scheduleLoaderService.scheduleFiles.length).toBeGreaterThan(0)

    expect(getSchedulesFromContentfulSpy).not.toHaveBeenCalled()
    expect(getSchedulesFromFileSystemSpy).toHaveBeenCalledTimes(1)
    expect(checkForUpdatesAsyncSpy).toHaveBeenCalledTimes(1)

    expect(scheduleLoaderService.scheduleFiles[0].filename).toBeTruthy()
  })

  it("gets example schedules if no internet connection is available", async () => {
    // -- arrange --

    NetInfo.fetch = jest.fn().mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    })

    // -- act --

    const scheduleLoaderService = await ScheduleLoaderService.GetInstance()
    const exampleSchedules = scheduleLoaderService.getExampleSchedules()

    // -- assert --

    expect(exampleSchedules).toEqual(scheduleLoaderService.scheduleFiles)
  })
})

function expectLastInvokationToHaveResolvedWith<ValueT>(invokation: jest.SpyInstance, value: ValueT) {
  const invokationResults = invokation.mock.results
  const lastInvokation = invokationResults[invokationResults.length - 1]
  expect(lastInvokation.value).resolves.toEqual(value)
}
