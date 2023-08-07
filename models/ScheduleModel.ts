import GetWeekType from "../utilities/getWeekType"
import { determineInterval, ensureNoExtension } from "../utilities/utilities"
import getStrict from "../utilities/getStrict"
import { workDaysEnLower } from "../constants/Days"
import { REGLAMENT_DATA } from "../constants/Constants"
import ScheduleLoaderService from "../services/ScheduleLoaderService"
import EditedSchedulesStorageService from "../services/EditedScheduleStorageService"

// TODO: separate other models into own files

export type ScheduleDaysJson = { [key: string]: ScheduleDay }

export default class ScheduleModel {
  name: string
  specialtyName: string
  year: number

  // TODO: move to constants
  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) =>
    day.toLowerCase()
  )
  weekendDays = ["saturday", "sunday"]
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

      let dayClasses: IScheduleClass[] = data[day].classes
      let scheduleDay = new ScheduleDay(day, dayClasses)
      this.scheduleDays.push(scheduleDay)
    })

    console.log("[Schedule Model] loaded schedule from imported object")
  }

  loadScheduleFromJSONFile() {}
  loadScheduleFromImportedObject(objectName: string) {
    throw new Error("Method not supported.")
  }

  async getScheduleFromScheduleLoader(scheduleFileName: string) {
    let scheduleLoader = await ScheduleLoaderService.GetInstance()
    let scheduleFile = scheduleLoader.scheduleFiles.find((file) => file.filename.startsWith(scheduleFileName))

    if (!scheduleFile) {
      console.log(`[Schedule Model] schedule file ${scheduleFileName} not found`)
      // TODO: move out of the model and to UI
      // ToastAndroid.show("Не вдалось завантажити розклад", ToastAndroid.SHORT)

      return
    }

    this.name = ensureNoExtension(scheduleFile.filename, ".json")

    console.log(`[Schedule Model] loading schedule from Schedule Loader: ${this.name}`)

    let data: ScheduleDaysJson = scheduleFile.json_parsed

    this.setSchedule(data)
  }

  async getScheduleFromEditedSchedulesStorage(scheduleFileName: string) {
    let editedScheduleService = await EditedSchedulesStorageService.GetInstance()
    let schedule = await editedScheduleService.loadEditedSchedule(scheduleFileName)

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

export class ScheduleDay {
  classes: ScheduleClass[]
  name: string

  constructor(name: string, classes: IScheduleClass[]) {
    this.classes = classes.map((class_) => new ScheduleClass(class_, name))
    this.name = name
  }

  getCurrentWeekClasses(): ScheduleClass[] {
    let currentWeekType = GetWeekType() + 1
    let currentWeekClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == currentWeekType)
    return currentWeekClasses
  }

  // пари по чисельнику
  getNominatorClasses(): ScheduleClass[] {
    let nominatorClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == 1)
    return nominatorClasses
  }

  // пари по знаменнику
  getDenominatorClasses(): ScheduleClass[] {
    let denominatorClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == 2)
    return denominatorClasses
  }

  getMatchingClassOfOtherWeek(class_: ScheduleClass) {
    if (!class_.isBiweekly) return null

    let otherWeek = class_.week == 1 ? 2 : 1
    let index = class_.index

    let matchingClass = this.classes.find((class_) => class_.index == index && class_.week == otherWeek)

    return matchingClass
  }
}

export enum CLASS_TYPE {
  LECTURE = "Лекція",
  PRACTICE = "Практична",
  LAB = "Лабораторна",
}

export const CLASS_TYPE_SHORT = {
  [CLASS_TYPE.LECTURE]: "Лек",
  [CLASS_TYPE.PRACTICE]: "Прак",
  [CLASS_TYPE.LAB]: "Лаб",
}

export type ScheduleClassProps = {
  index: number
  isBiweekly: boolean
  week: 1 | 2
  name: string
  teacher: string | string[]
  room: string | string[]
  isSharedClass: boolean

  classType: CLASS_TYPE
}

export interface IScheduleClass extends ScheduleClassProps {
  getUniqueStringSignature(): string
}

export class ScheduleClass implements IScheduleClass {
  index: number
  isBiweekly: boolean
  week: 1 | 2 // 1 or 2, 1 - чисельник, 2 - знаменник
  name: string
  teacher: string | string[]
  room: string | string[]
  isSharedClass: boolean

  day: string
  weekName: string = ""

  classType: CLASS_TYPE

  constructor(data: ScheduleClassProps, day: string) {
    this.index = data.index
    this.isBiweekly = data.isBiweekly ?? false
    this.name = data.name

    // here you make assumptions as you parse the data (that separator character is pipe).
    // Perhaps that's not the right place for such things
    let teacherSeparator = "|"
    if (typeof data.teacher == "string" && data.teacher.includes(teacherSeparator)) {
      this.teacher = data.teacher.split(teacherSeparator)
    } else {
      this.teacher = data.teacher
    }

    let roomSeparator = "|"
    if (typeof data.room == "string" && data.room.includes(roomSeparator)) {
      this.room = data.room.split(roomSeparator)
    } else {
      this.room = data.room
    }

    this.isSharedClass = data.isSharedClass
    this.day = day

    this.classType = data.classType ?? CLASS_TYPE.LECTURE

    this.setWeek(data.week)
  }

  static sampleName = "Редагувати"
  static sampleTeacher = "Викладач не зазначений"
  static sampleRoom = "..."

  static GetPlaceholder(day: string, index: number, week: 1 | 2) {
    return new ScheduleClass(
      {
        index,
        isBiweekly: true,
        week,
        name: this.sampleName,
        teacher: this.sampleTeacher,
        room: this.sampleRoom,
        isSharedClass: false,
      },
      day
    )
  }

  setWeek(week: 1 | 2) {
    this.week = week
    this.weekName = this.isBiweekly ? (this.week === 1 ? "Чисельник" : "Знаменник") : ""
  }

  getUniqueStringSignature(): string {
    return `[${this.day} * ${this.index}] ${this.name} * ${this.teacher} * ${this.room} <${this.weekName}>})`
  }

  isCurrent() {
    // debugger

    // return this.index == 3

    let isInCurrentDay = this.day == workDaysEnLower[new Date().getDay() - 1]

    if (!isInCurrentDay) return false

    let isInCurrentTimeSlot = determineInterval() == getStrict(REGLAMENT_DATA, this.index - 1)
    let isMatchingWeekType = GetWeekType() + 1 == this.week
    let isOngoingClass = isInCurrentTimeSlot && (!this.isBiweekly || isMatchingWeekType)

    return isOngoingClass
  }

  isSampleClass() {
    // TODO: find better way to compare lists

    let isSample =
      this.name == ScheduleClass.sampleName &&
      this.room == ScheduleClass.sampleRoom &&
      this.teacher.toString() == [ScheduleClass.sampleTeacher].toString()

    return isSample
  }
}
