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

export type ScheduleClassFields = {
  index: number
  isBiweekly: boolean
  week: 1 | 2
  name: string
  teacher: string | string[]
  room: string | string[]
  isSharedClass: boolean

  classType?: CLASS_TYPE
}
export interface IScheduleClass extends ScheduleClassFields {
  getUniqueStringSignature(): string
}
