import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Text, View, ActivityIndicator } from "react-native"
import { globalStyles, palette } from "../../../styles/global"
import { ScheduleClassFields } from "../../../models/ScheduleClass/Types"
import { ScheduleClass } from "../../../models/ScheduleClass/ScheduleClass"
import _ from "lodash"
import ScheduleClassComponent from "../ScheduleClassComponent/ScheduleClass"
import Separator from "../../shared/Separator"
import GetWeekType from "../../../utilities/getWeekType"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
// import SwipeableItem from "react-native-swipeable-item"
import SwipeableItem from "../../shared/SwipeableItem/SwipeableItem"

import UnderlayRightSide from "../../ScheduleEditorComponents/ScheduleClassUnderlay"
import DraggableFlatList from "react-native-draggable-flatlist"
import AppText from "../../shared/AppText"
import { mapUkrWorkDayToEnWorkDay } from "../../../constants/Days"
import ScheduleLoaderService from "../../../services/ScheduleLoaderService/ScheduleLoaderService"
import ScheduleNotificationsService from "../../../services/ScheduleNotificationsService"
import SettingsService from "../../../services/SettingsService/SettingsService"
import { DisplayEmptyDaysMode } from "../../../services/SettingsService/Types"
import { EditorStackRoutes } from "../../../routes/EditorStackRoutes"
import { SettingsContext } from "../../../contexts/settingsContext"
import { NoClassesText } from "../../../constants/Descriptions"
import { SDstyles } from "./Styles"
import { MAX_CLASSES_PER_DAY } from "../../../constants/Constants"
import { ScheduleDayComponentProps } from "./Types"

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
}: ScheduleDayComponentProps): JSX.Element {
  if (scheduleDay == undefined) {
    // if schedule day is not loaded yet, display loading indicator
    return (
      <View style={SDstyles.scheduleDayCard}>
        <Text>{dayName}</Text>
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
    // debounce to prevent multiple calls in short period of time
    _.debounce(async (updatedSchedule) => {
      const scheduleNotificationService = await ScheduleNotificationsService.GetInstance()
      scheduleNotificationService.configureNotificationsForSchedule(updatedSchedule)
    }, 3000),
    []
  )

  const navigation = useNavigation()

  const [classes, setClasses] = useState<ScheduleClass[]>([])
  const dayNameEnRef = useRef(mapUkrWorkDayToEnWorkDay(dayName).toLowerCase())

  /**
   * Saves edited classes to the schedule
   * @param classes
   */
  function saveEditedClasses(classes: ScheduleClass[]) {
    console.log("saving edited classes")
    const updatedSchedule = scheduleObject
    const classesWithoutPlaceholders = classes.filter((class_) => !class_.isSampleClass())

    const thisDay = updatedSchedule.scheduleDays.find((day) => day.name == dayNameEnRef.current)
    // construct new classes array with classes of other week preserved

    const biweeklyClassesOfOtherWeek = thisDay!.classes.filter(
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
    const placeholderClasses = addPlaceholders(classesCollection)
    // sort by index in ascending order
    const sortedClasses = _.sortBy(placeholderClasses, (class_) => class_.index)

    setClasses(sortedClasses)
  }, [classesCollection])

  useEffect(() => {
    console.log("mounting schedule day component")
  }, [])

  /**
   * Pads classes array with placeholder classes in order to have MAX_CLASSES_PER_DAY classes total for editing purposes.
   */
  function addPlaceholders(classes: ScheduleClass[]) {
    if (!isEditable) {
      return classes
    }

    let extendedContainer: ScheduleClass[] = new Array(MAX_CLASSES_PER_DAY).fill(undefined)
    extendedContainer = extendedContainer.map((_, idx) => {
      const class_ = classes.find((class_) => class_.index == idx + 1)
      const shouldCreatePlaceholderClass = class_ == undefined

      if (shouldCreatePlaceholderClass) {
        return ScheduleClass.GetPlaceholder(dayNameEnRef.current, idx + 1, (weekType + 1) as 1 | 2)
      } else {
        return class_
      }
    })

    return extendedContainer
  }

  // flat list doesn't suppress scroll events while nested inside ScrollView. Flat list is preferrable if component is not editable
  const ListComponent = isEditable ? DraggableFlatList : FlatList

  return (
    <View key={dayName + weekType}>
      <Text style={SDstyles.dayNameHeader}>{dayName}</Text>
      <View
        style={[
          SDstyles.scheduleDayCard,
          classes.length == 0 && settings?.displayEmptyDays == DisplayEmptyDaysMode.Darken
            ? SDstyles.fadedDayContainerView
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
            return (
              <AppText style={SDstyles.noClassesText} testID="noClassesText">
                {_.sample(NoClassesText)}
              </AppText>
            )
          }}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          ItemSeparatorComponent={() => {
            return <Separator width="97%" color="rgba(217, 217, 217, 0.4)" upperElement={true} lowerElement={true} /> // TODO: Refactor
          }}
          // @ts-ignore
          renderItem={({ item, drag, isActive }) => {
            const class_ = item
            const idx = item.index - 1

            // normal class component
            const scheduleClassComponent = (
              <ScheduleClassComponent
                displayRoomNumber={displayRoomNumber}
                idx={idx}
                key={idx + "" + class_.week}
                scheduleClassInstance={class_}
                isEditable={isEditable}
                highlightAsOngoing={isActive}
              />
            )

            const onDeleteButtonPressed = () => {
              const filteredClasses = classes.filter((class_) => class_.index != idx + 1)
              const filteredClassesWithPlaceholders = addPlaceholders(filteredClasses)
              setClasses(filteredClassesWithPlaceholders)
              saveEditedClasses(filteredClassesWithPlaceholders)
            }

            // editable class component
            const editableScheduleClassWrapper = (
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
                      onFormDataUpdated: (values: ScheduleClassFields) => {
                        let updatedClasses = classes.map((class_) => {
                          // get class associated with this component
                          if (class_.index == idx + 1) {
                            // process the values
                            const teacher = values.teacher.split(",").map((t: string) => t.trim())
                            const room = values.room.split(",").map((r: string) => r.trim())
                            const isBiweekly =
                              typeof values.isBiweekly == "string" ? JSON.parse(values.isBiweekly) : values.isBiweekly

                            const wasBiweekly = class_.isBiweekly

                            // if class wasn't biweekly and now it is, update week to currently viewed week
                            if (!wasBiweekly && isBiweekly) {
                              console.log("wasn't biweekly and now it is")
                              console.log("new weekType will be:", weekType + 1)
                              class_.isBiweekly = isBiweekly

                              class_.setWeek((weekType + 1) as 1 | 2)
                            }

                            return new ScheduleClass(
                              { ...class_, ...values, teacher, room, isBiweekly },
                              dayNameEnRef.current
                            )
                          } else {
                            return class_
                          }
                        })

                        // assume that if user completely erases class name, the intent is to delete the class completely. In this case, replace the class with a placeholder
                        updatedClasses = updatedClasses.map((class_) => {
                          if (class_.name == "") {
                            return ScheduleClass.GetPlaceholder(class_.day, class_.index, class_.week)
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
