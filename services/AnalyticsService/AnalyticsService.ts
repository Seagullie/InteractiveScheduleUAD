import { init, trackEvent } from "@aptabase/web"
import { AptabaseAppKey } from "../../constants/Keys"
import appJson from "../../app.json"

init(AptabaseAppKey)

export class AnalyticsService {
  static async trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
    const appVersion = appJson.expo.version

    // add isNative and version to the props
    props = {
      ...(props ?? {}),
      platform: "web",
      version: appVersion,
    }

    try {
      trackEvent(eventName, props)
    } catch (e) {
      console.error("Failed to track event", e)
    }
  }
}
