import { useState } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import React from "react"

import AppText from "./shared/AppText"
import { globalStyles, palette } from "../styles/global"
import { FontName } from "../constants/Fonts"

export default function UnfoldableCard({ title, bodyComponent }: { title: string; bodyComponent: React.JSX.Element }) {
  const [isBodyRevealed, setIsBodyRevealed] = useState(false)

  return (
    <TouchableOpacity
      style={{ marginBottom: 12 }}
      onPress={() => setIsBodyRevealed(!isBodyRevealed)}
      // avoid opacity animation when body is revealed (needed for distraction-free scrolling through long content)
      activeOpacity={isBodyRevealed ? 1 : 0.2}
    >
      <View style={UCStyles.unfoldableCard}>
        {/* title | question */}

        <View style={[globalStyles.horizontalCenteredFlex]}>
          <AppText style={{ fontFamily: FontName.RalewayMedium, fontSize: 15, flex: 1, lineHeight: 20 }}>
            {title}
          </AppText>

          {/* reveal button */}
          <TouchableOpacity onPress={() => setIsBodyRevealed(!isBodyRevealed)} style={UCStyles.revealButton}>
            <AppText style={{ fontFamily: FontName.CenturyGothic, color: palette.textOnBackground, fontSize: 36 }}>
              {!isBodyRevealed ? "+" : "-"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* answer */}

        {isBodyRevealed ? bodyComponent : <></>}
      </View>
    </TouchableOpacity>
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
    fontFamily: FontName.RalewayRegular,
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
