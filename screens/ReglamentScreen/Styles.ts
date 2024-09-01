import { StyleSheet } from "react-native"
import { FontName } from "../../constants/Fonts"
import { palette, globalStyles } from "../../styles/global"

// TODO: Remove unused styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "scroll",
    padding: 10,
    paddingTop: 30,
    alignItems: "center",
  },

  reglamentClassIndex: {
    fontSize: 14,
    fontFamily: FontName.Montserrat600,
    color: palette.text,

    marginLeft: 10,
    marginBottom: 7,
  },

  reglamentContainer: {
    ...globalStyles.screen,
    flex: 1,

    backgroundColor: palette.backgroundLight,
    // backgroundColor: "red",
  },

  timePointText: {
    color: palette.grayishBlue,
    fontFamily: FontName.MontserratBold,
  },

  timePointDate: {
    marginTop: 3,
    fontSize: 14,
    color: palette.text,
  },

  timeDataCard: {
    borderRadius: 7,
    backgroundColor: "white",
    margin: 0,
    padding: 10,

    elevation: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  currentClass: {
    // backgroundColor: "rgb(227, 239, 249)",
    backgroundColor: "#CCDFF1",
  },

  reglamentClassContainer: {
    marginHorizontal: 8,
    marginBottom: 18,
  },

  head: {},
  text: { margin: 0, textAlign: "center", borderBottomWidth: 1, borderRightWidth: 1, padding: 12 },
  headerText: { fontWeight: "bold", fontSize: 14 },
  headText: { margin: 6, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    // backgroundColor: "red",
    backgroundColor: "#f1f8ff",
  },
})
