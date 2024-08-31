import { StyleSheet } from "react-native"

import { FontName } from "../../constants/Fonts"

export const styles = StyleSheet.create({
  pageLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pageLink: {
    fontSize: 18,
    marginLeft: 10,
    color: "white",
    fontFamily: FontName.CenturyGothic,
  },

  drawerContainer: {
    flex: 1,
    justifyContent: "space-between",

    backgroundColor: "#1C5D8F",
    paddingTop: 35,
    paddingBottom: 25,
  },

  drawerContainerBottom: {},

  activePageLink: {
    // backgroundColor: "lightblue",
    backgroundColor: "rgba(37, 150, 190, 0.7)",
    // opacity: 0.5,
  },

  drawerContainerHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 25,
    paddingBottom: 15,

    paddingHorizontal: 20,

    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
  },
})
