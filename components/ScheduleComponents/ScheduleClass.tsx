import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, ToastAndroid } from "react-native"
import { CLASS_TYPE_SHORT } from "../../models/ScheduleClass"
import { CLASS_TYPE } from "../../models/ScheduleClass"
import { ScheduleClass } from "../../models/ScheduleClass"
import { globalStyles, palette } from "../../styles/global"
import getStrict from "../../utilities/getStrict"
import { REGLAMENT_DATA } from "../../constants/Constants"
import _ from "lodash"
import TeacherModel from "../../models/TeacherModel"
import SettingsService from "../../services/SettingsService/SettingsService"
import { DisplayTeacherMode } from "../../services/SettingsService/Types"
import { SettingsContext } from "../../contexts/settingsContext"
import ScheduleText from "./ScheduleText"
import * as Clipboard from "expo-clipboard"
import { isRunningInBrowser } from "../../utilities/utilities"
import { WeekTypeContext } from "../../contexts/weekTypeContext"
import GetWeekType from "../../utilities/getWeekType"
import { FontName } from "../../constants/Fonts"

export const formatRoomName = (scheduleClassInstance: ScheduleClass, unfoldClassText: boolean) => {
  let room = ""

  if (
    scheduleClassInstance.room == "" ||
    scheduleClassInstance.room == null ||
    scheduleClassInstance.room == undefined
  ) {
    // collapse all kinds of missing values into empty string
    room = ""
  } else {
    if (typeof scheduleClassInstance.room == "string") {
      room = scheduleClassInstance.room
    } else if (scheduleClassInstance.room.length != undefined) {
      // array check
      room = scheduleClassInstance.room.join("\n")
    }
  }

  // pad dots with spaces
  room = room.replace(/\.(?!\s)/g, ". ")

  if (!unfoldClassText) {
    room = room.split("\n")[0]
  }

  return room
}

export const formatTeacherName = (
  scheduleClassInstance: ScheduleClass,
  isEditable: boolean,
  settings: SettingsService | null // can be null if isEditable is true
) => {
  let teacher = ""

  let teacherTable = TeacherModel.GetInstance()
  let teacherSurname = scheduleClassInstance.teacher
  if (teacherSurname == null) {
    teacher = "..."
  } else if (typeof teacherSurname != "string") {
    if (teacherSurname.length == 1) {
      teacher = teacherTable.getFullNameBySurname(teacherSurname[0])
    } else {
      let teachers = teacherSurname.map((sn) => teacherTable.getSurnameAndInitialsBySurname(sn))
      teacher = teachers.join(", ")
    }
  } else {
    let displayTeacherNameMode = isEditable ? DisplayTeacherMode.Full : settings!.displayTeacherName

    if (displayTeacherNameMode == DisplayTeacherMode.Full) {
      teacher = teacherTable.getFullNameBySurname(teacherSurname)
    } else if (displayTeacherNameMode == DisplayTeacherMode.SurnameAndInitials) {
      teacher = teacherTable.getSurnameAndInitialsBySurname(teacherSurname)
    }
  }

  return teacher
}

export type ScheduleClassComponentProps = {
  scheduleClassInstance: ScheduleClass
  idx: number
  displayRoomNumber: boolean
  isEditable?: boolean
  highlightAsOngoing?: boolean
}

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

const styles = StyleSheet.create({
  ongoingClass: {
    // backgroundColor: "rgba(28, 93, 143, 0.1)",
    backgroundColor: "rgb(227, 239, 249)",
  },

  classContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },

  startAndEndTimesContainer: {
    alignItems: "flex-start",
    width: "10%",
    marginRight: "4%",
  },

  separator: {
    ...globalStyles.separator,

    backgroundColor: "rgba(217, 217, 217, 0.4)",
  },

  text: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
  },

  classStartText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    alignSelf: "center",
  },

  classEndText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    alignSelf: "center",
  },

  classNameText: {
    fontFamily: FontName.MontserratMedium,
    color: palette.text,
    alignSelf: "flex-start",
    textAlign: "left",
    flexGrow: 0.5,
  },

  teacherNameText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.grayedOut,
  },

  roomNumberText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    textAlign: "right",
  },

  classTypeAndRoomNumberContainer: {
    width: "12%",
  },

  roomNumberContainer: {
    // flexGrow: 0.12,
    alignItems: "flex-end",
    textAlign: "right",
  },

  classAndTeacherBlock: {
    // width: "74%",
    flexBasis: "74%",
    flexGrow: 1,
    // flexGrow: 0.74,
    // flexGrow: 1,
    alignItems: "flex-start",
    textAlign: "left",
  },
})
