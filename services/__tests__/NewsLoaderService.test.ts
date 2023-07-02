import NewsLoaderService from "../NewsLoaderService"

describe("News Loader Service", () => {
  const fetchContentfulEntriesSpy = jest.spyOn(NewsLoaderService.prototype, "fetchContentfulEntries")

  it("fetches news", async () => {
    const newsLoaderService = await NewsLoaderService.GetInstance()

    const result = await newsLoaderService.getNewsFromContentful()
    expect(result.length).toBeGreaterThan(0)

    expect(fetchContentfulEntriesSpy).toHaveBeenCalledTimes(1)
  })

  it("caches fetched news", async () => {
    const newsLoaderService = await NewsLoaderService.GetInstance()

    await newsLoaderService.getNewsFromContentful()

    // expect fetchContentfulEntries to have been called once despite two calls to getNewsFromContentful
    expect(fetchContentfulEntriesSpy).toHaveBeenCalledTimes(1)
  })
})
