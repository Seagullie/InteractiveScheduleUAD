import { useState, useEffect, useRef } from "react"
import { Text, View, Button } from "react-native"
import * as Notifications from "expo-notifications"
import React from "react"
import LocalNotificationsService from "../../services/LocalNotificationsService/LocalNotificationsService"
import { ScrollView } from "react-native-gesture-handler"
import Card from "../../components/shared/card"
import { Input } from "react-native-elements"
import Constants from "expo-constants"
import * as IntentLauncher from "expo-intent-launcher"

// TODO: handle daylight savings. Perhaps ask user to reload notifications, that could be easier
// this makes sense: if the user is interested in the app, they will cooperate

// TODO: Test biweekly notifications

// TODO: Fix package name not being resolved correctly first time the app is launched
// a temp fix would be to always open notification channel settings for actual app

// TODO: Configure notificatitions to appear on the lock screen

export default function NotificationTestsScreen() {
  const [ready, setReady] = useState(false)

  const [permission, setPermission] = useState<Notifications.PermissionStatus | null>(null)
  const [scheduledNotifications, setScheduledNotifications] = useState<Notifications.NotificationRequest[]>([])
  const [delayForExampleNotificationViaDate, setDelayForExampleNotificationViaDate] = useState("5")

  const [notification, setNotification] = useState<Notifications.Notification | null>(null)

  const localNotificationsServiceRef = useRef<LocalNotificationsService | null>(null)

  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  // data: "package:" + pkg,
  // "interactive-schedule-notifications"

  // note: avoid using Constants[.manifest]

  const requestConfigurePermissions = async () => {
    // navigate to notification channel settings
    // const pkg = Constants.manifest.releaseChannel ? Constants.manifest.android.package : "host.exp.exponent"

    // IntentLauncher.startActivityAsync("android.settings.APP_NOTIFICATION_SETTINGS", {
    //   // data: "package:" + pkg,
    //   extra: {
    //     // "android.provider.extra.CHANNEL_ID": "Default",
    //     "android.provider.extra.APP_PACKAGE": pkg,
    //   },
    // })

    // const pkg = Constants.manifest.releaseChannel ? Constants.manifest.android.package : "host.exp.exponent"
    const pkg = Constants.expoConfig.android.package
    const allChannels = await Notifications.getNotificationChannelsAsync()
    const channel = await Notifications.getNotificationChannelAsync("interactive-schedule-notifications")
    console.log("[Notification Tests] All channels of this app: ")
    console.log(allChannels)
    console.log("[Notification Tests] Channel id for main channel: " + channel?.id)

    IntentLauncher.startActivityAsync("android.settings.CHANNEL_NOTIFICATION_SETTINGS", {
      // data: "package:" + pkg,
      extra: {
        "android.provider.extra.CHANNEL_ID":
          pkg == "host.exp.exponent" ? "expo-experience" : "interactive-schedule-notifications",
        "android.provider.extra.APP_PACKAGE": pkg,
      },
    })
  }

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
      console.log("notification has beed shown")
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("user responded to notification:" + JSON.stringify(response))
    })

    const init = async () => {
      let notifications = await LocalNotificationsService.GetInstance()
      localNotificationsServiceRef.current = notifications

      let registeredNotifications = await notifications.getAllScheduledNotificationsAsync()
      let permissions = await notifications.checkPermissionsAsync()

      setScheduledNotifications(registeredNotifications)
      setPermission(permissions.status)

      setReady(true)
    }

    init()

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!)
      Notifications.removeNotificationSubscription(responseListener.current!)
    }
  }, [])

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Завантаження...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <Card style={{ backgroundColor: "magenta" }}>
        <Text>Сповіщення дозволені: {permission}</Text>
      </Card>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>

      <View>
        <Text
          style={{
            alignSelf: "center",
            marginBottom: 10,
          }}
        >
          Сповіщення:
        </Text>

        <Button
          title="Надіслати локальне сповіщення (приходить зі затримкою в ~3-5 секунд)"
          onPress={async () => {
            localNotificationsServiceRef.current!.sendExampleNotification()
          }}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <View style={{ flexDirection: "row", width: "50%", alignItems: "center" }}>
          <Text>Через секунд:</Text>
          <Input
            keyboardType="number-pad"
            defaultValue={delayForExampleNotificationViaDate}
            onChangeText={(newValue) => setDelayForExampleNotificationViaDate(newValue)}
          />
        </View>

        <Button
          title={`Прислати сповіщення через ${delayForExampleNotificationViaDate} секунд`}
          color={"green"}
          onPress={async () => {
            localNotificationsServiceRef.current!.scheduleExampleNotificationViaDate(
              parseInt(delayForExampleNotificationViaDate)
            )
          }}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text>Має показувати сповіщення кожні 5 секунд, навіть якщо додаток повністю закритий</Text>
        <View style={{ marginVertical: 10 }}>
          <Button
            title="Присилати сповіщення кожнi 5 секунд"
            color={"green"}
            onPress={async () => {
              localNotificationsServiceRef.current!.scheduleRepeatableExampleNotification()
            }}
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Button
            title="Присилати сповіщення кожного дня о 12:00"
            color={"green"}
            onPress={async () => {
              localNotificationsServiceRef.current!.scheduleRepeatableDailyExampleNotification()
            }}
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Button
            title="Попросити дозволу на сповіщення"
            color={"green"}
            onPress={async () => {
              localNotificationsServiceRef.current!.checkPermissionsAsync
            }}
          />
        </View>

        <Button
          title="Зупинити періодичні сповіщення"
          color={"red"}
          onPress={async () => {
            localNotificationsServiceRef.current!.cancelAllScheduledNotificationsAsync()
          }}
        />

        <View>
          <Text>Наступне Сповіщення</Text>
          <Button
            title="Попросити налаштувати сповіщення"
            onPress={() => {
              requestConfigurePermissions()
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}
