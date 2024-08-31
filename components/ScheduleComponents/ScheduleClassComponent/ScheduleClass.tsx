// EXTERNAL DEPENDENCIES

import React, { useContext, useEffect, useState } from "react"
import { View, useWindowDimensions, ActivityIndicator, ToastAndroid } from "react-native"
import _ from "lodash"
import * as Clipboard from "expo-clipboard"

// INTERNAL DEPENDENCIES

import { CLASS_TYPE_SHORT, CLASS_TYPE } from "../../../models/ScheduleClass/Types"
import { globalStyles, palette } from "../../../styles/global"
import getStrict from "../../../utilities/getStrict"
import { REGLAMENT_DATA } from "../../../constants/Constants"
import { DisplayTeacherMode } from "../../../services/SettingsService/Types"
import { SettingsContext } from "../../../contexts/settingsContext"
import ScheduleText from "../ScheduleText"
import { isRunningInBrowser } from "../../../utilities/utilities"
import { WeekTypeContext } from "../../../contexts/weekTypeContext"
import GetWeekType from "../../../utilities/getWeekType"
import { styles } from "./Style"
import { formatRoomName, formatTeacherName } from "./Formatters"
import { ScheduleClassComponentProps } from "./Types"

export default function ScheduleClassComponent({
  scheduleClassInstance,
  idx,
  displayRoomNumber,
  isEditable = false,
  highlightAsOngoing = false,
}: ScheduleClassComponentProps) {
  let [state, setState] = React.useState({})
  let isCurrentClassRef = React.useRef(scheduleClassInstance.isCurrent())

  const [unfoldClassText, setUnfoldClassText] = React.useState(isEditable)
  const [unfoldTeacherText, setUnfoldTeacherText] = React.useState(isEditable)

  const { height, width } = useWindowDimensions()
  const settings = useContext(SettingsContext)
  const selectedWeekType = useContext(WeekTypeContext)

  let [isOngoingClass, setIsOngoingClass] = useState(false)
  let className = scheduleClassInstance.name
  let room = formatRoomName(scheduleClassInstance, unfoldClassText)
  let teacher = formatTeacherName(scheduleClassInstance, isEditable, settings) // need to run this on every rerender because teacher name could have changed in settings

  let shouldDisplayTeacher = isEditable || settings!.displayTeacherName != DisplayTeacherMode.Hide

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const rerenderInterval = setInterval(() => {
      // periodically re-render component to update ongoing class

      let isCurrentClass = scheduleClassInstance.isCurrent()
      let wasCurrent = isCurrentClassRef.current

      if (isCurrentClass != wasCurrent) {
        isCurrentClassRef.current = isCurrentClass
        setState({})
      }
    }, 15000)

    async function init() {
      let isOngoingClass = scheduleClassInstance.isCurrent() && selectedWeekType == GetWeekType()

      setIsOngoingClass(isOngoingClass)
      setIsReady(true)
    }

    init()

    return () => clearInterval(rerenderInterval)
  }, [])

  let reglamentClass = getStrict(REGLAMENT_DATA, scheduleClassInstance.index - 1)

  let classStart: string = reglamentClass[1]
  if (classStart.length == 4) classStart = "0" + classStart

  const classEnd: string = reglamentClass[2]

  if (!isReady) {
    return (
      <View style={[{ paddingVertical: 10 }]}>
        <ActivityIndicator size="small" color={palette.navigationBackground} />
      </View>
    )
  }

  return (
    <View key={idx}>
      <View
        style={{ ...styles.classContainer, ...(isOngoingClass || highlightAsOngoing ? styles.ongoingClass : {}) }}
        testID="schedule-class"
      >
        <View style={styles.startAndEndTimesContainer}>
          <ScheduleText style={[styles.text, styles.classStartText]}>{classStart}</ScheduleText>
          <ScheduleText style={[styles.text, styles.classEndText]}>{classEnd} </ScheduleText>
        </View>
        <View style={styles.classAndTeacherBlock}>
          <ScheduleText
            onPress={() => {
              if (isEditable) return
              setUnfoldClassText(!unfoldClassText)
            }}
            // onLongPress={() => null} // necessary for text to be selectable on long press (otherwise onPress will rerender the component in attempt to expand it)

            onLongPress={() => {
              if (isEditable) return
              Clipboard.setStringAsync(className).then(() => {
                if (isRunningInBrowser()) return
                ToastAndroid.show("Скопійовано: предмет", ToastAndroid.SHORT)
              })
            }}
            style={[styles.classNameText, teacher == "..." ? { flexGrow: 0 } : {}]}
            ellipsizeMode="tail"
            numberOfLines={!unfoldClassText ? 1 : 0}
          >
            {className}
          </ScheduleText>
          <ScheduleText
            onPress={() => {
              if (isEditable) return

              setUnfoldTeacherText(!unfoldTeacherText)
            }}
            // onLongPress={() => null} // necessary for text to be selectable on long press (otherwise onPress will rerender the component in attempt to expand it)

            onLongPress={() => {
              if (isEditable) return
              Clipboard.setStringAsync(teacher).then(() => {
                if (isRunningInBrowser()) return
                ToastAndroid.show("Скопійовано: викладач", ToastAndroid.SHORT)
              })
            }}
            style={[styles.teacherNameText, !shouldDisplayTeacher || teacher == "..." ? globalStyles.noDisplay : {}]}
            ellipsizeMode="tail"
            numberOfLines={!unfoldTeacherText ? 1 : 0}
            testID="teacher-text"
          >
            {teacher}
          </ScheduleText>
        </View>
        <View style={styles.classTypeAndRoomNumberContainer}>
          <View
            style={
              scheduleClassInstance.classType != CLASS_TYPE.LECTURE && !unfoldClassText
                ? styles.roomNumberContainer
                : globalStyles.noDisplay
            }
          >
            <ScheduleText style={styles.roomNumberText}>
              {CLASS_TYPE_SHORT[scheduleClassInstance.classType]}
            </ScheduleText>
          </View>

          <View style={displayRoomNumber ? styles.roomNumberContainer : globalStyles.noDisplay}>
            <ScheduleText
              onLongPress={() => {
                if (isEditable) return

                Clipboard.setStringAsync(room).then(() => {
                  if (isRunningInBrowser()) return
                  ToastAndroid.show("Скопійовано: аудиторія", ToastAndroid.SHORT)
                })
              }}
              style={styles.roomNumberText}
            >
              {room}
            </ScheduleText>
          </View>
        </View>
      </View>
    </View>
  )
}
