import React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import AppText from "../shared/AppText"
import { editorImages } from "../../constants/Images"
import { SDstyles } from "../ScheduleComponents/ScheduleDay"

export default function EditActionsExplanatoryCard() {
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
        <View
          style={[
            {
              marginRight: 5,
            },
          ]}
        >
          <Image source={editorImages.lightbulb} style={{ height: 50, width: 50 }} />
        </View>
        <View>
          {/* TODO: bolden the action words */}
          <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
            Перемістити: затиснути та перетягнути
          </AppText>

          <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
            Видалити: свайп ліворуч
          </AppText>

          <AppText style={{ fontFamily: "century-gothic", fontSize: 13, letterSpacing: 0.1 }}>
            Редагувати: натиснути на пару
          </AppText>
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
  },
})
