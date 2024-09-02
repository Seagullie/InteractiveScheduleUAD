export type REGLAMENT_DATA_ELEM_TYPE = [number, string, string]
export type REGLAMENT_DATA_TYPE = REGLAMENT_DATA_ELEM_TYPE[]

// export const REGLAMENT_DATA_OLD: REGLAMENT_DATA_TYPE = [
//   [1, "8:30", "10:05", "9:15 – 9:20"],
//   [2, "10:15", "11:50", "11:00 – 11:05"],
//   [3, "12:20", "13:55", "13:05 – 13:10"],
//   [4, "14:05", "15:40", "14:50 – 14:55"],
//   [5, "15:50", "17:25", "16:35 – 16:40"],
//   [6, "17:35", "19:10", "18:20 – 18:25"],
// ]

export const REGLAMENT_DATA: REGLAMENT_DATA_TYPE = [
  [1, "8:30", "9:50"],
  [2, "10:05", "11:25"],
  [3, "11:40", "13:00"],
  [4, "13:15", "14:35"],
  [5, "14:50", "16:10"],
  [6, "16:25", "17:45"],
  [7, "18:00", "19:20"],
  [8, "19:30", "20:50"],
]

export const suffixesForNumbers = {
  1: "-ша",
  2: "-га",
  3: "-тя",
  4: "-та",
  5: "-та",
  6: "-та",
}

export const SEMESTER_MONTHS = 6
export const MAX_CLASSES_PER_DAY = 6

export const NOTIFICATIONS_CHANNEL_ID = "interactive-schedule-notifications"

export const WEB_VERSION_NAME = "scheduleuad.live"
export const LINK_TO_WEB_VERSION = `https://${WEB_VERSION_NAME}`
