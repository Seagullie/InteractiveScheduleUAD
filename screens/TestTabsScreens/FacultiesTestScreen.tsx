import React from "react"
import { View, Text, StyleSheet, Linking } from "react-native"
import { globalStyles, palette } from "../../styles/global"
import AppText from "../../shared/AppText"
import { Ionicons } from "@expo/vector-icons"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"

export default function FacultiesTestScreen() {
  // TODO: perhaps, copy name and full name to clipboard on press

  const renderFacultyCard = (
    nameAbbreviation: string,
    nameFull: string,
    address: string,
    phone: string,
    mail: string
  ) => {
    return (
      <View style={styles.facultyCard}>
        <AppText
          style={{
            fontSize: 18,
            fontFamily: "montserrat-bold",
          }}
        >
          {nameAbbreviation}
        </AppText>
        <AppText style={[]}>{nameFull}</AppText>
        <View style={[globalStyles.captionWithIcon, { marginVertical: 2 }]}>
          <Ionicons name="location" color={palette.grayedOut} size={16} />
          <AppText style={{ marginLeft: 5, fontSize: 14, fontFamily: "montserrat-semibold" }}>{address}</AppText>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${phone}`)}
          style={[globalStyles.captionWithIcon, { marginVertical: 2 }]}
        >
          <Ionicons name="call" color={palette.grayedOut} size={16} />
          <AppText style={{ marginLeft: 5, fontSize: 14, fontFamily: "montserrat-semibold" }}>{phone}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${mail}`)}
          style={[globalStyles.captionWithIcon, { marginVertical: 2 }]}
        >
          <Ionicons name="mail" color={palette.grayedOut} size={16} />
          <AppText
            style={[{ marginLeft: 5, fontSize: 14, fontFamily: "montserrat-semibold" }, globalStyles.underlinedLink]}
          >
            {mail}
          </AppText>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {renderFacultyCard(
        "ФВПІТ",
        "Факультет видавничо-поліграфічних, інформаційних технологій",
        "вул. Під Голоском, 19, ауд. 234",
        "(032) 242 23 77",
        "fvpit@uad.lviv.ua"
      )}

      {renderFacultyCard(
        "ФКПІ",
        "Факультет комп'ютерно-поліграфічної інженерії",
        "вул. Під Голоском, 19, ауд. 219",
        "(032) 242 23 76",
        "fpu@uad.lviv.ua"
      )}

      {renderFacultyCard(
        "ФМКП",
        "Факультет медіакомунікацій та підприємництва",
        "вул. Під Голоском, 19, ауд. 313",
        "(032) 242 23 75",
        "feoks@uad.lviv.ua"
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingTop: 0,
  },

  facultyCard: {
    ...globalStyles.card,
    paddingVertical: 12,
    paddingHorizontal: 12,

    marginVertical: 5,
  },
})
