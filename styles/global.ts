import { StyleSheet } from "react-native"
import { isLandscapeWeb, isRunningInBrowser } from "../utilities/utilities"

export const previewImages = {
  schedule: require("../assets/images/previews/schedule-preview.png"),
  scheduleCropped: require("../assets/images/previews/schedule-view-cropped-preview-3.png"),
  reglamentPreview: require("../assets/images/previews/reglament-preview.png"),
  settingsPreview: require("../assets/images/previews/settings-preview.png"),
  editorPreview: require("../assets/images/previews/editor-preview.png"),
}

export const previewImagesFull = {
  schedule: require("../assets/images/previews/previews-full/schedule-view-highlight.png"),
  reglamentPreview: require("../assets/images/previews/previews-full/reglament.png"),
  editorPreview: require("../assets/images/previews/previews-full/editor-view-preview.png"),
  settingsPreview: require("../assets/images/previews/previews-full/settings.png"),
}

export const images = {
  uad_logo_text: require("../assets/images/uad_logo_text.svg"),
  uad_logo_text_not_vector: require("../assets/images/uad_logo_text_not_vector.png"),
  uad_logo_text_not_vector_hires: require("../assets/images/uad_logo_text_not_vector_hires.png"),
}

export const teamMemberImages = {
  senchyk_andrii: require("../assets/images/team/senchyk_andrii.png"),
  zakharova_zarina: require("../assets/images/team/zakharova_zarina.png"),
  shepita_julia: require("../assets/images/team/shepita_julia.png"),
  ivanov_mykhailo: require("../assets/images/team/ivanov_mykhailo.png"),
}

export const editorImages = {
  lightbulb: require("../assets/images/editor/lightbulb-nontrasparent-fixed.png"),
}

export const drawerMenuImages = {
  uad_logo_white_outline: require("../assets/images/uad-logo-white-outline.png"),
}

export const imageIcons = {
  museum: require("../assets/image_icons/museum.png"),
  tiktok: require("../assets/image_icons/tiktok.png"),
}

export const palette = {
  background: "#E6E6E6",
  backgroundLight: "#F5F5F5",
  textOnBackground: "#5A5A5A",
  navigationBackground: "#1C5D8F",
  text: "#525252",
  numbers: "#888888",
  grayedOut: "#888888",
  grayishBlue: "#4A6172",
  ongoingClass: "rgb(227, 239, 249)",
}

export const globalStyles = StyleSheet.create({
  container: {
    padding: 20,
  },

  scrollView: {
    marginBottom: 80, // to make sure last item is visible.
    // there is other way to do that: via flex
  },

  screen: {
    flex: 1,
    // backgroundColor: "#E6E6E6",
    backgroundColor: palette.backgroundLight,
    padding: 0, // I don't know what's a sensible value for this. Will figure out later
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontFamily: "cinzel-regular",
    fontSize: 18,
  },

  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },

  sectionHeader: {
    marginLeft: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },

  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },

  navIcon: {
    color: "white",
    paddingHorizontal: 16,
    paddingRight: 10,
  },

  separator: {
    height: 1, // haha
    width: "100%",
    backgroundColor: "#E6E6E6",
  },

  noDisplay: {
    display: "none",
    margin: 0,
    padding: 0,
    width: 0,
    height: 0,
    zIndex: -1,
  },

  invisible: {
    opacity: 0,
  },

  row: {
    flexDirection: "row",
  },

  grayIcon: {
    color: "rgba(136,136,136,1)",
    fontSize: 26,
  },

  card: {
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

  link: {
    color: palette.navigationBackground,
  },

  underlinedLink: {
    color: palette.navigationBackground,
    textDecorationLine: "underline",
  },

  captionWithIcon: {
    marginLeft: -3,
    flexDirection: "row",
    alignItems: "center",
  },

  navigationButton: {
    borderColor: palette.navigationBackground,
    borderWidth: 1,

    // paddingHorizontal: 15,
    paddingVertical: 5,

    borderRadius: 10,

    width: 75,

    justifyContent: "center",
    alignItems: "center",
  },

  modalContentContainer: {
    position: "absolute",
    top: "10%",

    margin: 30,
    marginHorizontal: isLandscapeWeb() ? "35%" : "2%", // 27 + 8 for sidebar
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: isLandscapeWeb() ? "45%" : "95%",
  },
})
