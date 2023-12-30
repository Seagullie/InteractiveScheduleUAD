import React from "react"
import { StyleSheet, Text, View, Image, Pressable, ImageBackground } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { globalStyles, palette } from "../styles/global"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { FontName } from "../constants/Fonts"

export type StackHeaderProps = {
  title: string
  useSafeAreaView?: boolean
  hasBackground?: boolean
  captionStyles?: any
}

export default function StackHeader({
  title,
  useSafeAreaView = true,
  hasBackground = true,
  captionStyles = undefined,
}: StackHeaderProps) {
  const navigation = useNavigation()

  const ViewComponent = useSafeAreaView ? SafeAreaView : View

  const headerText = title
  return (
    <ViewComponent style={[styles.header, !hasBackground ? { backgroundColor: "transparent" } : {}]}>
      <View style={styles.headerTitle}>
        <TouchableOpacity>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back-outline"
            size={24}
            style={[globalStyles.navIcon, captionStyles]}
          />
        </TouchableOpacity>

        <Text style={[styles.headerText, captionStyles]}>{headerText}</Text>
      </View>
    </ViewComponent>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.navigationBackground,
  },

  headerText: {
    fontSize: 20,
    color: "white",
    fontFamily: FontName.CenturyGothic,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
})
