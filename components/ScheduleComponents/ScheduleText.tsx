import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { TextProps } from "react-native-elements"
import { palette } from "../../styles/global"
import AppText from "../../shared/AppText"
import { FontName } from "../../constants/Fonts"

export default function ScheduleText(props: TextProps) {
  return (
    //     backgroundColor: "rgb(227, 239, 249)",

    <AppText
      // selectionColor={"rgb(227, 239, 249)"}
      // selectable={true}
      android_hyphenationFrequency="full"
      {...props}
      style={[styles.appText, props.style]}
    >
      {props.children}
    </AppText>
  )
}

const styles = StyleSheet.create({
  appText: {
    fontFamily: FontName.MontserratMedium,
    fontSize: 12,
    letterSpacing: -0.5,
    color: palette.text,
  },
})
