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
    const currentWeekType = GetWeekType() + 1
    const currentWeekClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == currentWeekType)
    return currentWeekClasses
  }

  // пари по чисельнику
  getNominatorClasses(): ScheduleClass[] {
    const nominatorClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == 1)
    return nominatorClasses
  }

  // пари по знаменнику
  getDenominatorClasses(): ScheduleClass[] {
    const denominatorClasses = this.classes.filter((class_) => !class_.isBiweekly || class_.week == 2)
    return denominatorClasses
  }

  /**
   * Returns the class of the other week that matches index of given class
   */
  getMatchingClassOfOtherWeek(class_: ScheduleClass): ScheduleClass | null {
    if (!class_.isBiweekly) return null

    const otherWeek = class_.week == 1 ? 2 : 1
    const index = class_.index

    const matchingClass = this.classes.find((class_) => class_.index == index && class_.week == otherWeek) ?? null

    return matchingClass
  }
}
