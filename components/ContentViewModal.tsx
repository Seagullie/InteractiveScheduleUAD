import React from "react"
import { View, Text, StyleSheet } from "react-native"
import AppText from "../shared/AppText"
import { Modal } from "react-native"
import { Pressable } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

// TODO: Add types to props

export default function ContentViewModal(props) {
  return (
    <Modal animationType="fade" transparent={true} style={styles.modal} visible={props.visible}>
      <Pressable onPress={() => props.closeModal()} style={styles.overlay}></Pressable>

      <View style={styles.modalContentContainer}>
        <ScrollView style={styles.modalChildren}>{props.children}</ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // not gonna work cause it's transparent
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  modalContentContainer: {
    position: "absolute",
    top: "10%",
    // bottom: "15%",
    margin: 30,
    marginHorizontal: "2%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    width: "95%",
  },

  modalChildren: {
    height: "100%",
  },
})
