import { StyleSheet } from "react-native"

import { FontName } from "../../constants/Fonts"
import { globalStyles, palette } from "../../styles/global"

export const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // not gonna work cause it's transparent
  },

  horizontalFlex: {
    ...globalStyles.horizontalCenteredFlex,
  },

  searchBarContainer: {
    marginLeft: -4,
    marginVertical: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 7,
    padding: 5,
    paddingVertical: 2,
  },

  searchBar: {
    ...globalStyles.searchBar,
  },

  modalContentContainer: {
    ...globalStyles.modalContentContainer,
    // top: "5%",
  },

  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  option: {
    fontFamily: FontName.Montserrat500,
    color: palette.text,
    width: "100%",
    marginVertical: 10,
  },

  selectedOption: {
    fontFamily: FontName.Montserrat600,
  },

  separator: {
    height: 1, // haha
    width: "100%",
    marginVertical: 6,
    backgroundColor: "#E6E6E6",
  },

  header: {
    fontFamily: FontName.MontserratBold,
    fontSize: 20,
    marginBottom: 10,
    color: palette.text,
  },

  closeButton: {
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

  closeButtonText: {
    fontFamily: FontName.Montserrat600,
    color: palette.grayedOut,
    fontSize: 16,
  },

  checkIcon: {
    position: "absolute",
    right: 0,
  },
})
