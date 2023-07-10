import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Button } from "react-native-elements"
import { SafeAreaView } from "react-native-safe-area-context"
import ScheduleLoaderService from "../../services/ScheduleLoaderService"
import ScheduleModel, { ScheduleDay } from "../../models/ScheduleModel"
import SettingsService from "../../services/SettingsService"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"

import { useSwipeableItemParams } from "react-native-swipeable-item"
import { globalStyles } from "../../styles/global"
import { useNavigation } from "@react-navigation/native"
import _ from "lodash"
import { EditorStackRoutes } from "../../routes/EditorStackRoutes"

import "setimmediate"

// TODO: use this library to implement swipeable items
// https://github.com/computerjazz/react-native-swipeable-item

export default function ScheduleEditor() {
  let [isReady, setIsReady] = useState(false)
  let [sampleScheduleDay, setSampleDay] = useState<ScheduleDay>()

  let settingsServiceRef = React.useRef<SettingsService | null>(null)

  let navigation = useNavigation()
  const currentRouteName = navigation.getId()

  useEffect(() => {
    async function init() {
      let scheduleLoaderInstance = await ScheduleLoaderService.GetInstance()
      let schedule = new ScheduleModel("groupname_groupyear", "groupname", 5)

      // TODO: Fix warning about undefined

      let firstScheduleFile = scheduleLoaderInstance.scheduleFiles[0]
      let firstScheduleFilename = firstScheduleFile.filename
      console.log("first schedule filename:", firstScheduleFilename)

      await schedule.getScheduleFromScheduleLoader(firstScheduleFilename)

      let settingsService = await SettingsService.GetInstance()
      settingsServiceRef.current = settingsService

      setSampleDay(schedule.scheduleDays[0])
      setIsReady(true)
    }

    init()
  }, [])

  let [data, setData] = useState([
    { key: "1", title: "Item 1", isSlot: true },
    { key: "2", title: "Item 2", isSlot: true },
    { key: "3", title: "Item 3", isSlot: false },
    // { key: "4", title: "Item 4", isSlot: false },
    // { key: "5", title: "Item 5", isSlot: false },
    // { key: "6", title: "Item 6", isSlot: false },
    // { key: "7", title: "Item 7", isSlot: true },
    // { key: "8", title: "Item 8", isSlot: false },
    // { key: "9", title: "Item 9", isSlot: false },
    // { key: "10", title: "Item 10", isSlot: false },
  ])

  if (!isReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Редактор</Text>
        <Text> ({currentRouteName})</Text>
        <View style={[{ flexDirection: "row", justifyContent: "space-around" }]}>
          <Button title="Save" />
          <Button title="Cancel" />
          <Button title="Reset" />
        </View>
        <FlatList
          scrollEnabled={true}
          nestedScrollEnabled={false}
          data={[data, data, data, data]}
          keyExtractor={(item) => Math.random().toString()}
          renderItem={({ item }) => {
            let dataElem = item
            return (
              <FlatList
                // scrollEnabled={false}
                // nestedScrollEnabled={true}
                // prop
                data={dataElem}
                key={Math.random().toString()}
                keyExtractor={(item) => _.random(0, 100000, false).toString()}
                onDragEnd={({ data }) => console.log("[drag end] data:", data)}
                renderItem={({ item: draggable, drag, isActive }) => {
                  return (
                    <TouchableOpacity
                      style={[
                        { backgroundColor: isActive ? "orange" : "red" },
                        { margin: 10 },
                        draggable.isSlot ? { backgroundColor: "gray" } : {},
                      ]}
                      onLongPress={drag}
                      onPress={() => {
                        navigation.push(EditorStackRoutes.SCHEDULE_CLASS_FORM, {
                          scheduleClass: draggable,
                          onFormDataUpdated: (updatedClass) => {
                            console.log("updated class:", updatedClass)

                            let isNewEntry = updatedClass.title != ""
                            let isSlot = !isNewEntry

                            setData(
                              dataElem.map((class_) =>
                                class_.key === draggable.key ? { ...class_, ...updatedClass, isSlot } : class_
                              )
                            )
                          },
                        })
                      }}
                    >
                      {/* <SwipeableItem
                        key={draggable.key}
                        // item={item}
                        renderUnderlayLeft={() => <UnderlayRightSide />}
                        // renderUnderlayRight={() => <UnderlayLeft />}
                        snapPointsLeft={[!draggable.isSlot ? 50 : 0]} // snap points for right side underlay
                        snapPointsRight={[0]} // disable left side underlay
                        activationThreshold={10}
                      > */}
                      <View style={[styles.reorderable]}>
                        <Text>{draggable.title}</Text>
                      </View>
                      {/* </SwipeableItem> */}
                    </TouchableOpacity>
                  )
                }}
              />
            )
          }}
          style={{ padding: 20 }}
        ></FlatList>
      </View>
    </SafeAreaView>
  )
}

const UnderlayRightSide = () => {
  const { close } = useSwipeableItemParams<Item>()
  function openClassEditScreen(): void {}

  return (
    <View
      style={[
        styles.row,
        styles.underlayLeft,
        {
          // alignSelf: "center",
        },
      ]}
    >
      <View>
        <TouchableOpacity onPress={() => close()}>
          <Text style={styles.text}>Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  reorderable: {
    height: 20,
    width: "95%",
    ...globalStyles.centered,
    marginVertical: 5,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },

  underlayLeft: {
    flex: 1,
    backgroundColor: "lime",
    justifyContent: "flex-end",
  },

  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 32,
  },
})
