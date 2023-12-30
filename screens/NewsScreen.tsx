import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import AppText from "../shared/AppText"
import { globalStyles, palette } from "../styles/global"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import _ from "lodash"
import NewsLoaderService, { NewsArticle } from "../services/NewsLoaderService"
import { truncateText } from "../utilities/utilities"
import { FontName } from "../constants/Fonts"

function NewsCard({ date, title, body }: { date: string; title: string; body: string }) {
  // convert date into day/month/year format
  let dateObj = new Date(date)
  let day = dateObj.getDate()
  let month = dateObj.getMonth() + 1
  let year = dateObj.getFullYear()
  date = `${day}.${month}.${year}`

  let [isBodyExpanded, setIsBodyExpanded] = useState(false)

  return (
    <View style={{ marginBottom: 15 }}>
      <AppText style={{ alignSelf: "center" }}>{date}</AppText>
      <View style={styles.newsArticleCard}>
        <AppText style={{ fontFamily: FontName.MontserratBold, fontSize: 14 }}>{title}</AppText>
        <AppText style={{ marginVertical: 15, fontFamily: FontName.MontserratRegular }}>
          {isBodyExpanded ? body : truncateText(body, 280)}
        </AppText>
        <TouchableOpacity onPress={() => setIsBodyExpanded(!isBodyExpanded)} style={styles.moreButton}>
          <AppText style={{ fontFamily: FontName.MontserratSemiBold, color: palette.navigationBackground }}>
            {!isBodyExpanded ? "Детальніше" : "Згорнути"}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function NewsScreen() {
  let [news, setNews] = useState<NewsArticle[]>([
    //     {
    //       //   createdAt: "14.04.2023",
    //       createdAt: new Date().toDateString(),
    //       title: "Новий випуск журналу “Студентський MOOD”",
    //       body: `Привітики друзі! Прийшла весна і вже починає радувати нас сонечком та зеленню 🌷
    // Сьогодні ж замість сонця - наш "Студентський MOOD"!
    // Підготували вам тексти про відпочинок, війну та інше)
    // Читайте, піклуйтеся про себе і близьких, і хай весна принесе всім нам лише хороші новини! 🌱`.repeat(2),
    //     },
  ])

  useEffect(() => {
    async function onMount() {
      const newsLoaderService = await NewsLoaderService.GetInstance()
      let fetchedNews
      try {
        fetchedNews = await newsLoaderService.getNewsFromContentful()
      } catch (e) {
        fetchedNews = newsLoaderService.getExampleNews()
      }

      setNews([...news, ...fetchedNews])
    }

    onMount()
  }, [])

  return (
    <FlatList
      data={news}
      renderItem={({ item }) => <NewsCard date={item.createdAt} title={item.title} body={item.body} />}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
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
