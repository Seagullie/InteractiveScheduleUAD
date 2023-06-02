export type REGLAMENT_DATA_ELEM_TYPE = [number, string, string, string]
export type REGLAMENT_DATA_TYPE = REGLAMENT_DATA_ELEM_TYPE[]

export const REGLAMENT_DATA: REGLAMENT_DATA_TYPE = [
  [1, "8:30", "10:05", "9:15 – 9:20"],
  [2, "10:15", "11:50", "11:00 – 11:05"],
  [3, "12:20", "13:55", "13:05 – 13:10"],
  [4, "14:05", "15:40", "14:50 – 14:55"],
  [5, "15:50", "17:25", "16:35 – 16:40"],
  [6, "17:35", "19:10", "18:20 – 18:25"],
]

export const suffixesForNumbers = {
  1: "-ша",
  2: "-га",
  3: "-тя",
  4: "-та",
  5: "-та",
  6: "-та",
}

console.log("Creating REGLAMENT_DATA")


export const NOTIFICATIONS_CHANNEL_ID = "interactive-schedule-notifications"