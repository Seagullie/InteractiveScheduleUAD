import { init, trackEvent } from "@aptabase/web"
import { AptabaseAppKey } from "../../constants/Keys"

init(AptabaseAppKey)

export class AnalyticsService {
  static async trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
    try {
      trackEvent(eventName, props)
    } catch (e) {
      console.error("Failed to track event", e)
    }
  }
}
