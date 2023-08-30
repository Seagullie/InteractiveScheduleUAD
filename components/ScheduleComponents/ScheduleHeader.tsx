import React from "react"
import { StyleSheet, Text, View, Image, Pressable, ImageBackground } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { globalStyles, palette } from "../../styles/global"
import GetWeekType, { WeekType } from "../../utilities/getWeekType"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { ExecutionEnvironment, NativeConstants, Constants, PlatformManifest, AndroidManifest } from "expo-constants"
import constants from "expo-constants"
import { getIcon } from "../Header"
import { DrawerRoutes } from "../../routes/DrawerRoutes"

import { useRoute } from "@react-navigation/native"

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

  const icon = getIcon(navigation_, routeName)

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
                style={[scheduleHeaderStyles.weekTypeText, weekTypeInUkrainian == "Чисельник" ? scheduleHeaderStyles.selectedText : {}]}
                onPress={() => {
                  onWeekTypeChanged(0)
                  setWeekType(0)
                }}
              >
                Чис
              </Text>
            </View>

            <View
              style={[scheduleHeaderStyles.weekTextContainer, weekTypeInUkrainian == "Знаменник" ? scheduleHeaderStyles.selectedContainer : {}]}
            >
              <Text
                onPress={() => {
                  // debugger
                  onWeekTypeChanged(1)
                  setWeekType(1)
                }}
                style={[scheduleHeaderStyles.weekTypeText, weekTypeInUkrainian == "Знаменник" ? scheduleHeaderStyles.selectedText : {}]}
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
const baseStyles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "century-gothic",
  },
})

export const scheduleHeaderStyles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C5D8F",
  },

  backroundImage: {
    width: "100%",
  },

  headerText: {
    fontSize: 20,
    color: "#333",
    color: "white",
    fontFamily: "century-gothic",
  },
  sideMenuIcon: {
    color: "white",
    marginHorizontal: 16,
    marginRight: 10,
    zIndex: 8888,
  },

  headerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  currentlyViewedDay: {
    fontSize: 14,
    ...baseStyles.text,
    marginLeft: 10,
    marginHorizontal: 16,
  },

  weekTypeText: {
    fontSize: 16,
    ...baseStyles.text,
  },

  weekTextContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
  },

  selectedContainer: {
    borderRadius: 5,
    backgroundColor: "white",
  },

  selectedText: {
    color: palette.navigationBackground,
  },
})
