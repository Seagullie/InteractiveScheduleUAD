import * as React from "react"
import {
  PixelRatio,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
  useWindowDimensions,
} from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import NotificationTestsScreen from "../../screens/TestTabsScreens/NotificationTests"
import Collapsible from "react-native-collapsible"
import { TouchableHighlight } from "react-native-gesture-handler"
import AppText from "./AppText"

export default function Expander({ header, children }: { header: string; children: React.ReactNode }) {
  let [collapsed, setCollapsed] = React.useState(true)
  //   console.log("[Expander] expander recieved these children:")
  //   console.log(children)

  return (
    <View>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <AppText>
          {header} <Ionicons name={collapsed ? "arrow-down" : "arrow-up"} />
        </AppText>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>{children}</Collapsible>
    </View>
  )
}
