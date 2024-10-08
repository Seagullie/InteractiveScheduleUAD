import ScheduleModel from "../models/ScheduleModel/ScheduleModel"
import LocalNotificationsService from "./LocalNotificationsService/LocalNotificationsService"
import SettingsService from "./SettingsService/SettingsService"
import ClassNotificationBuilder from "./ClassNotificationBuilder"
import { isRunningInBrowser } from "../utilities/utilities"

// TODO: Read about override keyword in TypeScript

//
/**
 * Singleton service. Main function is constructing and registering notifications for entire schedule.
 */
export default class ScheduleNotificationsService extends LocalNotificationsService {
  onConfigureNotificationsForScheduleStart: null | (() => void) = null
  onConfigureNotificationsForScheduleEnd: null | (() => void) = null

  protected static instance: ScheduleNotificationsService

  static async GetInstance(): Promise<ScheduleNotificationsService> {
    if (!this.instance) {
      this.instance = new ScheduleNotificationsService()
      await this.instance.init()
      console.log(`[${this.name}] service instance constructed successfully`)
    }

    return this.instance
  }

  // TODO split the function
  // eslint-disable-next-line max-lines-per-function
  async configureNotificationsForSchedule(schedule: ScheduleModel) {
    console.log(`[configure notifications] configuring notifications for schedule ${schedule.name}`)
    this.onConfigureNotificationsForScheduleStart?.call(this)

    // get notifications service and settings service
    const notificationsService = await LocalNotificationsService.GetInstance()
    const settingsService = await SettingsService.GetInstance()

    // check whether notifications are enabled
    if (!isRunningInBrowser() && settingsService.notifyBeforeClass) {
      // if notifications are enabled, then schedule notifications for each class
      // make sure to not register duplicate notifications by either checking for duplicates or deleting all notifications before setting any
      await notificationsService.cancelAllScheduledNotificationsAsync()

      const configureDays = schedule.scheduleDays.map(async (day) => {
        const configureDayClasses = day.classes.map(async (class_) => {
          const notifBuilder = new ClassNotificationBuilder(
            schedule,
            class_,
            notificationsService,
            settingsService.notifyBeforeClassOffsetMinutes
          )

          if (class_.isBiweekly) {
            const notifications = notifBuilder.constructBiweeklyNotificationsSequence(day)

            await Promise.all(
              notifications.map((notif) => {
                return notificationsService.scheduleNotification(notif.content, notif.trigger)
              })
            )
          } else {
            const weeklyNotif = notifBuilder.constructWeeklyNotification(day)

            return await notificationsService.scheduleNotification(weeklyNotif.content, weeklyNotif.trigger)
          }
        })

        await Promise.all(configureDayClasses)
      })

      await Promise.all(configureDays)
    }

    this.onConfigureNotificationsForScheduleEnd?.call(this)
  }
}
