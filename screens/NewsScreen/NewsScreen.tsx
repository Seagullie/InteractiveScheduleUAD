import React, { useEffect, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import _ from "lodash"
import NewsLoaderService from "../../services/NewsLoaderService/NewsLoaderService"
import { NewsArticle } from "../../services/NewsLoaderService/Types"
import { styles } from "./Styles"
import { NewsCard } from "./NewsCard"

export default function NewsScreen() {
  const [news, setNews] = useState<NewsArticle[]>([
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

  // mount effect
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
