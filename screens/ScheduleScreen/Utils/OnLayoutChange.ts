import ldash from "lodash"
import { OnLayoutChangeParams } from "./Types"

let scrolledToToday = false
const todayIndex = ldash.clamp(new Date().getDay() - 1, 0, 4)

/**
 * OnLayoutChange callback for ScheduleScreen. Scrolls to current Schedule Day
 */
export function OnLayoutChange({ dataSourceCoords, scrollViewContainerRef }: OnLayoutChangeParams) {
  //   logDebugInfo(dataSourceCoords, layout, idx)

  // wait for second run of this function to have all layout data
  if (dataSourceCoords.length != 5) return
  if (scrolledToToday) return

  // scroll to current day
  // this should happen only once
  scrollViewContainerRef.current!.scrollTo({
    x: 0,
    y: dataSourceCoords[todayIndex],
    animated: true,
  })

  scrolledToToday = true
}

/**
 * Hepler function. Logs debug info about the layout of a component
 */
export function logDebugInfo(
  dataSourceCoords: number[],
  layout: { height: number; width: number; x: number; y: number },
  idx: number
) {
  console.log(`- - - component ${idx} layout data (start) - - - `)
  console.log(dataSourceCoords)
  console.log("height:", layout.height)
  console.log("width:", layout.width)
  console.log("x:", layout.x)
  console.log("y:", layout.y)
  console.log("- - - component layout data (end) - - - ")
}
