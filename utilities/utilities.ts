import moment from "moment"
import { REGLAMENT_DATA_ELEM_TYPE, REGLAMENT_DATA } from "../constants/Constants"

import { createClient } from "contentful/dist/contentful.browser.min.js"
import { ContentfulClientApi } from "contentful"
import { ContentfulContentDeliveryAccessToken, ContentfulSpace } from "../constants/Keys"

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

export function createEvenlySpacedTimeSequence(sequenceSize: number, spacingInSeconds: number, start: Date): Date[] {
  const sequence = []
  let next = start

  let index = 0
  while (index < sequenceSize) {
    sequence.push(next)
    next = new Date(next.getTime() + spacingInSeconds * 1000)

    index += 1
  }

  // TODO: move to tests
  if (sequence.length !== sequenceSize) throw new Error("Sequence size is not equal to the expected size")

  return sequence
}

export function setDayOnDate(date: Date, day: number): Date {
  const currentDay = date.getDay()
  const distance = day - currentDay
  date.setDate(date.getDate() + distance)

  return date
}

function liesInRange(value: Date, start: Date, end: Date) {
  return value <= end && value >= start
}

export function determineInterval(): false | REGLAMENT_DATA_ELEM_TYPE {
  let interval: false | REGLAMENT_DATA_ELEM_TYPE = false

  REGLAMENT_DATA.forEach((class_) => {
    let hourAndMinuteStart = class_[1]
    let hourStart = hourAndMinuteStart.split(":")[0]
    let minuteStart = hourAndMinuteStart.split(":")[1]

    let hourAndMinuteEnd = class_[2]
    let hourEnd = hourAndMinuteEnd.split(":")[0]
    let minuteEnd = hourAndMinuteEnd.split(":")[1]

    let now = new Date()
    let timepoint = now
    let earlier = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hourStart), parseInt(minuteStart))
    let later = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hourEnd), parseInt(minuteEnd))

    if (liesInRange(timepoint, earlier, later)) {
      interval = class_
    }
  })

  return interval
}

console.log("[utilities] current interval is ", determineInterval())

export function getContentfulClient() {
  const client: ContentfulClientApi<undefiend> = createClient({
    space: ContentfulSpace,
    environment: "master", // defaults to 'master' if not set
    accessToken: ContentfulContentDeliveryAccessToken,
  })

  return client
}

export function ensureExtension(filename: string, extension: string) {
  if (filename.endsWith(extension)) return filename

  return filename + extension
}

export function ensureNoExtension(filename: string, extension: string) {
  if (!filename.endsWith(extension)) return filename

  return filename.slice(0, -extension.length)
}

export const isMail = (text: string) => {
  return text.includes("@") && !text.includes("http")
}
