import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import AppText from "../../../shared/AppText"
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TextProps,
  TextInputProps,
} from "react-native"
import { Button, Input } from "react-native-elements"
import Autocomplete from "react-native-autocomplete-input"
import { palette } from "../../../styles/global"
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"
import TeacherTableModel from "../../../models/TeacherTableModel"
import CustomSwitch from "../../../shared/Switch"
import { CLASS_TYPE, ScheduleClass, ScheduleClassProps } from "../../../models/ScheduleModel"
import { Form, Formik, useFormikContext } from "formik"
import { REGLAMENT_DATA, suffixesForNumbers } from "../../../constants/Constants"
import getStrict from "../../../utilities/getStrict"
import { formatTeacherName, formatRoomName } from "../../../components/ScheduleComponents/ScheduleClass"
import _ from "lodash"
import { workDays, workDaysEnLower } from "../../../constants/Days"
import { WeekType } from "../../../utilities/getWeekType"
import { RadioButtonGroup } from "../../../shared/RadioButtonGroup"

// autocomplete library: https://www.npmjs.com/package/react-native-autocomplete-input
// another one: https://www.npmjs.com/package/react-native-autocomplete-dropdown

// TODO: do not display all suggestions at once, but only those that match the query (unless query is empty, then display nothing)

type ScheduleClassEditables = Omit<ScheduleClassProps, "index" | "isSharedClass" | "day" | "weekName" | "week">

const AutoSubmitFormData = () => {
  // Grab values and submitForm from context

  let {
    values,
    initialValues,
  }: {
    values: ScheduleClassEditables
    initialValues: ScheduleClassEditables
  } = useFormikContext()

  const { isSubmitting } = useFormikContext()

  let submitFormCallback = useCallback(_.debounce(useFormikContext().submitForm, 1000), [])

  // submitForm = _.debounce(submitForm, 1000)

  React.useEffect(() => {
    // values.teacher = [values.teacher]

    // do not submit form if values haven't changed
    if (values == initialValues) {
      console.log("values haven't changed, won't submit")
      return
    }

    // Submit the form imperatively
    // if (!isSubmitting) submitFormCallback()
    // else console.log("already submitting, won't submit again")
    submitFormCallback()
  }, [values])
  return null
}

// a decorator around TextInput that adds a bottom border and styles the text
const FormTextInput = (props: TextInputProps & { captionText: string; noteText: string | undefined }) => {
  return (
    <View style={[styles.formField]}>
      <AppText style={[styles.fieldCaption]}>{props.captionText}</AppText>

      <View>
        <TextInput cursorColor={palette.navigationBackground} style={styles.textInputText} {...props} />
        <View style={[styles.underline]} />
        {props.noteText ? (
          <AppText style={[styles.fieldCaption, { fontSize: 12, fontFamily: "montserrat-medium" }]}>
            {props.noteText}
          </AppText>
        ) : null}
      </View>
    </View>
  )
}

export default function ScheduleClassForm() {
  // const navigation = useNavigation()
  // const options = navigation

  const route = useRoute()
  const data = route.params
  const {
    scheduleClass,
    currentlyViewedWeek,
    onFormDataUpdated,
  }: {
    scheduleClass: ScheduleClass
    currentlyViewedWeek: WeekType
    onFormDataUpdated: (data: ScheduleClassProps) => void
  } = data

  let kbAvoidingViewBehavior: "padding" | "height" | "position" = Platform.OS === "ios" ? "padding" : "height"
  kbAvoidingViewBehavior = "position" // position seems to work better than height

  let reglamentClass = getStrict(REGLAMENT_DATA, scheduleClass.index - 1)

  let classStart: string = reglamentClass[1]
  if (classStart.length == 4) classStart = "0" + classStart

  const classEnd: string = reglamentClass[2]

  const teacher = scheduleClass.teacher

  const dayUkrIndex = workDaysEnLower.findIndex((d) => scheduleClass.day == d)
  console.log("|" + scheduleClass.day + "|")
  const dayUkr = workDays[dayUkrIndex]

  const weekTypeUkr = currentlyViewedWeek == 0 ? "Чисельник" : "Знаменник"

  const classType = scheduleClass.classType

  const scheduleClassEditables = _.pick(scheduleClass, ["isBiweekly", "name", "teacher", "room", "classType"])

  const initialFormikValues: ScheduleClassEditables = {
    ...scheduleClassEditables,
    teacher: teacher && typeof teacher == "string" ? teacher : teacher.join(", "),
    room: formatRoomName(scheduleClass, true),
  }

  return (
    <Formik
      initialValues={initialFormikValues}
      onSubmit={(values) => {
        console.log("Submitting Formik form...")
        console.log(values)
        onFormDataUpdated(values)
      }}
    >
      {({ values, handleChange, handleBlur, submitForm }) => {
        return (
          <View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: "space-between",
                },
              ]}
            >
              <View>
                <AppText style={[styles.headerTextPrimary]}>Пара №{scheduleClass.index}</AppText>
                <AppText style={[styles.headerTextSecondary]}>
                  {classStart} – {classEnd}
                </AppText>
              </View>

              <View>
                <AppText
                  style={[
                    {
                      textAlign: "right",
                    },
                    styles.headerTextPrimary,
                  ]}
                >
                  {weekTypeUkr}
                </AppText>
                <AppText
                  style={[
                    {
                      textAlign: "right",
                    },
                    styles.headerTextSecondary,
                  ]}
                >
                  {dayUkr}
                </AppText>
              </View>
            </View>
            <FormTextInput captionText="Предмет" value={values.name} onChangeText={handleChange("name")} />

            <FormTextInput
              autoCapitalize="words"
              captionText="Викладач"
              value={values.teacher}
              noteText="*якщо декілька – прізвища через кому"
              onChangeText={handleChange("teacher")}
            />

            <FormTextInput
              captionText="Аудиторія"
              value={values.room}
              noteText="*якщо декілька – через кому"
              onChangeText={handleChange("room")}
            />
            {/* 
            <View style={[styles.row]}>
              <AppText>Посилання: </AppText>
              <TextInput placeholder="https://us04web.zoom.us/j/75735448331?pwd=4X7q7Wu5jf43QTje5BuhChQnUcL6I1.1" />
            </View> */}
            <RadioButtonGroup
              options={[
                {
                  title: CLASS_TYPE.LECTURE,
                  code_name: CLASS_TYPE.LECTURE,
                },
                {
                  title: CLASS_TYPE.LAB,
                  code_name: CLASS_TYPE.LAB,
                },
                {
                  title: CLASS_TYPE.PRACTICE,
                  code_name: CLASS_TYPE.PRACTICE,
                },
              ]}
              onOptionSelected={(o) => handleChange("classType")(o.code_name)}
              selectedOptionIndex={
                values.classType == CLASS_TYPE.LECTURE ? 0 : values.classType == CLASS_TYPE.LAB ? 1 : 2
              }
            />

            <View
              style={[
                styles.row,
                {
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  paddingRight: 10,
                },
              ]}
            >
              <AppText
                style={[
                  {
                    fontSize: 14,
                    fontFamily: "montserrat-medium",
                  },
                ]}
              >
                Щотижнева пара
              </AppText>
              {/* <TextInput placeholder="Лекція" /> */}

              <CustomSwitch initVal={!values.isBiweekly} onValueChange={(e) => handleChange("isBiweekly")(!e + "")} />
            </View>

            {/* <KeyboardAvoidingView behavior={kbAvoidingViewBehavior} style={[styles.row]}>
        <AppText>KeyboardAvoidingView -1</AppText>
        <Button title={"Button"} />
      </KeyboardAvoidingView> */}
            <AutoSubmitFormData />
          </View>
        )
      }}
    </Formik>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  formField: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },

  underline: {
    height: 1,
    backgroundColor: "#C6C4C4",
    width: "100%",

    marginVertical: 1,
  },

  fieldCaption: {
    fontFamily: "montserrat-semibold",
    color: palette.grayedOut,
  },

  textInputText: {
    fontSize: 14,
    fontFamily: "montserrat-semibold",
    color: palette.text,
  },

  headerTextPrimary: {
    fontSize: 14,
    fontFamily: "montserrat-medium",
  },

  headerTextSecondary: {
    fontSize: 14,
    fontFamily: "montserrat-medium",
    color: palette.grayedOut,
  },
})
