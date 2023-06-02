import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import ScheduleModel from "../models/ScheduleModel"

// expo notifications docs: https://docs.expo.dev/versions/latest/sdk/notifications/
// Expo's Push Notification Tool: https://expo.dev/notifications

interface ILocalNotificationsService {
  sendNotification(content: Notifications.NotificationContentInput): Promise<void>
  scheduleNotification(
    content: Notifications.NotificationContentInput,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<void>
  cancelAllScheduledNotificationsAsync(): Promise<void>
  cancelScheduledNotificationAsync(identifier: string): Promise<void>
  getAllScheduledNotificationsAsync(): Promise<Notifications.NotificationRequest[]>
  checkPermissionsAsync(): Promise<Notifications.NotificationPermissionsStatus>
}

// singleton
export default class LocalNotificationsService implements ILocalNotificationsService {
  protected static instance: LocalNotificationsService
  exampleNotificationContent: Notifications.NotificationContentInput = {
    title: "Мультимедійне видавництво",
    body: "Миклушка І. З.",
    subtitle: "[10:15] Пара починається",
    data: { someData: "додаткова інформація тут" },
  }
  notificationChannelId = "interactive-schedule-notifications"

  static async GetInstance(): Promise<LocalNotificationsService> {
    if (!this.instance) {
      this.instance = new this()
      await this.instance.init()
      console.log(`[${this.name}] local notifications service instance constructed successfully`)
    }

    return this.instance
  }

  protected constructor() {}
  cancelScheduledNotificationAsync(identifier: string): Promise<void> {
    return Notifications.cancelScheduledNotificationAsync(identifier)
  }

  cancelAllScheduledNotificationsAsync(): Promise<void> {
    return Notifications.cancelAllScheduledNotificationsAsync()
  }
  getAllScheduledNotificationsAsync(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync()
  }
  checkPermissionsAsync(): Promise<Notifications.NotificationPermissionsStatus> {
    return Notifications.getPermissionsAsync()
  }

  protected async init() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    })
    await this.registerNotificationsChannel()

    let permissionsGranted = (await this.checkPermissionsAsync()).granted
    if (!permissionsGranted) await Notifications.requestPermissionsAsync()

    console.log(`[Local Notifications] permissions granted: ${permissionsGranted}`)

    console.log("local notifications service initialized")
  }

  async registerNotificationsChannel() {
    if (Platform.OS === "android") {
      // delete default notification channel that expo creates for you
      await Notifications.deleteNotificationChannelAsync("default")

      Notifications.setNotificationChannelAsync(this.notificationChannelId, {
        name: "Сповіщення про початок пари",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      })
    }
  }

  async sendNotification(content: Notifications.NotificationContentInput) {
    let expoPushToken = undefined

    const message: Notifications.NotificationRequestInput = {
      identifier: this.notificationChannelId,
      content: {
        ...content,
        priority: "high",
      },
      // I have to set seconds to 1, otherwise the notification is not shown.
      // I don't know whether it's a bug or something else
      trigger: {
        seconds: 1,
        channelId: this.notificationChannelId,
      },
    }

    Notifications.scheduleNotificationAsync(message).catch((e) => {
      console.error("error while sending notification")
      console.log("...this is the notification that was supposed to be sent:")
      console.log(message)
    })
  }

  async scheduleNotification(
    content: Notifications.NotificationContentInput,
    trigger: Notifications.NotificationTriggerInput
  ) {
    // TODO: narrow down types
    if (trigger == null || typeof trigger != "object") {
      throw new Error("trigger is not an object")
    }

    // TODO: pass channel id to trigger

    // random unique identifier will be generated if not specified
    let notificationId = undefined

    const message: Notifications.NotificationRequestInput = {
      identifier: notificationId,
      content: {
        ...content,
        priority: "high",
      },
      trigger: trigger,
    }

    let nextTriggerDate = await Notifications.getNextTriggerDateAsync(trigger)
    let now = new Date()

    if (nextTriggerDate == null && trigger.date >= now) {
      throw new Error("nextTriggerDate is null for this notification: " + trigger.date)
    }

    Notifications.scheduleNotificationAsync(message)
  }

  // - - - methods for testing - - -

  async sendExampleNotification() {
    this.sendNotification(this.exampleNotificationContent)
  }

  async scheduleExampleNotificationViaDate(secondsFromNow = 5) {
    let trigger: Notifications.NotificationTriggerInput = {
      date: new Date(Date.now() + secondsFromNow * 1000),
      channelId: this.notificationChannelId,
    }

    this.scheduleNotification(this.exampleNotificationContent, trigger)
  }

  async scheduleRepeatableExampleNotification() {
    let trigger: Notifications.NotificationTriggerInput = {
      seconds: 5,
      repeats: true,
      channelId: this.notificationChannelId,
    }

    this.scheduleNotification(this.exampleNotificationContent, trigger)
  }

  async scheduleRepeatableDailyExampleNotification() {
    let trigger: Notifications.DailyTriggerInput = {
      hour: 14,
      minute: 41,
      repeats: true,
      channelId: this.notificationChannelId,
    }

    this.scheduleNotification(this.exampleNotificationContent, trigger)
  }
}
