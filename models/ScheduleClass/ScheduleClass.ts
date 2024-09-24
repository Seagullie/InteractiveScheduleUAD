import GetWeekType from "../../utilities/getWeekType"
import { determineInterval } from "../../utilities/utilities"
import getStrict from "../../utilities/getStrict"
import { workDaysEnLower } from "../../constants/Days"
import { REGLAMENT_DATA } from "../../constants/Constants"
import { IScheduleClass, CLASS_TYPE, ScheduleClassFields } from "./Types"

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

  constructor(data: ScheduleClassFields, day: string) {
    this.index = data.index
    this.isBiweekly = data.isBiweekly ?? false
    this.name = data.name

    // here you make assumptions as you parse the data (that separator character is pipe).
    // Perhaps that's not the right place for such things
    const teacherSeparator = "|"
    if (typeof data.teacher == "string" && data.teacher.includes(teacherSeparator)) {
      this.teacher = data.teacher.split(teacherSeparator)
    } else {
      this.teacher = data.teacher
    }

    const roomSeparator = "|"
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

  /**
   * Returns a placeholder class. Relies on sample data, defined in the class
   */
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

  /**
   * Replaces the class with a placeholder class
   */
  static ReplaceWithPlaceholder(class_: ScheduleClass): ScheduleClass {
    return this.GetPlaceholder(class_.day, class_.index, class_.week)
  }

  setWeek(week: 1 | 2) {
    this.week = week
    this.weekName = this.isBiweekly ? (this.week === 1 ? "Чисельник" : "Знаменник") : ""
  }

  // TODO: extend the doc
  /**
   * Returns a unique string identifier for the class.
   */
  getUniqueStringSignature(): string {
    return `[${this.day} * ${this.index}] ${this.name} * ${this.teacher} * ${this.room} <${this.weekName}>})`
  }

  isCurrent() {
    // debugger
    // return this.index == 3
    const isInCurrentDay = this.day == workDaysEnLower[new Date().getDay() - 1]

    if (!isInCurrentDay) return false

    const isInCurrentTimeSlot = determineInterval() == getStrict(REGLAMENT_DATA, this.index - 1)
    const isMatchingWeekType = GetWeekType() + 1 == this.week
    const isOngoingClass = isInCurrentTimeSlot && (!this.isBiweekly || isMatchingWeekType)

    return isOngoingClass
  }

  isSampleClass() {
    // TODO: find better way to compare lists
    const isSample =
      this.name == ScheduleClass.sampleName &&
      this.room == ScheduleClass.sampleRoom &&
      this.teacher.toString() == [ScheduleClass.sampleTeacher].toString()

    return isSample
  }
}
