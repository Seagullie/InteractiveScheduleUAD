import { Ionicons } from "@expo/vector-icons"
import React, { useRef } from "react"
import { View, StyleSheet, TextInput, Linking } from "react-native"
import { globalStyles, palette } from "../styles/global"
import useEffect from "react"

import teachersJson from "../assets/teachers.json"
import { FlatList } from "react-native-gesture-handler"
import Card from "../shared/card"
import TeacherTableModel from "../models/TeacherTableModel"
import AppText from "../shared/AppText"

// TODO: fix scroll view intercepting select event on text

export default function TeachersScreen() {
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const teachersTable = useRef(TeacherTableModel.GetInstance())

  const [teachers, setTeachers] = React.useState<typeof teachersJson>(teachersTable.current.teachers)

  const filteredTeachers = teachers.filter((teacher) => {
    const teacherJson = JSON.stringify(teacher)
    return teacherJson.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <View style={styles.container}>
      <View style={{ ...styles.horizontalFlex, ...styles.searchBarContainer }}>
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
                  fontFamily: "montserrat-bold",
                }}
                selectable
              >
                {teacher["ПІБ викладача"]}
              </AppText>
              <AppText style={[]} selectable>
                {teacher.Кваліфікаця}
              </AppText>
              <AppText
                style={[globalStyles.link]}
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
                  style={[globalStyles.underlinedLink]}
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
    paddingVertical: 2,

    marginHorizontal: 10,
  },

  searchBar: {
    fontSize: 14,
    flex: 1,
    fontFamily: "montserrat-500",
  },

  teacherCard: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    paddingVertical: 12,
    borderRadius: 7,
    backgroundColor: "white",

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
