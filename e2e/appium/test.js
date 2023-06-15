const { remote,  } = require("webdriverio")

// TODO: unhardcode
const appPackage = "com.noid.InteractiveSchedule"
const appActivity = ".MainActivity"

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Nexus_5_API_27_480_DPI_",
  "appium:appPackage": "host.exp.exponent",
  "appium:appActivity": "host.exp.exponent.experience.HomeActivity",
  "appium:intentAction": "android.intent.action.VIEW",
  "appium:appWaitForLaunch": true,
}

const wdOpts = {
  host: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
}

async function runTest() {
  const driver = await remote({ ...wdOpts, capabilities: { ...capabilities } })
  const client = driver

  // print out session id
  const sessionId = driver.sessionId
  console.log(sessionId)

  // await client.closeApp()

  await wait.until(until.elementLocated(By.xpath(`//*[contains(@text, "${text}")]`)));

  console.log(`Element with text "${text}" appeared!`);


  // await client.startActivity(capabilities["appium:appPackage"], capabilities["appium:appActivity"]) //Reload to force update

  await client.execute("mobile:deepLink", {
    url: "exp://127.0.0.1:19000",
    package: capabilities["appium:appPackage"],
  })

  try {
    // const batteryItem = await driver.$('//*[@text="Battery"]')
    // await batteryItem.click()
  } finally {
    await driver.pause(10000 * 6)
    // await driver.deleteSession()
  }
}

runTest().catch(console.error)
