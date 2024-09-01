import { StyleSheet } from "react-native"
import { palette, globalStyles } from "../../styles/global"
import { isLandscapeWeb } from "../../utilities/utilities"
import { FontName } from "../../constants/Fonts"

const documentHeight = window.innerHeight
export const swiperWidth = isLandscapeWeb() ? `${documentHeight / 2}px` : "95%"

export const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: "#F5F5F5",
    // backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 9999,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  container: {
    flex: 1,
    height: "100%",
  },

  viewPager: {
    flex: 1,
    padding: 0,
    marginHorizontal: 30,
  },
  page: {
    // height: "100%",
    flex: 1,
    alignItems: "center",
  },

  paginationCircles: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,

    width: "100%",

    // height: "10%",
  },

  circle: {
    width: 5,
    height: 5,
    margin: 5,
    borderRadius: 123,
    backgroundColor: "#D9D9D9",
    flexDirection: "row",
  },

  circleActive: {
    backgroundColor: "#7B7B7B",
  },

  pageBody: {
    marginBottom: 20,
    // flex: 1,
    // height: "100%",
  },

  overlay: {
    backgroundColor: "#F5F5F5",
    // backgroundColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flex: 1,
    zIndex: 9998,
  },

  pagerNavigation: {
    flexGrow: 0,
    // height: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignSelf: "center",
    width: swiperWidth,
  },

  pageTitle: {
    fontSize: 24,
    color: palette.navigationBackground,
    textAlign: "center",
    marginVertical: 10,
    marginTop: 20,
  },

  imageContainer: {
    borderRadius: 10,
    height: "65%",
    maxHeight: "65%",
    width: "90%",
    // backgroundColor: "green",
    overflow: "auto",

    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
  },

  previewImage: {
    borderRadius: 10,
  },

  halfImageContainer: {
    height: "30%",
  },

  navigationButton: {
    flexGrow: 0,
    flexShrink: 1,

    ...globalStyles.navigationButton,
  },

  backButton: {
    borderColor: palette.grayedOut,
  },

  forwardButton: {
    borderColor: palette.navigationBackground,
    borderWidth: 1,
  },

  centeredDescriptionText: {
    textAlign: "center",
  },

  pageDescriptionText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  selectScheduleText: {
    color: palette.navigationBackground,
    fontFamily: FontName.Montserrat600,
  },
})
