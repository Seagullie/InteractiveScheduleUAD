// TODO: mock notification creation functions so that they populate internal storage. Make notification getters use the internal storage

import { v4 as uuidv4 } from "uuid"

import { NotificationPermissionsStatus, NotificationRequest, NotificationRequestInput } from "expo-notifications"
import { parseTrigger } from "expo-notifications/build/scheduleNotificationAsync"

const autoMock: typeof import("expo-notifications") = jest.createMockFromModule("expo-notifications")

const notificationStorage: Record<string, NotificationRequest> = {}

autoMock.cancelAllScheduledNotificationsAsync = async () => {
  Object.keys(notificationStorage).forEach((key) => {
    delete notificationStorage[key]
  })
}

autoMock.cancelScheduledNotificationAsync = async (identifier: string) => {
  delete notificationStorage[identifier]
}

autoMock.getAllScheduledNotificationsAsync = async () => {
  return Object.values(notificationStorage)
}

autoMock.scheduleNotificationAsync = async (notification: NotificationRequestInput) => {
  const uuid = uuidv4()
  notification.identifier = notification.identifier ?? uuid

  // construct notification request from notification request input
  const notificationRequest: NotificationRequest = {
    identifier: notification.identifier,
    content: notification.content,
    trigger: parseTrigger(notification.trigger),
  }

  notificationStorage[uuid] = notificationRequest
  return notification.identifier
}

autoMock.getPermissionsAsync

autoMock.getPermissionsAsync = async () => {
  const notificationPermissionStatus: Pick<NotificationPermissionsStatus, "granted"> = {
    granted: true,
  }

  return notificationPermissionStatus
}

// difficult to reimplement
// TODO: mock the real implementation
autoMock.getNextTriggerDateAsync = async () => {
  // return date but as number
  return Date.now()
}

module.exports = autoMock
