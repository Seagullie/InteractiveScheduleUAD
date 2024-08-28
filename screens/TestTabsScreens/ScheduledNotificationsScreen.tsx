import { useState, useEffect, useRef } from "react"
import { Text, View, Button, ToastAndroid } from "react-native"

import LocalNotificationsService from "../../services/LocalNotificationsService/LocalNotificationsService"
import * as Notifications from "expo-notifications"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import React from "react"
import Card from "../../components/shared/card"
import Expander from "../../components/shared/Expander"
import { CheckBox, Input, SearchBar } from "react-native-elements"
import _ from "lodash"

// TODO: Consider this warning:
// VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices
// like PureComponent, shouldComponentUpdate, etc. {"contentLength": 7060, "dt": 598, "prevDt": 859}

export default function ScheduledNotificationsScreen() {
  const [ready, setReady] = useState(false)

  let [showRegularClasses, setShowRegularClasses] = useState(false)
  let [showBiweeklyClasses, setShowBiweeklyClasses] = useState(true)
  let [filterQuery, setFilterQuery] = useState("")

  // fetch all scheduled nootifications
  const localNotificationsServiceRef = useRef<LocalNotificationsService | null>(null)
  let [scheduledNotifications, setScheduledNotifications] = useState<Notifications.NotificationRequest[]>([])

  const scheduledNotificationsWithParsedTimestamp = _.cloneDeep(scheduledNotifications).map((n) => {
    if (n.trigger.type === "date") {
      n.trigger.value = new Date(n.trigger.value).toUTCString()
      // n.trigger.timeZoneOffset = new Date(n.trigger.value).getTimezoneOffset()
    }

    return n
  })
  const filteredScheduledNotifications = scheduledNotificationsWithParsedTimestamp.filter((n) => {
    if (n.trigger.type === "weekly" && !showRegularClasses) return false
    if (n.trigger.type === "date" && !showBiweeklyClasses) return false

    if (JSON.stringify(n).includes(filterQuery)) {
      return true
    }
    return false
  })

  const sortedScheduledNotifications = _.sortBy(filteredScheduledNotifications, (n) => {
    if (n.trigger.type === "weekly") {
      return n.trigger.weekday * 24 * 60 + n.trigger.hour * 60 + n.trigger.minute
    } else if (n.trigger.type === "date") {
      return new Date(n.trigger.value) - 0
    }
  })

  // display them

  useEffect(() => {
    const init = async () => {
      let notifications = await LocalNotificationsService.GetInstance()
      localNotificationsServiceRef.current = notifications

      let registeredNotifications = await notifications.getAllScheduledNotificationsAsync()

      setScheduledNotifications(registeredNotifications)
      setReady(true)
    }

    init()
  }, [])

  return (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <Text>Всього запланованих сповіщень: {scheduledNotifications.length}</Text>
      <Button
        title="Fetch All Scheduled Notifications"
        onPress={async () => {
          // show toast
          // AndroidToast.show("Fetching all scheduled notifications...", AndroidToast.SHORT)

          ToastAndroid.show("Fetching all scheduled notifications...", ToastAndroid.SHORT)
          let notifications = await localNotificationsServiceRef.current!.getAllScheduledNotificationsAsync()

          setScheduledNotifications(notifications)
          ToastAndroid.show("Fetched and set state...", ToastAndroid.SHORT)
        }}
      />
      <Text>Список запланованих сповіщень: </Text>
      <ScrollView style={{ minHeight: 55 }} horizontal contentContainerStyle={{ flexDirection: "row" }}>
        <CheckBox
          checked={showRegularClasses}
          onPress={() => setShowRegularClasses(!showRegularClasses)}
          title={"Щотижневі пари"}
        />
        <CheckBox
          checked={showBiweeklyClasses}
          onPress={() => setShowBiweeklyClasses(!showBiweeklyClasses)}
          title={"Щодвотижневі пари (Ті, що по чисельнику/знаменнику"}
        />
      </ScrollView>

      <View style={{ width: "70%" }}>
        <Input
          ref={(search) => (this.search = search)}
          onChangeText={(text) => setFilterQuery(text)}
          placeholder="Filter By Text"
          onBlur={() => null}
        />
      </View>

      <FlatList
        data={sortedScheduledNotifications}
        keyExtractor={(item) => item.identifier}
        ListEmptyComponent={() => (
          <View>
            <Text>Сповіщень не знайдено</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const notification = item

          return (
            <Card
              key={index}
              style={{
                backgroundColor: "red",
              }}
            >
              <Text style={{ alignSelf: "center" }}>Notification #{index + 1}</Text>
              <Text>
                Notification title: <Text style={{ fontWeight: "bold" }}>{notification.content.title}</Text>{" "}
              </Text>
              <Text>Notification trigger type: {notification.trigger.type}</Text>
              <Expander header="Notification Details">
                <View>
                  <Text>Details:</Text>
                  <Text>Notification id: {notification.identifier} </Text>

                  <Text> {JSON.stringify(notification.trigger)} </Text>
                </View>
              </Expander>

              <View style={{ marginVertical: 10, alignItems: "flex-end" }}>
                <Button
                  onPress={() =>
                    localNotificationsServiceRef.current!.cancelScheduledNotificationAsync(notification.identifier)
                  }
                  title="Cancel"
                  color={"red"}
                />
              </View>
            </Card>
          )
        }}
      />
    </View>
  )
}
