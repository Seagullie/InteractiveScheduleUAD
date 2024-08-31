import GetWeekType from "../../utilities/getWeekType"
import { ScheduleClass } from "../ScheduleClass/ScheduleClass"
import { IScheduleClass } from "../ScheduleClass/Types"
import { IScheduleDay } from "./Types"

export class ScheduleDay implements IScheduleDay {
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
