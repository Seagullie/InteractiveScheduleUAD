import { ScheduleClass } from "../ScheduleClass/ScheduleClass"
import { ScheduleDay } from "../ScheduleDay/ScheduleDay"

export type ScheduleDaysJson = { [key: string]: ScheduleDay }
interface IScheduleModelFields {
  name: string
  specialtyName: string
  year: number
  dayNames: string[]
  weekendDays: string[]
  scheduleDays: ScheduleDay[]
}
export interface IScheduleModel extends IScheduleModelFields {
  setSchedule(data: ScheduleDaysJson): void
  loadScheduleFromJSONFile(): void
  loadScheduleFromImportedObject(objectName: string): void
  getScheduleFromScheduleLoader(scheduleFileName: string): void
  getScheduleFromEditedSchedulesStorage(scheduleFileName: string): void
  getCurrentClass(): ScheduleClass | null
}
