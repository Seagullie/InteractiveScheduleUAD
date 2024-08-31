import { IScheduleModel, ScheduleDaysJson } from "../../models/ScheduleModel/Types"
import { ScheduleFileMetadata } from "../ScheduleLoaderService/Types"

export type ScheduleWithMetadata = {
  scheduleDays: ScheduleDaysJson
  metadata: ScheduleFileMetadata
}
export interface IEditedScheduleStorageService {
  createVersionForEdits: (schedule: IScheduleModel) => Promise<IScheduleModel>
  saveEditedSchedule: (schedule: IScheduleModel) => Promise<void>
  loadEditedSchedule: (scheduleFileName: string) => Promise<ScheduleWithMetadata | null>

  isOutdated: (scheduleFileName: string) => Promise<boolean>
  removeEditedSchedule: (scheduleName: string) => Promise<void>
}
