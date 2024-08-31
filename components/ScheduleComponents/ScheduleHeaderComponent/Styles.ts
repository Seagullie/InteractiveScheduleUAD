import { StyleSheet } from "react-native"

import { FontName } from "../../../constants/Fonts"
import { palette } from "../../../styles/global"

const baseStyles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "century-gothic",
  },
})

export const scheduleHeaderStyles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C5D8F",
  },

  backroundImage: {
    width: "100%",
  },

  headerText: {
    fontSize: 20,
    // color: "#333",
    color: "white",
    fontFamily: FontName.CenturyGothic,
  },
  sideMenuIcon: {
    color: "white",
    marginHorizontal: 16,
    marginRight: 10,
    zIndex: 8888,
  },

  headerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  currentlyViewedDay: {
    fontSize: 14,
    ...baseStyles.text,
    marginLeft: 10,
    marginHorizontal: 16,
  },

  weekTypeText: {
    fontSize: 16,
    ...baseStyles.text,
  },

  weekTextContainer: {
    paddingHorizontal: 5,
    paddingVertical: 4,
  },

  selectedContainer: {
    borderRadius: 5,
    backgroundColor: "white",
  },

  selectedText: {
    color: palette.navigationBackground,
  },
})
