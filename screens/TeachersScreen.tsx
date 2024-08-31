import { Ionicons } from "@expo/vector-icons"
import React, { useRef } from "react"
import { View, StyleSheet, TextInput, Linking } from "react-native"
import { globalStyles, palette } from "../styles/global"
import useEffect from "react"

import teachersJson from "../assets/teachers.json"
import { FlatList } from "react-native-gesture-handler"
import Card from "../components/shared/card"
import TeacherModel from "../models/TeacherModel/TeacherModel"
import AppText from "../components/shared/AppText"
import { FontName } from "../constants/Fonts"

// TODO: fix scroll view intercepting select event on text

export default function TeachersScreen() {
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const teachersTable = useRef(TeacherModel.GetInstance())

  const [teachers, setTeachers] = React.useState<typeof teachersJson>(teachersTable.current.teachers)

  const filteredTeachers = teachers.filter((teacher) => {
    const teacherJson = JSON.stringify(teacher)
    return teacherJson.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <View style={styles.container}>
      <View style={{ ...globalStyles.horizontalCenteredFlex, ...styles.searchBarContainer }}>
        <Ionicons name="search-outline" size={14} style={{ marginHorizontal: 5 }} color={palette.grayedOut} />
        <TextInput style={styles.searchBar} onChangeText={setSearchQuery} placeholder="Знайти викладача" />
      </View>
      <View></View>
      <FlatList
        data={filteredTeachers}
        userSelect="text"
        keyExtractor={(item) => item["ПІБ викладача"]}
        renderItem={({ item, index }) => {
          const teacher = item
          return (
            <View key={index} style={styles.teacherCard}>
              <AppText
                style={{
                  fontFamily: FontName.MontserratBold,
                  ...styles.teacherDataText,
                  fontSize: styles.teacherDataText.fontSize + 2,
                }}
                selectable
              >
                {teacher["ПІБ викладача"]}
              </AppText>
              <AppText style={[styles.teacherDataText]} selectable>
                {teacher.Кваліфікаця}
              </AppText>
              <AppText
                style={[globalStyles.link, styles.teacherDataText]}
                selectable
                onPress={() => {
                  console.log("pressed")
                  Linking.openURL(teacher["Кафедра Посилання"])
                }}
              >
                {`Кафедра ${teacher["Кафедра Абревіатура"]} (${teacher["Кафедра Повна назва"]})`}
              </AppText>

              {!teacher["E-mail"].endsWith(".ru") ? (
                <AppText
                  style={[globalStyles.underlinedLink, styles.teacherDataText, { marginBottom: 0 }]}
                  selectable
                  onPress={() => {
                    console.log("pressed")
                    // open email
                    Linking.openURL("mailto:" + teacher["E-mail"])
                  }}
                >
                  {teacher["E-mail"]}
                </AppText>
              ) : (
                <View />
              )}
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundLight,
  },

  horizontalFlex: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchBarContainer: {
    marginVertical: 10,
    backgroundColor: palette.background,
    borderRadius: 7,
    padding: 5,
    paddingVertical: 4,

    marginHorizontal: 10,
  },

  searchBar: {
    ...globalStyles.searchBar,
    fontSize: 14,
  },

  teacherCard: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 14,
    paddingVertical: 12,
    borderRadius: 7,
    backgroundColor: "white",

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  teacherDataText: {
    fontSize: 14,
    marginBottom: 6,
  },
})
