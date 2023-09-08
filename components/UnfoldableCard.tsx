import { useState } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import AppText from "../shared/AppText"
import { globalStyles, palette } from "../styles/global"

export default function UnfoldableCard({ title, bodyComponent }: { title: string; bodyComponent: JSX.Element }) {
  let [isBodyRevealed, setIsBodyRevealed] = useState(false)

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={UCStyles.unfoldableCard}>
        {/* title | question */}

        <View style={[globalStyles.horizontalCenteredFlex]}>
          <AppText style={{ fontFamily: "raleway-medium", fontSize: 15, flex: 1, lineHeight: 20 }}>{title}</AppText>

          {/* reveal button */}
          <TouchableOpacity onPress={() => setIsBodyRevealed(!isBodyRevealed)} style={UCStyles.revealButton}>
            <AppText style={{ fontFamily: "century-gothic", color: palette.textOnBackground, fontSize: 36 }}>
              {!isBodyRevealed ? "+" : "-"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* answer */}

        {isBodyRevealed ? bodyComponent : <></>}
      </View>
    </View>
  )
}

export const UCStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.backgroundLight,
    padding: 10,
    paddingTop: 16,
  },

  unfoldableCard: {
    ...globalStyles.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  unfoldableCardText: {
    marginVertical: 15,
    fontFamily: "raleway-regular",
    fontSize: 14,
    lineHeight: 1.3 * 14,
  },

  revealButton: {
    ...globalStyles.navigationButton,
    width: 30,
    borderColor: "transparent", // TODO: create separate reveal button instead of transforming navigation button to desired shape
    paddingVertical: 0,
  },
})
