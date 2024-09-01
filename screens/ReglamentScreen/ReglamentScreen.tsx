// EXTERNAL DEPENDENCIES

import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"

import { ScrollView } from "react-native-gesture-handler"

// INTERNAL DEPENDENCIES

import { determineInterval } from "../../utilities/utilities"
import { REGLAMENT_DATA } from "../../constants/Constants"
import AppText from "../../components/shared/AppText"
import { styles } from "./Styles"

console.log("Importing modules...")

export const getReglamentClass = (index: number) => {
  // console.log(`Getting class at index ${index}...`)
  // throw if index is out of bounds
  if (index < 0 || index > REGLAMENT_DATA.length - 1) {
    throw new Error("Index out of bounds")
  }

  return REGLAMENT_DATA[index]
}

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

const ReglamentClass = ({ index }: { index: number }) => {
  const classData = getReglamentClass(index)

  let currentTimeInterval = determineInterval()
  let isCurrentClassRef = useRef(currentTimeInterval == classData)

  let [_, setState] = useState({})
  // rerender component if it's not current class anymore or became current class

  // mount effect
  useEffect(() => {
    console.log(`Rendering ReglamentClass at index ${index} for the first time...`)

    // update current time slot every 15 seconds
    const interval = setInterval(() => {
      let wasCurrent = isCurrentClassRef.current
      let isCurrent = determineInterval() == classData
      if (wasCurrent != isCurrent) {
        isCurrentClassRef.current = isCurrent
        setState({})
      }
    }, 15000)

    // on unmount
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <View style={styles.reglamentClassContainer}>
      <AppText style={styles.reglamentClassIndex}>{index + 1} пара</AppText>
      <View
        style={[styles.timeDataCard, isCurrentClassRef.current ? styles.currentClass : {}]}
        testID={isCurrentClassRef.current ? "currentClass" + index : "class"}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ alignItems: "flex-start" }}>
            <AppText style={styles.timePointText}>ПОЧАТОК</AppText>
            <AppText style={styles.timePointDate}>{classData[1]}</AppText>
          </View>

          <View style={{ alignItems: "center", justifyContent: "space-between" }}>
            <AppText style={styles.timePointText}>ПЕРЕРВА</AppText>
            <AppText style={[styles.timePointDate, { fontSize: 13 }]}>{classData[3]}</AppText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <AppText style={styles.timePointText}>КІНЕЦЬ</AppText>
            <AppText style={styles.timePointDate}>{classData[2]}</AppText>
          </View>
        </View>
      </View>
    </View>
  )
}
