import { StyleSheet } from "react-native"

import { globalStyles } from "../../styles/global"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  newsArticleCard: {
    ...globalStyles.card,
    paddingVertical: 15,
    paddingHorizontal: 15,

    marginVertical: 5,
  },

  moreButton: {
    ...globalStyles.navigationButton,
    width: "100%",
    paddingVertical: 7,
  },
})
