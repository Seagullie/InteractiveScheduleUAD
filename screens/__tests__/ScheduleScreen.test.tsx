import React from "react"
import { View } from "react-native"
import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react-native"
import ScheduleScreen from "../ScheduleScreen"
import { DrawerRoutes } from "../../routes/DrawerRoutes"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { act } from "react-test-renderer"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"

import * as FileSystem from "expo-file-system"
import * as Header from "../../components/Header"
import { getFirstNonBiweeklyClass, getFirstSchedule } from "../../components/__tests__/ScheduleClass.test"
import GetWeekType, { WeekType } from "../../utilities/getWeekType"

// TODO: annotate
// TODO: implement
jest.spyOn(Header, "getIcon").mockImplementation((navigation, headerText: string) => {
  return headerText
})

jest
  .spyOn(ScheduleLoaderService.prototype, "getSchedulesFromFileSystem")
  .mockImplementation(async () => ScheduleLoaderService.prototype.getExampleSchedules())

const mockViewerRoute = DrawerRoutes.VIEWER
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),

    useFocusEffect: () => jest.fn(),

    useRoute: () => ({
      name: mockViewerRoute,
    }),
  }
})

describe("<ScheduleScreen />", () => {
  it("renders everything correctly", async () => {
    const getInfoAsyncSpy = FileSystem.getInfoAsync as jest.MockedFunction<typeof FileSystem.getInfoAsync>
    expect(jest.isMockFunction(FileSystem.getInfoAsync)).toBeTruthy()

    await AsyncStorage.setItem("isFirstTimeLaunch", "false")

    let sampleSchedule = await getFirstSchedule()
    let sampleDay = getFirstNonBiweeklyClass(sampleSchedule)

    let scheduleScreen = render(<ScheduleScreen isEditable={false} />)

    expect(scheduleScreen.getByText("Чис")).toBeTruthy()
    expect(scheduleScreen.getByText("Знам")).toBeTruthy()

    // wait for activity indicator to disappear

    // let activityIndicator = scheduleScreen.getByTestId("scheduleScreenActivityIndicator")

    // debugger

    // await waitForElementToBeRemoved(activityIndicator.instance)

    expect(await scheduleScreen.findByText(sampleDay.name)).toBeTruthy()
  })

  it("shows schedules of corresponding week type", async () => {
    await AsyncStorage.setItem("isFirstTimeLaunch", "false")

    let sampleSchedule = await getFirstSchedule()
    let scheduleDay = sampleSchedule.scheduleDays[1]
    let dayClasses = scheduleDay.classes

    let dayHasBiweeklyClasses = dayClasses.filter((c) => c.isBiweekly).length > 0
    expect(dayHasBiweeklyClasses).toBeTruthy()

    let nominatorClasses = scheduleDay.getNominatorClasses()
    let denominatorClasses = scheduleDay.getDenominatorClasses()

    let currentWeekType = GetWeekType(new Date())
    let oppositeWeekTypeText = currentWeekType === WeekType.Nominator ? "Знам" : "Чис"

    debugger

    let scheduleScreen = render(<ScheduleScreen isEditable={false} />)

    // check whether all classes of current week are rendered

    let currentWeekClasses = currentWeekType === WeekType.Nominator ? nominatorClasses : denominatorClasses

    await Promise.all(
      currentWeekClasses.map(async (c) => {
        expect(await scheduleScreen.findByText(c.name)).toBeTruthy()
      })
    )

    // switch to opposite week type
    let weekTypeTextElement = await scheduleScreen.findByText(oppositeWeekTypeText)

    fireEvent.press(weekTypeTextElement)

    // check whether all classes of opposite week are rendered
    let oppositeWeekClasses = currentWeekType === WeekType.Nominator ? denominatorClasses : nominatorClasses

    await Promise.all(
      oppositeWeekClasses.map(async (c) => {
        expect(await scheduleScreen.findByText(c.name)).toBeTruthy()
      })
    )
  })
})
