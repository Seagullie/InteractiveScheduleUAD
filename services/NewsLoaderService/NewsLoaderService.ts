// This is a singleton service that loads news from contenful and provides it to the rest of the application

import { EXAMPLE_NEWS } from "../../constants/ExampleData"
import { getContentfulClient } from "../../utilities/utilities"
import { NewsArticle, ContentfulNewsArticleFields } from "./Types"

export default class NewsLoaderService {
  protected static instance: NewsLoaderService

  protected _newsCached: NewsArticle[] = []

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

  /**
   * Retrieves news from Contentful. If news are already cached, returns them.
   */
  async getNewsFromContentful(): Promise<NewsArticle[]> {
    // retrieve schedules from contentful
    console.log(`[News Loader] retrieving news from contentful`)

    if (this._newsCached.length > 0) {
      console.log(`[News Loader] returning cached news`)
      return this._newsCached
    }

    const entries = await this.fetchContentfulEntries()

    let news = entries.items.map((entry) => {
      const { title, body } = entry.fields as ContentfulNewsArticleFields
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

  /**
   * Fetches raw news entries from Contentful.
   */
  async fetchContentfulEntries() {
    const client = getContentfulClient()

    const content_type = "newsArticle"
    const entries = await client.getEntries({
      content_type,
    })

    return entries
  }

  getExampleNews(): NewsArticle[] {
    return EXAMPLE_NEWS
  }

  // TODO: move to utilities
  async getNewestArticleDate(): Promise<Date> {
    let news = await this.getNewsFromContentful()
    return new Date(news[0].createdAt)
  }
}
