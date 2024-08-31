// EXTERNAL DEPENDENCIES

import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { useRoute } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"

// INTERNAL DEPENDENCIES

import GetWeekType, { WeekType } from "../../../utilities/getWeekType"
import { getRouteIcon } from "../../Header"
import { scheduleHeaderStyles } from "./Styles"

// TODO: Dry up. I simply copypasted this code from Header.tsx
// TODO: Display activity indicator during changing week type
export default function ScheduleHeader({
  title,
  onWeekTypeChanged,
}: {
  title: string
  onWeekTypeChanged: (weekType: WeekType) => void
}) {
  const navigation_ = useNavigation()

  const [weekType, setWeekType] = React.useState<WeekType>(GetWeekType())
  const weekTypeInUkrainian = weekType === WeekType.Nominator ? "Чисельник" : "Знаменник"
  console.log("[Schedule Header] weekType: ", weekType)
  console.log("[Schedule Header] weekType in Ukrainian: ", weekTypeInUkrainian)

  // extract current screen name from navigation state
  const headerText = title.split(".")[0]

  const routeName = useRoute().name
  console.log("[Schedule Header] routeName: ", routeName)

  const icon = getRouteIcon(navigation_, routeName)

  return (
    <SafeAreaView style={scheduleHeaderStyles.header}>
      <View style={scheduleHeaderStyles.headerContentContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity>{icon}</TouchableOpacity>

          <Text style={scheduleHeaderStyles.headerText}>{headerText}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[{ flexDirection: "row", alignItems: "center", marginRight: 12 }]}>
            <View
              style={[
                scheduleHeaderStyles.weekTextContainer,
                weekTypeInUkrainian == "Чисельник" ? scheduleHeaderStyles.selectedContainer : {},
                { marginRight: 5 },
              ]}
            >
              <Text
                style={[
                  scheduleHeaderStyles.weekTypeText,
                  weekTypeInUkrainian == "Чисельник" ? scheduleHeaderStyles.selectedText : {},
                ]}
                onPress={() => {
                  onWeekTypeChanged(0)
                  setWeekType(0)
                }}
              >
                Чис
              </Text>
            </View>

            <View
              style={[
                scheduleHeaderStyles.weekTextContainer,
                weekTypeInUkrainian == "Знаменник" ? scheduleHeaderStyles.selectedContainer : {},
              ]}
            >
              <Text
                onPress={() => {
                  // debugger
                  onWeekTypeChanged(1)
                  setWeekType(1)
                }}
                style={[
                  scheduleHeaderStyles.weekTypeText,
                  weekTypeInUkrainian == "Знаменник" ? scheduleHeaderStyles.selectedText : {},
                ]}
              >
                Знам
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
