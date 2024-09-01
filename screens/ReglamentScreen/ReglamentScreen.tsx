// EXTERNAL DEPENDENCIES

import React from "react"
import { View } from "react-native"

import { ScrollView } from "react-native-gesture-handler"

// INTERNAL DEPENDENCIES

import { REGLAMENT_DATA } from "../../constants/Constants"
import { styles } from "./Styles"
import { ReglamentClass } from "./ReglamentClassComponent"

console.log("Importing modules...")

// TODO: try to make own table component with flexbox (additional motivation here is to have builds not fail due to react-native-table-component)
// or follow this article: https://rn-master.com/sortable-react-native-table-example/

export default function ReglamentScreen() {
  console.log("Rendering ReglamentScreen...")
  return (
    <View style={[styles.reglamentContainer, { paddingTop: 20 }]}>
      <ScrollView>
        {REGLAMENT_DATA.map((item, index) => {
          return <ReglamentClass index={index} key={index} />
        })}
      </ScrollView>
    </View>
  )
}
