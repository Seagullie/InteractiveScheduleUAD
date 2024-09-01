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

  timePointTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    // flexGrow: 0.9,
    width: "77%",
  },

  timePointText: {
    // color: palette.grayishBlue,
    color: "#333333",
    fontFamily: FontName.MontserratMedium,
    fontSize: 16,
  },

  indexTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    // flexGrow: 0.1,
    width: "12%",
  },

  indexText: {
    color: palette.grayishBlue,
    fontFamily: FontName.MontserratSemiBold,
    fontSize: 20,
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
    // backgroundColor: "#CCDFF1",
    // backgroundColor: "#E5EFF8",
    backgroundColor: "#D8E9F9",
  },

  currentClassIndexText: {
    color: "#4A6172",
  },

  reglamentClassContainer: {
    marginHorizontal: 8,
    // marginBottom: 18,
    marginBottom: 10,
  },

  text: { margin: 0, textAlign: "center", borderBottomWidth: 1, borderRightWidth: 1, padding: 12 },

  head: {},
  headerText: { fontWeight: "bold", fontSize: 14 },
  headText: { margin: 6, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    // backgroundColor: "red",
    backgroundColor: "#f1f8ff",
  },

  verticalSeparator: {
    width: 1,
    height: "100%",
    backgroundColor: "#E6E6E6",
    // opacity: 0.5,
    marginHorizontal: 10,
    flexGrow: 0,
  },
})
