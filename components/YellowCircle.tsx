import React from "react"
import { View } from "react-native"
import { palette } from "../styles/global"

export function YellowCircle({ filled = true }: { filled?: boolean }) {
  return (
    <View
      style={{
        marginLeft: 10,
        marginTop: 5,

        alignSelf: "flex-start",

        width: 5,
        height: 5,
        borderRadius: 10,
        backgroundColor: filled ? "#FFE600" : "transparent",
        borderWidth: 1,
        borderColor: !filled ? palette.grayedOut : "transparent",
      }}
    />
  )
}
