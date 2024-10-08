import { ensureNoExtension } from "../../utilities/utilities"
import ScheduleLoaderService from "../../services/ScheduleLoaderService/ScheduleLoaderService"
import EditedSchedulesStorageService from "../../services/EditedScheduleStorageService/EditedScheduleStorageService"
import { ScheduleClass } from "../ScheduleClass/ScheduleClass"
import { IScheduleClass } from "../ScheduleClass/Types"
import { ScheduleDay } from "../ScheduleDay/ScheduleDay"
import { IScheduleModel, ScheduleDaysJson } from "./Types"

export default class ScheduleModel implements IScheduleModel {
  name: string
  specialtyName: string
  year: number

  // TODO: move to constants
  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) =>
    day.toLowerCase()
  )
  weekendDays = ["saturday", "sunday"]
  // eslint-disable-next-line no-array-constructor -- won't get same type hints with []
  scheduleDays = new Array<ScheduleDay>()

  constructor(name: string, specialtyName: string, year: number) {
    this.name = name
    this.specialtyName = specialtyName
    this.year = year
  }

  setSchedule(data: ScheduleDaysJson) {
    // console.log("[Schedule Model] processing raw schedule data ", data)

    console.log(`[Schedule Model] setting schedule from the object:`)
    console.log(data)

    this.dayNames.forEach((day) => {
      if (this.weekendDays.includes(day)) return

      const dayClasses: IScheduleClass[] = data[day].classes
      const scheduleDay = new ScheduleDay(day, dayClasses)
      this.scheduleDays.push(scheduleDay)
    })

    console.log("[Schedule Model] loaded schedule from imported object")
  }

  loadScheduleFromJSONFile() {}
  loadScheduleFromImportedObject(objectName: string) {
    throw new Error("Method not supported.")
  }

  async getScheduleFromScheduleLoader(scheduleFileName: string) {
    const scheduleLoader = await ScheduleLoaderService.GetInstance()
    const scheduleFile = scheduleLoader.scheduleFiles.find((file) => file.filename.startsWith(scheduleFileName))

    if (!scheduleFile) {
      console.log(`[Schedule Model] schedule file ${scheduleFileName} not found`)
      // TODO: move out of the model and to UI
      // ToastAndroid.show("Не вдалось завантажити розклад", ToastAndroid.SHORT)

      return
    }

    this.name = ensureNoExtension(scheduleFile.filename, ".json")

    console.log(`[Schedule Model] loading schedule from Schedule Loader: ${this.name}`)

    // @ts-expect-error
    const data: ScheduleDaysJson = scheduleFile.json_parsed

    this.setSchedule(data)
  }

  async getScheduleFromEditedSchedulesStorage(scheduleFileName: string) {
    const editedScheduleService = await EditedSchedulesStorageService.GetInstance()
    const schedule = await editedScheduleService.loadEditedSchedule(scheduleFileName)

    if (!schedule) {
      console.log(`[Schedule Model] schedule file ${scheduleFileName} not found`)
      return
    }

    this.name = ensureNoExtension(schedule.metadata.filename, ".json")
    this.setSchedule(schedule.scheduleDays)
  }

  getCurrentClass(): ScheduleClass | null {
    const dayIndex = new Date().getDay()
    const isWeekEnd = dayIndex == 0 || dayIndex == 6

    if (isWeekEnd) return null

    const todayClasses = this.scheduleDays[dayIndex - 1].classes
    if (todayClasses.length == 0) return null

    let currentClass = null

    todayClasses.forEach((class_) => {
      if (class_.isCurrent()) {
        currentClass = class_
      }
    })

    return currentClass
  }
}
