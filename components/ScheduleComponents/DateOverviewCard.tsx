import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import AppText from "../../shared/AppText"
import { palette } from "../../styles/global"
import { editorImages } from "../../constants/Images"
import { SDstyles } from "../ScheduleComponents/ScheduleDay"
import GetWeekType from "../../utilities/getWeekType"
import _ from "lodash"
import { isRunningInBrowser } from "../../utilities/utilities"

export default function DateOverviewCard() {
  // current day of the week, in this format: "Понеділок" and nothing else
  let currentDayString = new Date()
    .toLocaleDateString("uk-UA", {
      weekday: "long",
    })
    .split(",")[0]

  currentDayString = _.capitalize(currentDayString)

  const currentDayDate = new Date().toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  })

  // current work week interval, in this format: "12.04.2021 - 18.04.2021", where start date is monday and end date is friday
  const currentWorkWeekInterval = (() => {
    const currentDate = new Date()
    // starts with sunday by default, so we need to subtract 1 for it to start with monday
    let currentDayOfWeek = currentDate.getDay() - 1
    if (currentDayOfWeek == -1) {
      currentDayOfWeek = 6
    }
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const mondayDate = new Date(currentYear, currentMonth, currentDate.getDate() - currentDayOfWeek)
    const fridayDate = new Date(currentYear, currentMonth, currentDate.getDate() - currentDayOfWeek + 4)

    return `${mondayDate.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })} – ${fridayDate.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })}`
  })()

  const currentWeekType = GetWeekType() == 0 ? "Чисельник" : "Знаменник"

  return (
    <View
      style={[
        styles.scheduleDayCard,
        {
          marginHorizontal: 10,
        },
      ]}
    >
      <View
        style={[
          {
            marginVertical: 5,
            paddingHorizontal: 10,
            paddingLeft: 5,
            paddingVertical: 3,
          },
          { flexDirection: "row" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <AppText style={styles.upperRowText}>{currentWeekType}</AppText>
          <AppText style={styles.lowerRowText}>{currentWorkWeekInterval}</AppText>
        </View>
        {isRunningInBrowser() ? <View style={styles.verticalSeparator} /> : <View />}

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <AppText style={styles.upperRowText}>{currentDayString}</AppText>
          <AppText style={styles.lowerRowText}>{currentDayDate}</AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scheduleDayCard: {
    ...SDstyles.scheduleDayCard,
    borderColor: "#8FB7DA",
    borderWidth: 1,
    elevation: 2,
  },

  verticalSeparator: {
    width: 1,
    height: "100%",
    backgroundColor: palette.background,
    opacity: 0.5,
    marginHorizontal: 10,
  },

  upperRowText: {
    fontFamily: "montserrat-medium",
    fontSize: 13,
    marginBottom: 5,
  },

  lowerRowText: {
    color: palette.grayedOut,
  },
})
