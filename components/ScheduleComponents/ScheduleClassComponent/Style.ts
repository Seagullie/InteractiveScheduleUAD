import { FontName } from "../../../constants/Fonts"
import { globalStyles, palette } from "../../../styles/global"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  ongoingClass: {
    // backgroundColor: "rgba(28, 93, 143, 0.1)",
    backgroundColor: "rgb(227, 239, 249)",
  },

  classContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },

  startAndEndTimesContainer: {
    alignItems: "flex-start",
    width: "10%",
    marginRight: "4%",
  },

  separator: {
    ...globalStyles.separator,

    backgroundColor: "rgba(217, 217, 217, 0.4)",
  },

  text: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
  },

  classStartText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    alignSelf: "center",
  },

  classEndText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    alignSelf: "center",
  },

  classNameText: {
    fontFamily: FontName.MontserratMedium,
    color: palette.text,
    alignSelf: "flex-start",
    textAlign: "left",
    flexGrow: 0.5,
  },

  teacherNameText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.grayedOut,
  },

  roomNumberText: {
    fontFamily: FontName.MontserratRegular,
    color: palette.text,
    textAlign: "right",
  },

  classTypeAndRoomNumberContainer: {
    width: "12%",
  },

  roomNumberContainer: {
    // flexGrow: 0.12,
    alignItems: "flex-end",
    textAlign: "right",
  },

  classAndTeacherBlock: {
    // width: "74%",
    flexBasis: "74%",
    flexGrow: 1,
    // flexGrow: 0.74,
    // flexGrow: 1,
    alignItems: "flex-start",
    textAlign: "left",
  },
})
