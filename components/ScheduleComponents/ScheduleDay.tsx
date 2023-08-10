import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Text, View, StyleSheet, ActivityIndicator } from "react-native"
import Card from "../../shared/card"
import { globalStyles, palette } from "../../styles/global"
import ScheduleModel, { ScheduleClass, ScheduleClassProps, ScheduleDay } from "../../models/ScheduleModel"
import _ from "lodash"
import ScheduleClassComponent from "./ScheduleClass"
import Separator from "../../shared/Separator"
import GetWeekType from "../../utilities/getWeekType"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import SwipeableItem, { useSwipeableItemParams } from "react-native-swipeable-item"
// import { EditorStackRoutes } from "../routes/editorStack"
import UnderlayRightSide from "../ScheduleEditorComponents/ScheduleClassUnderlay"
import DraggableFlatList from "react-native-draggable-flatlist"
import AppText from "../../shared/AppText"
import { mapUkrWorkDayToEnWorkDay } from "../../constants/Days"
import ScheduleLoaderService from "../../services/ScheduleLoaderService"
import ScheduleNotificationsService from "../../services/ScheduleNotificationsService"
import SettingsService, { DisplayEmptyDaysMode } from "../../services/SettingsService"
import { EditorStackRoutes } from "../../routes/EditorStackRoutes"
import { SettingsContext } from "../../contexts/settingsContext"
import { NoClassesText } from "../../constants/Descriptions"

// TODO: accelerate disengage time once an item gets dropped into new slot

export default function ScheduleDayComponent({
  classesCollection,
  scheduleObject,
  dayName,
  scheduleDay,
  displayRoomNumber,
  weekType = GetWeekType(),
  fade,
  isEditable = false,
}: {
  classesCollection: ScheduleClass[]
  scheduleObject: ScheduleModel
  dayName: string
  scheduleDay: ScheduleDay
  displayRoomNumber: boolean
  weekType?: number
  fade: boolean
  isEditable?: boolean
}): JSX.Element {
  if (scheduleDay == undefined) {
    return (
      <View style={styles.scheduleDayCard}>
        <Text style={globalStyles.dayNameHeader}>{dayName}</Text>
        <View>
          <View style={globalStyles.centered}>
            <ActivityIndicator size="large" color={palette.navigationBackground} />
          </View>
        </View>
      </View>
    )
  }

  const settings = useContext(SettingsContext)

  const configureNotificationsCallback = useCallback(
    _.debounce(async (updatedSchedule) => {
      let scheduleNotificationService = await ScheduleNotificationsService.GetInstance()
      scheduleNotificationService.configureNotificationsForSchedule(updatedSchedule)
    }, 3000),
    []
  )

  let navigation = useNavigation()

  let [classes, setClasses] = useState<ScheduleClass[]>([])
  let dayNameEnRef = useRef(mapUkrWorkDayToEnWorkDay(dayName).toLowerCase())

  function saveEditedClasses(classes: ScheduleClass[]) {
    console.log("saving edited classes")
    let updatedSchedule = scheduleObject
    let classesWithoutPlaceholders = classes.filter((class_) => !class_.isSampleClass())

    let thisDay = updatedSchedule.scheduleDays.find((day) => day.name == dayNameEnRef.current)
    // construct new classes array with classes of other week preserved

    let biweeklyClassesOfOtherWeek = thisDay!.classes.filter(
      (class_) => class_.isBiweekly && class_.week != weekType + 1
    )

    thisDay!.classes = [...classesWithoutPlaceholders, ...biweeklyClassesOfOtherWeek]

    ScheduleLoaderService.GetInstance().then((instance) => {
      instance.dumpSchedule(updatedSchedule)
    })

    SettingsService.GetInstance().then((instance) => {
      if (instance.notifyBeforeClass) {
        configureNotificationsCallback(updatedSchedule)
      }
    })
  }

  // any time new updated classes collection prop is passed, add placeholders to it and update state
  // it also initializes classes state on first render
  useEffect(() => {
    setClasses(addPlaceholders(classesCollection))
  }, [classesCollection])

  useEffect(() => {
    console.log("mounting schedule day component")
  }, [])

  function addPlaceholders(classes: ScheduleClass[]) {
    if (!isEditable) {
      return classes
    }

    let extendedContainer: ScheduleClass[] = [undefined, undefined, undefined, undefined, undefined, undefined]
    extendedContainer = extendedContainer.map((_, idx) => {
      let class_ = classes.find((class_) => class_.index == idx + 1)
      const shouldCreatePlaceholderClass = class_ == undefined

      if (shouldCreatePlaceholderClass) {
        return ScheduleClass.GetPlaceholder(dayNameEnRef.current, idx + 1, weekType + 1)
      } else {
        return class_
      }
    })

    return extendedContainer
  }

  // flat list doesn't suppress scroll events while nested inside ScrollView and is preferrable if component is not editable
  const ListComponent = isEditable ? DraggableFlatList : FlatList

  return (
    <View key={dayName + weekType}>
      <Text style={styles.dayNameHeader}>{dayName}</Text>
      <View
        style={[
          styles.scheduleDayCard,
          classes.length == 0 && settings?.displayEmptyDays == DisplayEmptyDaysMode.Darken
            ? styles.fadedDayContainerView
            : {},
        ]}
      >
        <ListComponent
          data={classes}
          keyExtractor={(item) => item.index + "" + item.week}
          onDragEnd={({ data }) => {
            // reindex
            data = data.map((class_, idx) => {
              class_.index = idx + 1
              return class_
            })

            // TODO: Refactor into one function
            setClasses(data)
            saveEditedClasses(data)
          }}
          ListEmptyComponent={() => {
            return <AppText style={styles.noClassesText}>{_.sample(NoClassesText)}</AppText>
          }}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          ItemSeparatorComponent={() => {
            return <Separator width="97%" color="rgba(217, 217, 217, 0.4)" upperElement={true} lowerElement={true} /> // TODO: Refactor
          }}
          renderItem={({ item, drag, isActive }) => {
            let class_ = item
            let idx = item.index - 1

            // normal class component
            let scheduleClassComponent = (
              <ScheduleClassComponent
                displayRoomNumber={displayRoomNumber}
                idx={idx}
                key={idx + "" + class_.week}
                scheduleClassInstance={class_}
                isEditable={isEditable}
                noTeacherText="Викладач"
                highlightAsOngoing={isActive}
              />
            )

            const onDeleteButtonPressed = () => {
              let filteredClasses = classes.filter((class_) => class_.index != idx + 1)
              let filteredClassesWithPlaceholders = addPlaceholders(filteredClasses)
              setClasses(filteredClassesWithPlaceholders)
              saveEditedClasses(filteredClassesWithPlaceholders)
            }

            // editable class component
            let editableScheduleClassWrapper = (
              <SwipeableItem
                key={idx + "" + class_.week}
                // item={item}
                renderUnderlayLeft={() => (
                  <UnderlayRightSide
                    onDeleteButtonPress={() => {
                      onDeleteButtonPressed()
                    }}
                  />
                )}
                // renderUnderlayRight={() => <UnderlayLeft />}
                snapPointsLeft={[50]} // snap points for right side underlay
                snapPointsRight={[0]} // disable left side underlay
                activationThreshold={10}
              >
                <TouchableOpacity
                  onPress={(e) => {
                    navigation.push(EditorStackRoutes.SCHEDULE_CLASS_FORM, {
                      scheduleClass: class_,
                      currentlyViewedWeek: weekType,
                      onFormDataUpdated: (values: ScheduleClassProps) => {
                        let updatedClasses = classes.map((class_) => {
                          if (class_.index == idx + 1) {
                            // process the values
                            let teacher = values.teacher.split(",").map((t: string) => t.trim())
                            let room = values.room.split(",").map((r: string) => r.trim())
                            let isBiweekly =
                              typeof values.isBiweekly == "string" ? JSON.parse(values.isBiweekly) : values.isBiweekly

                            let wasBiweekly = class_.isBiweekly

                            // if class wasn't biweekly and now it is, update week to currently viewed week
                            if (!wasBiweekly && isBiweekly) {
                              console.log("wasn't biweekly and now it is")
                              console.log("new weekType will be:", weekType + 1)
                              class_.isBiweekly = isBiweekly

                              class_.setWeek(weekType + 1)
                            }

                            return new ScheduleClass(
                              { ...class_, ...values, teacher, room, isBiweekly },
                              dayNameEnRef.current
                            )
                          } else {
                            return class_
                          }
                        })

                        setClasses(updatedClasses)
                        saveEditedClasses(updatedClasses)
                      },
                    })
                  }}
                  onLongPress={drag}
                >
                  {scheduleClassComponent}
                </TouchableOpacity>
              </SwipeableItem>
            )

            return <View>{isEditable ? editableScheduleClassWrapper : scheduleClassComponent}</View>
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  noClassesText: {
    fontSize: 14,
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "center",

    fontFamily: "montserrat-600",

    color: palette.grayedOut,
  },

  fadedDayContainerView: {
    opacity: 0.5,
  },

  dayNameHeader: {
    fontFamily: "montserrat-600",
    fontSize: 14,
    ...globalStyles.sectionHeader,
    color: palette.text,
  },

  scheduleDayCard: {
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: "white",

    paddingVertical: 2,
    paddingHorizontal: 5,

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
})
