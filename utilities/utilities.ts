import moment from "moment"

import constants, { ExecutionEnvironment } from "expo-constants"

// @ts-ignore
import contentful from "contentful/dist/contentful.browser.min.js"
// @ts-ignore
import { createClient } from "contentful/dist/contentful.browser.min.js"
import { ContentfulClientApi } from "contentful"
import { Platform } from "react-native"

import { ContentfulContentDeliveryAccessToken, ContentfulSpace } from "../constants/Keys"

import { REGLAMENT_DATA_ELEM_TYPE, REGLAMENT_DATA } from "../constants/Constants"

/**
 * Calculates the difference between two dates in hours, minutes and seconds.
 */
export const GetTimeDifference = (earlier: Date, later: Date) => {
  let momentA = moment(earlier)
  let momentB = moment(later)
  let hourDifference = momentB.diff(momentA, "hours") as number
  let minuteDifference = momentB.diff(momentA, "minutes") - hourDifference * 60
  let secondDifference = momentB.diff(momentA, "seconds") - hourDifference * 60 * 60 - minuteDifference * 60

  return {
    hours: hourDifference,
    minutes: minuteDifference,
    seconds: secondDifference,
  }
}

/**
 * Creates a sequence of dates, starting from the given date and spaced by the given amount of seconds.
 */
export function createEvenlySpacedTimeSequence(sequenceSize: number, spacingInSeconds: number, start: Date): Date[] {
  const sequence = []
  let next = start

  let index = 0
  while (index < sequenceSize) {
    sequence.push(next)
    next = new Date(next.getTime() + spacingInSeconds * 1000)

    index += 1
  }

  return sequence
}

export function setDayOnDate(date: Date, day: number): Date {
  const currentDay = date.getDay()
  const distance = day - currentDay
  date.setDate(date.getDate() + distance)

  return date
}

function isInRange(value: Date, start: Date, end: Date) {
  return value <= end && value >= start
}

/**
 * Gets time slot of a timepoint. In this case, each time slot represents a class start and end time.
 */
export function determineInterval(timepoint = new Date()): false | REGLAMENT_DATA_ELEM_TYPE {
  let interval: false | REGLAMENT_DATA_ELEM_TYPE = false

  REGLAMENT_DATA.forEach((class_) => {
    let hourAndMinuteStart = class_[1]
    let hourStart = hourAndMinuteStart.split(":")[0]
    let minuteStart = hourAndMinuteStart.split(":")[1]

    let hourAndMinuteEnd = class_[2]
    let hourEnd = hourAndMinuteEnd.split(":")[0]
    let minuteEnd = hourAndMinuteEnd.split(":")[1]

    let now = new Date()
    // TODO: annotate
    let earlier = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hourStart), parseInt(minuteStart))
    let later = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hourEnd), parseInt(minuteEnd))

    if (isInRange(timepoint, earlier, later)) {
      interval = class_
    }
  })

  return interval
}

console.log("[utilities] current interval is ", determineInterval())

export function getContentfulClient() {
  const client: ContentfulClientApi = createClient({
    space: ContentfulSpace,
    environment: "master", // defaults to 'master' if not set
    accessToken: ContentfulContentDeliveryAccessToken,
  })

  return client
}

/**
 * Ensures that the filename has the given extension by appending it if it doesn't.
 */
export function ensureExtension(filename: string, extension: string) {
  if (filename.endsWith(extension)) return filename

  return filename + extension
}

/**
 * Ensures that the filename doesn't have the given extension by removing it if it does.
 */
export function ensureNoExtension(filename: string, extension: string) {
  if (!filename.endsWith(extension)) return filename

  return filename.slice(0, -extension.length)
}

/**
 * Ensures that the text ends with the given ending by appending it if it doesn't.
 */
export function ensureEnding(text: string, ending: string) {
  if (text.endsWith(ending)) return text

  return text + ending
}

export const isMail = (text: string) => {
  return text.includes("@") && !text.includes("http")
}

/**
 * Returns true if the app is running in Expo Go.
 */
export function isRunningInExpoGo() {
  const _isRunningInExpo = constants.executionEnvironment == ExecutionEnvironment.StoreClient
  return _isRunningInExpo
}

export function isRunningInBrowser() {
  // const isRunningInBrowser = constants.executionEnvironment == ExecutionEnvironment.Bare

  // debugger

  const _isRunningInBrowser = Platform.OS === "web"
  return _isRunningInBrowser
}

/**
 * Returns true if the device is in horizontal orientation.
 */
export function isHorizontalOrientation() {
  if (isRunningInBrowser()) {
    return window.innerWidth > window.innerHeight
  }

  return (
    constants.platform.ios.interfaceOrientation === "landscape" ||
    constants.platform.android.interfaceOrientation === "landscape"
  )
}

export function isLandscapeWeb() {
  return isRunningInBrowser() && isHorizontalOrientation()
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..."
  } else {
    return text
  }
}
