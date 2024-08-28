

export type ScheduleFileMetadata = {
  filename: string
  revision: number
  createdAt: string
  updatedAt: string
}

export interface ScheduleFile extends ScheduleFileMetadata {
  json_parsed: string
}
