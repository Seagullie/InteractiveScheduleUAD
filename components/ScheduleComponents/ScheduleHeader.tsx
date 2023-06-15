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
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContentContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity>
            <MaterialIcons
              onPress={() => navigation_.openDrawer()}
              name="menu"
              size={24}
              style={globalStyles.navIcon}
            />
          </TouchableOpacity>

          <Text style={styles.headerText}>{headerText}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={[{ flexDirection: "row", alignItems: "center", marginRight: 12 }]}>
            <View
              style={[
                styles.weekTextContainer,
                weekTypeInUkrainian == "Чисельник" ? styles.selectedContainer : {},
                { marginRight: 5 },
              ]}
            >
              <Text
                style={[styles.weekTypeText, weekTypeInUkrainian == "Чисельник" ? styles.selectedText : {}]}
                onPress={() => {
                  onWeekTypeChanged(0)
                  setWeekType(0)
                }}
              >
                Чис
              </Text>
            </View>

            <View
              style={[styles.weekTextContainer, weekTypeInUkrainian == "Знаменник" ? styles.selectedContainer : {}]}
            >
              <Text
                onPress={() => {
                  // debugger
                  onWeekTypeChanged(1)
                  setWeekType(1)
                }}
                style={[styles.weekTypeText, weekTypeInUkrainian == "Знаменник" ? styles.selectedText : {}]}
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

const styles = StyleSheet.create({
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
    // marginHorizontal: 16,
  },

  weekTextContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
  },

  selectedContainer: {
    // fontWeight: "bold",
    // fontSize: 17,
    // marginHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "white",
  },

  selectedText: {
    color: palette.navigationBackground,
  },
})
