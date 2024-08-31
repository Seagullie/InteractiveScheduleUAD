import { ScheduleClass } from "../../../models/ScheduleClass/ScheduleClass"

export type ScheduleClassComponentProps = {
  scheduleClassInstance: ScheduleClass
  idx: number
  displayRoomNumber: boolean
  isEditable?: boolean
  highlightAsOngoing?: boolean
}
