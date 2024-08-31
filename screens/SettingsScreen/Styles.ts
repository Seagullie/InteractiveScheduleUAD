import { StyleSheet } from "react-native"

import { FontName } from "../../constants/Fonts"
import { palette, globalStyles } from "../../styles/global"

export const styles = StyleSheet.create({
  scrollViewContentContainer: {
    // backgroundColor: "green",
  },

  loadingIndicatorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,

    width: "100%",
    height: "100%",
    backgroundColor: palette.background,

    zIndex: 9999,
  },

  scrollViewDirect: {
    ...globalStyles.screen,
    paddingBottom: 24,
  },

  pageBackground: {
    // minHeight: "100%",
  },

  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginLeft: 24,
  },
  settingsSectionName: {
    fontFamily: FontName.Raleway600,
    color: "rgba(90,90,90,1)",
    fontSize: 14,

    marginLeft: 6,
  },

  settingsCategory: {
    padding: 10,
    paddingBottom: 5,
    margin: 11,

    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 9,
  },

  separator: {
    width: "100%",
    height: 1,
    borderWidth: 0,
    borderTopWidth: 1,
    borderColor: "rgba(242,242,242,1)",
  },

  centeredTextAndIcon: {
    flexDirection: "row",
    alignItems: "center",
  },

  settingName: {
    fontFamily: FontName.Raleway500,
    color: "rgba(82,82,82,1)",
    fontSize: 15,
  },
  settingValue: {
    fontFamily: FontName.MontserratMedium,
    color: "rgba(136,136,136,1)",
    height: 17,
    textAlign: "right",
    fontSize: 12,
  },
  grayIcon: {
    ...globalStyles.grayIcon,
  },

  settingsSectionIcon: {
    color: "rgba(90,90,90,1)",
    fontSize: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginVertical: 10,
  },
})
