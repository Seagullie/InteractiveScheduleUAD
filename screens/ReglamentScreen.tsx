import React, { Component, useEffect, useRef, useState } from "react"
import { FlatList, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, PixelRatio } from "react-native"
import Card from "../shared/card"
import { Text } from "react-native-elements"
import { globalStyles, palette } from "../styles/global"
import SafeAccessArray from "../utilities/getStrict"
import * as Device from "expo-device"

import { useWindowDimensions } from "react-native"
import { determineInterval } from "../utilities/utilities"
import { REGLAMENT_DATA } from "../constants/Constants"
import AppText from "../shared/AppText"
import { ScrollView } from "react-native-gesture-handler"

console.log("Importing modules...")

export const getReglamentClass = (index: number) => {
  // console.log(`Getting class at index ${index}...`)
  // throw if index is out of bounds
  if (index < 0 || index > REGLAMENT_DATA.length - 1) {
    throw new Error("Index out of bounds")
  }

  return REGLAMENT_DATA[index]
}

const tableData = {
  tableHead: ["#", "Початок", "Кінець", "Перерва"],
  tableData: REGLAMENT_DATA,
}

console.log("Creating tableData...")

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

  let [state, setState] = useState({})
  // rerender component if it's not current class anymore or became current class

  useEffect(() => {
    console.log(`Rendering ReglamentClass at index ${index} for the first time...`)

    const interval = setInterval(() => {
      let wasCurrent = isCurrentClassRef.current
      let isCurrent = determineInterval() == classData
      if (wasCurrent != isCurrent) {
        isCurrentClassRef.current = isCurrent
        setState({})
      }
    }, 15000)

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

const ReglamentTable = () => {
  console.log("Rendering Reglament Component...")
  const [data, setData] = useState(tableData)

  let currentTimeInterval = determineInterval()
  let currentLesson = currentTimeInterval ? currentTimeInterval[0] : -1

  const tableRef = React.useRef(null)

  const { height, width } = useWindowDimensions()
  const w = width
  let pixelRatio = PixelRatio.get()
  console.log(`Pixel ratio for this device (resolution: w: ${width}, h: ${height}) is ${pixelRatio} `)

  let cellWidths = [0.09 * w, 0.25 * w, 0.2 * w, 0.39 * w]

  return (
    <View style={styles.container}>
      <View ref={tableRef} style={{ borderWidth: 0, borderColor: "teal" }}>
        <View style={{ ...styles.row, ...styles.head }}>
          {data.tableHead.map((cellText, index) => {
            return (
              <AppText style={{ ...styles.text, ...styles.headerText, width: cellWidths[index], textAlign: "center" }}>
                {cellText}
              </AppText>
            )
          })}
        </View>

        {data.tableData.map((row, index) => {
          if (row[0] === currentLesson) {
            return (
              <View style={styles.row}>
                {row.map((cellText, index) => {
                  return (
                    <AppText
                      style={{
                        ...styles.text,
                        width: cellWidths[index],
                        backgroundColor: "orange",
                        textAlign: "center",
                      }}
                    >
                      {cellText}
                    </AppText>
                  )
                })}
              </View>
            )
          } else {
            return (
              <View style={styles.row}>
                {row.map((cellText, index) => {
                  return <Text style={{ ...styles.text, width: cellWidths[index] }}>{cellText}</Text>
                })}
              </View>
            )
          }
        })}
      </View>
    </View>
  )
}

// TODO: Remove unused styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "scroll",
    padding: 10,
    paddingTop: 30,
    alignItems: "center",
  },

  reglamentClassIndex: {
    fontSize: 14,
    fontFamily: "montserrat-600",
    color: palette.text,

    marginLeft: 10,
    marginBottom: 7,
  },

  reglamentContainer: {
    ...globalStyles.screen,
    flex: 1,

    backgroundColor: palette.backgroundLight,
    // backgroundColor: "red",
  },

  timePointText: {
    color: palette.grayishBlue,
    fontFamily: "montserrat-bold",
  },

  timePointDate: {
    marginTop: 3,
    fontSize: 14,
    color: palette.text,
  },

  timeDataCard: {
    borderRadius: 7,
    backgroundColor: "white",
    margin: 0,
    padding: 10,

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  currentClass: {
    // backgroundColor: "rgb(227, 239, 249)",
    backgroundColor: "#CCDFF1",
  },

  reglamentClassContainer: {
    marginHorizontal: 8,
    marginBottom: 18,
  },

  head: {},
  text: { margin: 0, textAlign: "center", borderBottomWidth: 1, borderRightWidth: 1, padding: 12 },
  headerText: { fontWeight: "bold", fontSize: 14 },
  headText: { margin: 6, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    // backgroundColor: "red",
    backgroundColor: "#f1f8ff",
  },
})
