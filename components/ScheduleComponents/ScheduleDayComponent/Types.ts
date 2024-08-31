import { ScheduleClass } from "../../../models/ScheduleClass/ScheduleClass"
import { ScheduleDay } from "../../../models/ScheduleDay/ScheduleDay"
import ScheduleModel from "../../../models/ScheduleModel/ScheduleModel"

export type ScheduleDayComponentProps = {
  /**
   * Collection of classes for this day
   */
  classesCollection: ScheduleClass[]
  /**
   * Schedule object
   */
  scheduleObject: ScheduleModel
  /**
   * Name of the day
   */
  dayName: string
  /**
   * Schedule day object
   */
  scheduleDay: ScheduleDay
  /**
   * Whether to display room number
   */
  displayRoomNumber: boolean
  /**
   * Week type (Чис or Знам)
   */
  weekType?: number
  fade: boolean
  /**
   * Whether the component is editable
   */
  isEditable?: boolean
}
