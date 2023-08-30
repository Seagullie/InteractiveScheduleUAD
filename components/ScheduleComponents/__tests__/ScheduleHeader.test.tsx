import { render, screen, fireEvent } from "@testing-library/react-native"
import ScheduleHeader, { scheduleHeaderStyles } from "../ScheduleHeader"
import GetWeekType, { WeekType } from "../../../utilities/getWeekType"
import { DrawerRoutes } from "../../../routes/DrawerRoutes"

const mockViewerRoute = DrawerRoutes.VIEWER

import * as FileSystem from "expo-file-system"
import * as Header from "../../Header"

// TODO: annotate
// TODO: implement
jest.spyOn(Header, "getIcon").mockImplementation((navigation, headerText: string) => {
  return headerText
})

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

function getScheduleHeader() {
  let onWeekTypeChangedFn = jest.fn()
  let headerTitle = mockViewerRoute

  return <ScheduleHeader title={headerTitle} onWeekTypeChanged={onWeekTypeChangedFn} />
}

// TODO: add more tests
describe("<ScheduleHeader />", () => {
  it("renders properly", async () => {
    let headerTitle = mockViewerRoute

    let renderedComponent = render(getScheduleHeader())

    expect(renderedComponent.getByText(headerTitle)).toBeTruthy()
  })

  it("calls onWeekTypeChanged callback on week type change", async () => {
    let onWeekTypeChangedFn = jest.fn()
    let headerTitle = mockViewerRoute

    let renderedComponent = render(<ScheduleHeader title={headerTitle} onWeekTypeChanged={onWeekTypeChangedFn} />)

    let currentWeekType = GetWeekType(new Date())

    let oppositeWeekTypeText = currentWeekType === WeekType.Nominator ? "Знам" : "Чис"

    let weekTypeTextElement = renderedComponent.getByText(oppositeWeekTypeText)

    fireEvent.press(weekTypeTextElement)

    // expect onWeekTypeChanged to be called at least once
    expect(onWeekTypeChangedFn).toHaveBeenCalledTimes(1)
  })

  it("highlights currently selected week", async () => {
    let renderedComponent = render(getScheduleHeader())

    let currentWeekType = GetWeekType(new Date())
    let currentWeekTypeText = currentWeekType === WeekType.Nominator ? "Чис" : "Знам"

    let weekTypeTextElement = renderedComponent.getByText(currentWeekTypeText)

    expect(weekTypeTextElement).toHaveStyle(scheduleHeaderStyles.selectedText)

    let oppositeWeekTypeText = currentWeekType === WeekType.Nominator ? "Знам" : "Чис"

    let oppositeWeekTypeTextElement = renderedComponent.getByText(oppositeWeekTypeText)

    fireEvent.press(oppositeWeekTypeTextElement)

    expect(oppositeWeekTypeTextElement).toHaveStyle(scheduleHeaderStyles.selectedText)
  })
})
