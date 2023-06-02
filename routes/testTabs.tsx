import * as React from "react"
import { PixelRatio, Text, View, useWindowDimensions } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import NotificationTestsScreen from "../screens/TestTabsScreens/NotificationTests"
import ScheduledNotificationsScreen from "../screens/TestTabsScreens/ScheduledNotificationsScreen"
import InroductoryCarousel from "../screens/TestTabsScreens/IntroductoryCarousel"
import InroductoryCarouselScreen from "../screens/TestTabsScreens/IntroductoryCarousel"
import FileSystemScreen from "../screens/TestTabsScreens/FileSystemScreen"
import ScheduleEditor from "../screens/TestTabsScreens/ScheduleEditor"
import TestEditorStack from "./testEditorStack"
import ContactsModalsTestScreen from "../screens/TestTabsScreens/ContactsModalsTestScreen"
import ContactsTestStack, { ContactsStackRoutes } from "./ContactsTestStack"

function DeviceInfoScreen() {
  const { height, width } = useWindowDimensions()
  const aspectRatio = height / width
  let pixelRatio = PixelRatio.get()
  let dpi = 160 * pixelRatio

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Інформація про пристрій</Text>
      <Text>Ширина вікна: {width}</Text>
      <Text>Висота вікна: {height}</Text>
      <Text>Pixel ratio: {pixelRatio}</Text>
      <Text>Aspect ratio: {aspectRatio}</Text>
      <Text>DPI: {dpi}</Text>
    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function TestTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // display: "none",
        },
      }}
      initialRouteName="Модальні вікна"
    >
      <Tab.Screen
        name="Заплановані Сповіщення"
        component={ScheduledNotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-circle" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Сповіщення"
        component={NotificationTestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Вступне Вікно"
        component={InroductoryCarouselScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="enter" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Файлова Система"
        component={FileSystemScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="folder" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Редактор"
        component={TestEditorStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="options" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Модальні вікна"
        component={ContactsTestStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="md-file-tray-stacked" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Інше"
        component={DeviceInfoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
}
