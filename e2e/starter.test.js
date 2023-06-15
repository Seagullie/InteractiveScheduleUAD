describe("Example", () => {
  beforeAll(async () => {
    await device.launchApp()

    // TODO: unhardcode
    const appSlug = "interactiveschedule"
    const url = "http://192.168.137.162:8081"

    await device.openURL({
      url: `exp+${appSlug}://expo-development-client/?url=${encodeURIComponent(`${url}`)}`,
    })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it("should have welcome screen", async () => {
    await expect(element(by.id("welcome"))).toBeVisible()
  })

  it("should show hello screen after tap", async () => {
    await element(by.id("hello_button")).tap()
    await expect(element(by.text("Hello!!!"))).toBeVisible()
  })

  it("should show world screen after tap", async () => {
    await element(by.id("world_button")).tap()
    await expect(element(by.text("World!!!"))).toBeVisible()
  })
})
