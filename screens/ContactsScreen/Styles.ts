import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  },

  screenBodyContainer: {
    flex: 1,
    flexGrow: 1,
    // both properties are necessary for the content to scroll and be displayed correctly on android and web
  },

  category: {
    marginVertical: 10,
  },

  navigateToSubcategoryButton: {},

  subcategoryButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  categoryTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 14,
    marginBottom: 5,
  },

  subcategoryTitle: {
    fontSize: 15,
  },

  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
})
