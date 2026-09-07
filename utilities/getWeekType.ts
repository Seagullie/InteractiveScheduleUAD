import { GetTimeDifference } from "./utilities"

export enum WeekType {
  Nominator,
  Denominator,
}

// month/day/year
// const SEMESTER_START = new Date("10/3/2022") // such string notation doesn't work in react native
let SEMESTER_START = new Date(2026, 8, 7) // month is 0-based
let SEMESTER_START_TYPE = WeekType.Denominator

export default function GetWeekType(timepoint = new Date()): WeekType {
  // let timepoint = new Date()
  const timeDifferenceInHours = GetTimeDifference(SEMESTER_START, timepoint).hours
  const timeDifferenceInDays = timeDifferenceInHours / 24
  const timeDifferenceInWeeks = Math.trunc(timeDifferenceInDays / 7)

  if (timeDifferenceInWeeks % 2 == 0) {
    if (SEMESTER_START_TYPE === WeekType.Denominator) {
      return WeekType.Denominator
    }
    return WeekType.Nominator
  } else {
    if (SEMESTER_START_TYPE === WeekType.Denominator) {
      return WeekType.Nominator
    }
    return WeekType.Denominator
  }
}
