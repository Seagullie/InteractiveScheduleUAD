// This is a singleton service that loads news from contenful and provides it to the rest of the application

import { getContentfulClient } from "../utilities/utilities"

export type NewsArticle = {
  title: string
  body: string
  createdAt: string
}

export default class NewsLoaderService {
  protected static instance: NewsLoaderService

  private _newsCached: NewsArticle[] = []

  static async GetInstance(): Promise<NewsLoaderService> {
    if (!this.instance) {
      this.instance = new this()
      await this.instance.init()

      console.log(`[${this.name}] news loader service instance constructed successfully`)
    }

    return this.instance
  }

  protected constructor() {}

  protected async init() {}

  async getNewsFromContentful(): Promise<NewsArticle[]> {
    // retrieve schedules from contentful
    console.log(`[News Loader] retrieving news from contentful`)

    if (this._newsCached.length > 0) {
      console.log(`[News Loader] returning cached news`)
      return this._newsCached
    }

    const client = getContentfulClient()

    const content_type = "newsArticle"
    const entries = await client.getEntries({
      content_type,
    })

    let news = entries.items.map((entry) => {
      const {
        title,
        body,
      }: {
        title: string
        body: string
      } = entry.fields
      const createdAt = entry.sys.createdAt
      return {
        title,
        body,
        createdAt,
      }
    })

    // sort news by date
    news = news.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    console.log(`[News Loader] entries: ${JSON.stringify(news)}`)

    this._newsCached = news
    return news
  }

  getExampleNews(): NewsArticle[] {
    return [
      {
        title: "Новина 1",
        body: "Текст новини 1",
        createdAt: "2021-06-01T00:00:00.000Z",
      },
      {
        title: "Новина 2",
        body: "Текст новини 2",
        createdAt: "2022-06-02T00:00:00.000Z",
      },
      {
        title: "Новина 3",
        body: "Текст новини 3",
        createdAt: "2023-06-03T00:00:00.000Z",
      },
    ]
  }

  async getNewestArticleDate(): Promise<Date> {
    let news = await this.getNewsFromContentful()
    return new Date(news[0].createdAt)
  }
}
