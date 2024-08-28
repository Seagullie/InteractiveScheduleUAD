export enum DisplayEmptyDaysMode {
  Display = "Відображати",
  Darken = "Затемняти",
  Hide = "Приховати",
}

export enum DisplayTeacherMode {
  Full = "ПІБ",
  SurnameAndInitials = "Прізвище та ініціали",
  Hide = "Приховати",
}
// update place 1 for new setting

export type ScheduleAppSettings = {
  currentScheduleName: string
  notifyBeforeClass: boolean
  notifyBeforeClassOffsetMinutes: number
  displayRoomNumber: boolean
  displayTeacherName: DisplayTeacherMode

  displayEmptyRows: boolean // TODO: use enum here
  displayEmptyDays: DisplayEmptyDaysMode
}
export interface ISettingsService extends ScheduleAppSettings {
  saveToStorage: () => Promise<void>
  readFromStorage: () => Promise<ScheduleAppSettings | null>
}
