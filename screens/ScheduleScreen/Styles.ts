import { StyleSheet } from "react-native"

import { globalStyles } from "../../styles/global"

export const styles = StyleSheet.create({
  rootContainer: {
    // width: "70%",
    // alignSelf: "center",
    // paddingBottom: 60,
    ...globalStyles.screen,

    // flex: 0,
    backgroundColor: "#F5F5F5",
  },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },

  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },

  modalContent: {
    flex: 1,
  },

  selected: {
    backgroundColor: "white",
    color: "black",
    padding: 5,
    borderRadius: 10,
    marginBottom: 5,
  },

  placeholderView: {
    height: 35,
  },
  cardContainer: {
    // height: 350,
    padding: 5,
  },

  scheduleDaySelector: {
    padding: 5,
    zIndex: 9999,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
