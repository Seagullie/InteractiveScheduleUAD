import React from "react"

import { View } from "react-native"
import { StyleSheet } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import AppText from "./AppText"
import { palette } from "../../styles/global"

export default function FlatButton({ onPress, text, color }: { onPress: () => void; text: string; color?: string }) {
  return (
    <TouchableOpacity style={{ alignItems: "flex-start" }} onPress={onPress}>
      <View style={styles.button}>
        <AppText style={styles.closeButtonText}>{text}</AppText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  closeButtonText: {
    fontFamily: "montserrat-600",
    color: palette.grayedOut,
    fontSize: 16,
  },

  button: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    padding: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    // borderRadius: 10,

    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 0.2,
    shadowOpacity: 0.0,
    shadowRadius: 0,
    borderRadius: 10,
  },
})
