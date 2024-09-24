import { DateTriggerInput, NotificationContentInput, WeeklyTriggerInput } from "expo-notifications"
import ScheduleModel from "../models/ScheduleModel/ScheduleModel"
import { ScheduleDay } from "../models/ScheduleDay/ScheduleDay"
import { ScheduleClass } from "../models/ScheduleClass/ScheduleClass"
import GetWeekType from "../utilities/getWeekType"
import { createEvenlySpacedTimeSequence, setDayOnDate } from "../utilities/utilities"
import LocalNotificationsService from "./LocalNotificationsService/LocalNotificationsService"
import { REGLAMENT_DATA, SEMESTER_MONTHS } from "../constants/Constants"
import TeacherModel from "../models/TeacherModel/TeacherModel"

export default class ClassNotificationBuilder {
  signature: string

  hour: number
  minute: number

  notificationsService: LocalNotificationsService
  schedule: ScheduleModel
  class_: ScheduleClass

  teachersTable = TeacherModel.GetInstance()

  constructor(
    schedule: ScheduleModel,
    class_: ScheduleClass,
    notificationsService: LocalNotificationsService,
    negativeOffsetInMins: number
  ) {
    this.notificationsService = notificationsService

    this.schedule = schedule
    this.class_ = class_

    this.signature = class_.getUniqueStringSignature()

    // use reglament to determine hour and minute
    const hourAndMinute = REGLAMENT_DATA[class_.index - 1][1]

    this.hour = parseInt(hourAndMinute.split(":")[0])
    this.minute = parseInt(hourAndMinute.split(":")[1])

    this.minute -= negativeOffsetInMins
    if (this.minute < 0) {
      this.minute += 60
      this.hour -= 1
    }
  }

  // TODO: split this method into two separate methods
  // eslint-disable-next-line max-lines-per-function
  constructBiweeklyNotificationsSequence(scheduleDay: ScheduleDay) {
    // we need to generate lots of periodic biweekly notifications. Here a period is two weeks
    // we need approx this number of notifications: n of months in semester * 2. n of months in semester = ~6

    // construct notification date
    const now = new Date()

    const monthDay = now.getDate()
    let notificationDate = new Date(now.getFullYear(), now.getMonth(), monthDay, this.hour, this.minute)
    notificationDate = setDayOnDate(notificationDate, this.schedule.dayNames.indexOf(scheduleDay.name))

    // construct future notification dates
    const twoWeeksInSeconds = 60 * 60 * 24 * 7 * 2
    // add additional week of offset if week types don't match. It's important to add 1 to week type enum returned by GetWeekType() because it's 0-indexed
    const offset = GetWeekType() + 1 == this.class_.week ? 0 : twoWeeksInSeconds / 2
    const offsetInMillis = offset * 1000
    notificationDate = new Date(offsetInMillis + notificationDate.getTime())

    const notificationDates = createEvenlySpacedTimeSequence(SEMESTER_MONTHS * 2, twoWeeksInSeconds, notificationDate)

    // construct future notification objects for expo-notifications
    const notificationObjects = notificationDates.map((notifDate) => {
      const trigger: DateTriggerInput = {
        date: notifDate,
        channelId: this.notificationsService.notificationChannelId,
      }

      // format teacher name
      let teacherName = this.class_.teacher
      if (teacherName) {
        teacherName =
          typeof teacherName == "string" ? this.teachersTable.getFullNameBySurname(teacherName) : teacherName.join(", ")
      } else {
        teacherName = ""
      }

      // pad hour and minute with 0 if they consist of only one digit
      const hourPadded = this.hour < 10 ? "0" + this.hour : this.hour
      const minutePadded = this.minute < 10 ? "0" + this.minute : this.minute

      // construct notification object that will be passed to expo-notifications
      const content: NotificationContentInput = {
        title: this.class_.name,
        body: teacherName,
        subtitle: `[${hourPadded}:${minutePadded}] Пара починається`,
      }

      return { content: content, trigger: trigger }
    })

    return notificationObjects
  }

  constructWeeklyNotification(scheduleDay: ScheduleDay) {
    // construct trigger object that will be passed to expo-notifications
    const trigger: WeeklyTriggerInput = {
      weekday: this.schedule.dayNames.indexOf(scheduleDay.name) + 1, // why do we add + 1 here? because weekday is 1-indexed, but dayNames is 0-indexed
      hour: this.hour,
      minute: this.minute,

      repeats: true,
      channelId: this.notificationsService.notificationChannelId,
    }

    // format teacher name
    let teacherName = this.class_.teacher
    if (teacherName) {
      teacherName =
        typeof teacherName == "string" ? this.teachersTable.getFullNameBySurname(teacherName) : teacherName.join(", ")
    } else {
      teacherName = ""
    }

    // pad hour and minute with 0 if they consist of only one digit
    const hourPadded = this.hour < 10 ? "0" + this.hour : this.hour
    const minutePadded = this.minute < 10 ? "0" + this.minute : this.minute

    // construct notification object that will be passed to expo-notifications
    const weeklyNotif = {
      content: {
        title: this.class_.name,
        body: teacherName,
        subtitle: `[${hourPadded}:${minutePadded}] Пара починається`,
      },
      trigger: trigger,
    }

    return weeklyNotif
  }
}
