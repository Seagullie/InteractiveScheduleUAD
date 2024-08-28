import { REGLAMENT_DATA } from "../../constants/Constants"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService.native"
import GetWeekType from "../../utilities/getWeekType"
import { setDayOnDate } from "../../utilities/utilities"
import ScheduleModel from "../ScheduleModel"
import { ScheduleDay } from "../ScheduleDay"

function isDayOff(day: ScheduleDay) {
  return day.classes.length === 0
}

async function getSampleSchedule() {
  const scheduleLoader = await ScheduleLoaderService.GetInstance()
  const schedule = new ScheduleModel("test schedule", "test schedule description", 5)
  await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

  return schedule
}

async function getSampleClass(schedule: ScheduleModel) {
  const studyDay = schedule.scheduleDays.filter((day) => !isDayOff(day))[0]

  const sampleClass = studyDay.classes[0]

  return sampleClass
}

describe("ScheduleModel", () => {
  it("loads data from ScheduleLoader", async () => {
    // -- arrange --

    const scheduleLoader = await ScheduleLoaderService.GetInstance()
    const schedule = new ScheduleModel("test schedule", "test schedule description", 5)

    // -- act --

    await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

    // -- assert --

    expect(schedule.scheduleDays.length).toBeGreaterThan(0)
  })

  it("gets current class", async () => {
    // -- arrange --

    const schedule = await getSampleSchedule()

    const studyDay = schedule.scheduleDays.filter((day) => !isDayOff(day))[0]

    // const sampleClass = studyDay.classes[0]
    const sampleClass = await getSampleClass(schedule)

    const sampleClassWeekDay = studyDay.name

    let sampleClassDate = new Date("2023-05-05")
    sampleClassDate = setDayOnDate(sampleClassDate, schedule.dayNames.indexOf(sampleClassWeekDay))

    // debugger

    jest.useFakeTimers().setSystemTime(sampleClassDate)

    // TODO: abstract time matching logic into own function

    // match week types
    if (sampleClass.isBiweekly) {
      const currentWeekType = GetWeekType() + 1
      if (currentWeekType != sampleClass.week) {
        sampleClassDate.setDate(sampleClassDate.getDate() + 7)
      }
    }

    // debugger

    // match hours
    const sampleClassHourString = REGLAMENT_DATA[sampleClass.index - 1][1]
    const sampleClassHour = parseInt(sampleClassHourString.split(":")[0])
    const sampleClassMinute = parseInt(sampleClassHourString.split(":")[1])

    sampleClassDate.setHours(sampleClassHour)
    sampleClassDate.setMinutes(sampleClassMinute + 5)

    jest.useFakeTimers().setSystemTime(sampleClassDate)

    // -- act --

    const currentClass = schedule.getCurrentClass()

    // -- assert --

    expect(currentClass).toEqual(sampleClass)
  })
})
