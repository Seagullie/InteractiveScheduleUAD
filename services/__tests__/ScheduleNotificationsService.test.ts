import * as Notifications from "expo-notifications"

import ScheduleModel from "../../models/ScheduleModel/ScheduleModel"
import ScheduleLoaderService from "../ScheduleLoaderService/ScheduleLoaderService"
import ScheduleNotificationsService from "../ScheduleNotificationsService"
import { SEMESTER_MONTHS } from "../../constants/Constants"

describe("ScheduleNotificationsService", () => {
  beforeEach(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync()
  })

  it("configures notifications for schedule", async () => {
    // -- arrange --

    const scheduleLoader = await ScheduleLoaderService.GetInstance()
    const scheduleNotificationsService = await ScheduleNotificationsService.GetInstance()

    const schedule = new ScheduleModel("test schedule", "test schedule description", 5)
    await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

    scheduleNotificationsService.onConfigureNotificationsForScheduleEnd = jest.fn()
    scheduleNotificationsService.onConfigureNotificationsForScheduleStart = jest.fn()

    // -- act --

    await scheduleNotificationsService.configureNotificationsForSchedule(schedule)

    // -- assert --

    expect(scheduleNotificationsService.onConfigureNotificationsForScheduleStart).toHaveBeenCalled()
    expect(scheduleNotificationsService.onConfigureNotificationsForScheduleEnd).toHaveBeenCalled()
  })

  // main test:
  // inputs: schedule
  // outputs: lots of new scheduled notifications
  it("creates the right number of notifications", async () => {
    // -- arrange --

    const scheduleLoader = await ScheduleLoaderService.GetInstance()
    const scheduleNotificationsService = await ScheduleNotificationsService.GetInstance()

    const schedule = new ScheduleModel("test schedule", "test schedule description", 5)
    await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

    // -- act --

    await scheduleNotificationsService.configureNotificationsForSchedule(schedule)

    const notifications = await Notifications.getAllScheduledNotificationsAsync()

    // -- assert --

    // calculate how many weekly notifications should be scheduled
    const numWeeklyNotifications = schedule.scheduleDays.reduce((acc, day) => {
      const weeklyClasses = day.classes.filter((class_) => {
        return !class_.isBiweekly
      })

      return acc + weeklyClasses.length
    }, 0)

    // calculate how many biweekly notifications should be scheduled
    const numBiweeklyNotifications = schedule.scheduleDays.reduce((acc, day) => {
      const biweeklyClasses = day.classes.filter((class_) => {
        return class_.isBiweekly
      })

      return acc + biweeklyClasses.length
    }, 0)

    expect(notifications.length).toBe(numWeeklyNotifications + numBiweeklyNotifications * 2 * SEMESTER_MONTHS)
  })
})
