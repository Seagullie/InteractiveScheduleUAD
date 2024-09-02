import React from "react"
import { View, Image, StyleSheet } from "react-native"
import AppText from "./shared/AppText"
import { imageIcons } from "../constants/Images"
import { FontName } from "../constants/Fonts"
import { isRunningInBrowser } from "../utilities/utilities"

type WarningBarProps = {
  text: string
}

export default function WarningBar(props: WarningBarProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.warningTriangleImage} source={imageIcons.warning_triangle} />
      <View style={{ margin: 0, padding: 0 }}>
        <AppText style={styles.warningText}>{props.text}</AppText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: isRunningInBrowser() ? "flex-start" : "center",

    width: "100%",
    backgroundColor: "#FFDD67",

    padding: 6,
    paddingLeft: 10,
  },

  warningTriangleImage: {
    width: 13,
    height: 13,
    // marginHorizontal: 10,
    marginRight: 7,
  },

  warningText: {
    fontFamily: FontName.RalewayMedium,
    alignSelf: "center",
    // textAlignVertical: "top",
    margin: 0,
    padding: 0,
    marginBottom: 2,
  },
})
