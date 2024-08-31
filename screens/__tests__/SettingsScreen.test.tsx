import { render, screen, fireEvent } from "@testing-library/react-native"
import SettingsScreen from "../SettingsScreen/SettingsScreen"
import SettingsService from "../../services/SettingsService/SettingsService"
import { ensureNoExtension } from "../../utilities/utilities"

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native")
  return {
    Ionicons: View,
  }
})

jest.mock("react-native-vector-icons/FontAwesome", () => {
  const { View } = require("react-native")
  return View
})

jest.mock("react-native-vector-icons/Entypo", () => {
  const { View } = require("react-native")
  return View
})

describe("<SettingsScreen />", () => {
  it("renders correctly", async () => {
    let settingsService = await SettingsService.GetInstance()
    let currentSchedule = ensureNoExtension(settingsService.currentScheduleName, ".json")

    let renderedComponent = render(<SettingsScreen />)

    const myScheduleCaption = await renderedComponent.findByText("Мій розклад")
    const currentScheduleCaption = await renderedComponent.findByText(currentSchedule)

    expect(myScheduleCaption).toBeTruthy()
    expect(currentScheduleCaption).toBeTruthy()
  })

  it("changes schedule correctly", async () => {
    // arrange

    let settingsService = await SettingsService.GetInstance()
    let currentSchedule = ensureNoExtension(settingsService.currentScheduleName, ".json")
    let newScheduleName = "КН-example"

    let renderedComponent = render(<SettingsScreen />)

    const changeScheduleButton = await renderedComponent.findByText(currentSchedule)

    let modalHeaderText = "Вибери свою групу"

    // act & assert
    expect(() => screen.getByText(modalHeaderText)).toThrow()

    fireEvent.press(changeScheduleButton)

    expect(await screen.findByText(modalHeaderText)).toBeTruthy()

    fireEvent.press(await screen.findByText(newScheduleName))

    expect(() => screen.getByText(modalHeaderText)).toThrow()

    expect(await screen.findByText(newScheduleName)).toBeTruthy()
  })

  it("updates SettingsService correctly", async () => {
    let settingsService = await SettingsService.GetInstance()
    let shouldDisplayRoomNumber = settingsService.displayRoomNumber

    let renderedComponent = render(<SettingsScreen />)

    const showRoomNumberSwitch = await renderedComponent.findByTestId("showRoomNumberSwitch")

    // act & assert

    fireEvent(showRoomNumberSwitch, "valueChange", !shouldDisplayRoomNumber)

    expect(settingsService.displayRoomNumber).not.toBe(shouldDisplayRoomNumber)
  })
})
