import { StyleSheet } from "react-native"
import { isLandscapeWeb } from "../utilities/utilities"

// const drawerMenuWidthPx = 320
const landscapeWebStyles = StyleSheet.create({
  root: {
    width: "50%",
    minWidth: "50%",
    maxWidth: "50%",

    maxHeight: "100%",

    flexGrow: 1,
    marginLeft: "33%", // free space divided by two and + drawerMenuWidthPx in % * 0.5
    // TODO: unhardcode the percentage
  },
})
const nativeStyles = StyleSheet.create({
  root: {
    width: "100%",
    flex: 1,
  },
})
export const AppStyles = isLandscapeWeb() ? landscapeWebStyles : nativeStyles
