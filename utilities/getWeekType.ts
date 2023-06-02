import { GetTimeDifference } from "./utilities"

export enum WeekType {
  Nominator,
  Denominator,
}

// month/day/year
// const SEMESTER_START = new Date("10/3/2022") // such string notation doesn't work in react native
const SEMESTER_START = new Date(2022, 9, 3) // month is 0-based
const SEMESTER_START_TYPE = WeekType.Denominator

export default function GetWeekType(): WeekType {
  let now = new Date()
  let timeDifferenceInHours = GetTimeDifference(SEMESTER_START, now).hours
  let timeDifferenceInDays = timeDifferenceInHours / 24
  let timeDifferenceInWeeks = Math.trunc(timeDifferenceInDays / 7)

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
