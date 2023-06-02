import React from "react"
import { View, Text, StyleSheet } from "react-native"

export default function FunctionalComponentTemplate() {
  return (
    <View style={styles.container}>
      <Text>Template</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
