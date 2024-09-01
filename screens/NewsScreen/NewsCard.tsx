import React, { useState } from "react"

import { Linking, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import AppText from "../../components/shared/AppText"
import { FontName } from "../../constants/Fonts"
import { globalStyles, palette } from "../../styles/global"
import { truncateText } from "../../utilities/utilities"
import { styles } from "./Styles"
import { CustomAutolink } from "../../components/shared/ExtendedAutoLink"

export function NewsCard({ date, title, body }: { date: string; title: string; body: string }) {
  // convert date into day/month/year format
  let dateObj = new Date(date)
  let day = dateObj.getDate()
  let month = dateObj.getMonth() + 1
  let year = dateObj.getFullYear()
  date = `${day}.${month}.${year}`

  let [isBodyExpanded, setIsBodyExpanded] = useState(false)
  let bodyStateAdjustedText = isBodyExpanded ? body : truncateText(body, 280)

  let shouldShowLengthControlButton = body.length > 280
  const lengthControlButton = (
    <TouchableOpacity onPress={() => setIsBodyExpanded(!isBodyExpanded)} style={styles.moreButton}>
      <AppText style={{ fontFamily: FontName.MontserratSemiBold, color: palette.navigationBackground }}>
        {!isBodyExpanded ? "Детальніше" : "Згорнути"}
      </AppText>
    </TouchableOpacity>
  )

  return (
    <View style={{ marginBottom: 15 }}>
      <AppText style={{ alignSelf: "center" }}>{date}</AppText>
      <View style={styles.newsArticleCard}>
        <AppText style={{ fontFamily: FontName.MontserratBold, fontSize: 14 }}>{title}</AppText>
        <AppText style={{ marginVertical: 15, fontFamily: FontName.MontserratRegular }}>
          {
            <CustomAutolink
              onPress={(url) => Linking.openURL(url)}
              text={bodyStateAdjustedText}
              linkStyle={{ color: palette.navigationBackground }}
            />
          }
          {
            // " [Детальніше](https://www.instagram.com/ntu_kpi/) "
          }
        </AppText>

        {shouldShowLengthControlButton ? lengthControlButton : <View style={globalStyles.invisible} />}
      </View>
    </View>
  )
}
