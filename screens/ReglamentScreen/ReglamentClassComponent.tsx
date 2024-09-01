import React, { useEffect, useRef, useState } from "react"
import { View } from "react-native"

import AppText from "../../components/shared/AppText"
import { determineInterval } from "../../utilities/utilities"
import { styles } from "./Styles"
import { REGLAMENT_DATA_ELEM_TYPE, REGLAMENT_DATA } from "../../constants/Constants"

export const ReglamentClass = ({ index }: { index: number }) => {
  const classData = getReglamentClass(index)
  //   let classTimeInterval = classData[1]
  let classStartTime = classData[1]
  let classEndTime = classData[2]

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

  let isCurrentClass = isCurrentClassRef.current

  return (
    <View style={styles.reglamentClassContainer}>
      <View
        style={[styles.timeDataCard, isCurrentClass ? styles.currentClass : {}]}
        testID={isCurrentClassRef.current ? "currentClass" + index : "class"}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <View style={styles.indexTextContainer}>
            <AppText style={[styles.indexText, isCurrentClass ? styles.currentClassIndexText : {}]}>
              {index + 1}
            </AppText>
          </View>
          <View style={[styles.verticalSeparator, isCurrentClass ? { backgroundColor: "#D9D9D9" } : {}]} />

          <View style={styles.timePointTextContainer}>
            <AppText style={styles.timePointText}>
              {classStartTime} – {classEndTime}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  )
}

export const getReglamentClass = (index: number): REGLAMENT_DATA_ELEM_TYPE => {
  // console.log(`Getting class at index ${index}...`)
  // throw if index is out of bounds
  if (index < 0 || index > REGLAMENT_DATA.length - 1) {
    throw new Error("Index out of bounds")
  }

  return REGLAMENT_DATA[index]
}
