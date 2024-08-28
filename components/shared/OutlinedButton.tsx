import React from "react"

import { View } from "react-native"
import { Pressable, Text } from "react-native"
import { StyleSheet } from "react-native"
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler"
import AppText from "./AppText"
import { palette } from "../../styles/global"

export default function OutlinedButton({ onPress, text }: { onPress: () => void; text: string }): JSX.Element {
  return (
    <TouchableOpacity style={{ alignItems: "flex-start" }} onPress={onPress}>
      <View style={styles.button}>
        <AppText style={styles.buttonText}>{text}</AppText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: "montserrat-600",
    color: palette.grayedOut,
    fontSize: 10,
  },

  button: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: palette.navigationBackground,
    padding: 3,
    paddingHorizontal: 6,

    borderRadius: 10,
  },
})
