import { IScheduleClass } from "../ScheduleClass/Types"

interface IScheduleDayFields {
  classes: IScheduleClass[]
  name: string
}

export interface IScheduleDay extends IScheduleDayFields {
  getCurrentWeekClasses(): IScheduleClass[]
  getNominatorClasses(): IScheduleClass[]
  getDenominatorClasses(): IScheduleClass[]
  getMatchingClassOfOtherWeek(class_: IScheduleClass): IScheduleClass | null
}
