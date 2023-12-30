import Aptabase, { trackEvent } from "@aptabase/react-native"
import { AptabaseAppKey } from "../../constants/Keys"

Aptabase.init(AptabaseAppKey)

export class AnalyticsService {
  static async trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
    return trackEvent(eventName, props)
  }
}
