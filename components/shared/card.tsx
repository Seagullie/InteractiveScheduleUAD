import React from "react"
import { View, StyleSheet } from "react-native"

export default function Card({
  children,
  shadows = true,
  cardContentStyle = {},
}: {
  children: any
  shadows?: boolean
  cardContentStyle?: StyleSheet
}) {
  return (
    <View style={{ ...styles.card, ...(!shadows ? styles.noShadow : {}) }}>
      <View style={styles.cardContent}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    // height: "95%",
    // width: "98%",
    borderRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    overflow: "scroll",
  },

  noShadow: {
    elevation: 0,
    shadowOpacity: 0,
  },

  cardContent: {
    marginHorizontal: 5,
    marginVertical: 20,
  },
})
