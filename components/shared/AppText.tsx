import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { TextProps } from "react-native-elements"
import { palette } from "../../styles/global"

// export default class AppText extends Text {

//     render(){
//         return <Text style={[styles.appText, this.props.style]}>{this.props.children}</Text>
//     }

// }

export default function AppText(props: TextProps) {
  return (
    <Text android_hyphenationFrequency="full" {...props} style={[styles.appText, props.style]}>
      {props.children}
    </Text>
  )
}

// AppText.propTypes = {
//   ...Text.propTypes,
//   // add any additional propTypes here
// }

const styles = StyleSheet.create({
  appText: {
    fontFamily: "montserrat-medium",
    fontSize: 12,
    // letterSpacing: -0.5,
    color: palette.text,
  },
})
