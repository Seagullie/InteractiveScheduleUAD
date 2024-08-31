import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Collapsible from "react-native-collapsible"
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
