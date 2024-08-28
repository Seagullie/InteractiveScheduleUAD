import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { globalStyles } from "../../styles/global"

export default function Separator({
  upperElement,
  lowerElement,
  color,
  width = "100%",
}: {
  upperElement: any
  lowerElement: any
  color?: string
  width?: string
}) {
  const localStyles = StyleSheet.create({
    separator: {
      ...globalStyles.separator,
      backgroundColor: color || globalStyles.separator.backgroundColor,
      width: width,
      alignSelf: "center",
    },
  })

  if (upperElement && lowerElement) {
    return <View style={localStyles.separator} />
  }

  return <View style={globalStyles.noDisplay} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
