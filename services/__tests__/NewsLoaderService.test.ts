import { EntryCollection, EntrySkeletonType } from "contentful"
import NewsLoaderService from "../NewsLoaderService"

class TestNewsLoaderService extends NewsLoaderService {
  protected static instance: TestNewsLoaderService

  static async GetInstance(): Promise<TestNewsLoaderService> {
    if (!this.instance) {
      this.instance = new this()
      await this.instance.init()

      console.log(`[${this.name}] news loader service instance constructed successfully`)
    }

    return this.instance
  }

  areNewsCached() {
    return this._newsCached.length > 0
  }

  resetCache() {
    this._newsCached = []
  }

  override fetchContentfulEntries() {
    const exampleNews = this.getExampleNews()
    // reshape into entries
    const entries: EntryCollection<EntrySkeletonType> = {
      items: exampleNews.map((news) => {
        return {
          fields: {
            title: news.title,
            body: news.body,
          },
          sys: {
            createdAt: news.createdAt,
          },
        }
      }),
    }
    return entries
  }
}

// class

describe.only("News Loader Service", () => {
  //   const newsLoaderServiceMock = jest
  //     .spyOn(TestNewsLoaderService.prototype, "getNewsFromContentful")
  //     .mockImplementation(() => {
  //       console.log("mocked function")
  //     }) // comment this line if just want to "spy"

  it("fetches news", async () => {
    const newsLoaderService = await TestNewsLoaderService.GetInstance()

    const result = await newsLoaderService.getNewsFromContentful()
    expect(result.length).toBeGreaterThan(0)

    // expect(newsLoaderServiceMock).toHaveBeenCalled()
  })

  it("caches fetched news", async () => {
    const newsLoaderService = await TestNewsLoaderService.GetInstance()
    newsLoaderService.resetCache()

    const result = await newsLoaderService.getNewsFromContentful()
    const isCached = newsLoaderService.areNewsCached()
    expect(isCached).toBe(true)
  })
})
