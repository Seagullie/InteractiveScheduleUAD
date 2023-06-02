import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { globalStyles } from "../styles/global"
import { TouchableOpacity } from "react-native-gesture-handler"

function BaseHeader({ title, navigation }) {
  // extract current screen name from navigation state
  const headerText = title
  return (
    <View style={styles.headerContentContainer}>
      <TouchableOpacity>
        <MaterialIcons onPress={() => navigation.openDrawer()} name="menu" size={24} style={globalStyles.navIcon} />
      </TouchableOpacity>

      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  )
}

export default function GlobalHeader({
  title,
  navigation,
  headerContent: headerContentElement,
}: {
  title: string
  navigation: any
  headerContent?: React.ReactNode
}) {
  return (
    <SafeAreaView style={styles.header}>
      {headerContentElement ? headerContentElement : <BaseHeader title={title} navigation={navigation} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C5D8F",
  },

  headerText: {
    fontSize: 20,
    color: "white",
    fontFamily: "century-gothic",
  },

  headerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
})
