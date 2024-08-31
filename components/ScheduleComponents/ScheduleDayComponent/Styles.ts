import { StyleSheet } from "react-native"

import { FontName } from "../../../constants/Fonts"
import { palette, globalStyles } from "../../../styles/global"

export const SDstyles = StyleSheet.create({
  noClassesText: {
    fontSize: 14,
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "center",

    fontFamily: FontName.Montserrat600,

    color: palette.grayedOut,
  },

  fadedDayContainerView: {
    opacity: 0.5,
  },

  dayNameHeader: {
    fontFamily: FontName.Montserrat600,
    fontSize: 14,
    ...globalStyles.sectionHeader,
    color: palette.text,
  },

  scheduleDayCard: {
    marginTop: 5,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: "white",

    paddingVertical: 2,
    paddingHorizontal: 5,

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
})
