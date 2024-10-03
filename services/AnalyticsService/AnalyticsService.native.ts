import Aptabase, { trackEvent } from "@aptabase/react-native"
import { AptabaseAppKey } from "../../constants/Keys"

import appJson from "../../app.json"

Aptabase.init(AptabaseAppKey)

export class AnalyticsService {
  static async trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
    const appVersion = appJson.expo.version

    // add isNative and version to the props
    props = {
      ...(props ?? {}),
      platform: "native",
      version: appVersion,
    }

    try {
      return trackEvent(eventName, props)
    } catch (e) {
      console.error("Failed to track event", e)
    }
  }
}
