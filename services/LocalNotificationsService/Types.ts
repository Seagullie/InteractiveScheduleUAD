import * as Notifications from "expo-notifications"

export interface ILocalNotificationsService {
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
