import ScheduleModel, { ScheduleDaysJson } from "../../models/ScheduleModel"
import { ScheduleFileMetadata } from "../ScheduleLoaderService/Types"

export type ScheduleWithMetadata = {
  scheduleDays: ScheduleDaysJson
  metadata: ScheduleFileMetadata
}
export interface IEditedScheduleStorageService {
  createVersionForEdits: (schedule: ScheduleModel) => Promise<ScheduleModel>
  saveEditedSchedule: (schedule: ScheduleModel) => Promise<void>
  loadEditedSchedule: (scheduleFileName: string) => Promise<ScheduleWithMetadata | null>

  isOutdated: (scheduleFileName: string) => Promise<boolean>
  removeEditedSchedule: (scheduleName: string) => Promise<void>
}
