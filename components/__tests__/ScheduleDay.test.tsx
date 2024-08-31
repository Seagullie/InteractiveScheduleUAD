import { render } from "@testing-library/react-native"
import ScheduleDay from "../ScheduleComponents/ScheduleDayComponent/ScheduleDay"
import { getFirstSchedule } from "./ScheduleClass.test"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import { SettingsContext } from "../../contexts/settingsContext"
import SettingsService from "../../services/SettingsService/SettingsService"

jest.mock("@react-navigation/native")

// make schedule loader return example schedules
jest
  .spyOn(ScheduleLoaderService.prototype, "getSchedulesFromFileSystem")
  .mockImplementation(async () => ScheduleLoaderService.prototype.getExampleSchedules())

describe("<ScheduleDay />", () => {
  // in viewer

  it("renders correctly", async () => {
    let sampleSchedule = await getFirstSchedule()
    let dayClasses = sampleSchedule.scheduleDays[1].classes
    let firstClass = dayClasses[0]

    let settingsService = await SettingsService.GetInstance()

    const renderedComponent = render(
      <SettingsContext.Provider value={settingsService}>
        <ScheduleDay
          classesCollection={dayClasses}
          scheduleObject={sampleSchedule}
          dayName={"Вівторок"}
          scheduleDay={sampleSchedule.scheduleDays[1]}
          displayRoomNumber={true}
          weekType={1}
          fade={false}
          isEditable={false}
        />
      </SettingsContext.Provider>
    )

    expect(renderedComponent.getByText(firstClass.name)).toBeTruthy()
  })

  it("shows no classes text properly", async () => {
    let sampleSchedule = await getFirstSchedule()

    const renderedComponent = render(
      <ScheduleDay
        classesCollection={[]}
        scheduleObject={sampleSchedule}
        dayName={"Вівторок"}
        scheduleDay={sampleSchedule.scheduleDays[1]}
        displayRoomNumber={true}
        weekType={1}
        fade={false}
        isEditable={false}
      />
    )

    expect(renderedComponent.getByTestId("noClassesText")).toBeTruthy()
  })

  // in editor
})
