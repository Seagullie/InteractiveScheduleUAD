import React from "react"
import renderer, { ReactTestRendererJSON } from "react-test-renderer"
import { Button, Text, TextInput, View } from "react-native"
import { render, screen, fireEvent } from "@testing-library/react-native"
import ScheduleClassComponent from "../ScheduleComponents/ScheduleClass"
import ScheduleModel, { ScheduleDay } from "../../models/ScheduleModel"
import ScheduleLoaderService from "../../services/ScheduleLoaderService"
import SettingsService from "../../services/SettingsService"

// TODO: move to test-utils

function isDayOff(day: ScheduleDay) {
  return day.classes.length === 0
}

async function getSampleSchedule() {
  const scheduleLoader = await ScheduleLoaderService.GetInstance()
  const schedule = new ScheduleModel("test schedule", "test schedule description", 5)
  await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

  return schedule
}

async function getSampleClass(schedule: ScheduleModel) {
  const studyDay = schedule.scheduleDays.filter((day) => !isDayOff(day))[0]

  const sampleClass = studyDay.classes[0]

  return sampleClass
}
describe("<ScheduleClass />", () => {
  it("renders class name", async () => {
    // TODO: wrap render in context provider

    let sampleClass = await getSampleClass(await getSampleSchedule())
    let sampleClassName = sampleClass.name

    let settingsService = await SettingsService.GetInstance()

    let renderedComponent = render(
      <ScheduleClassComponent
        scheduleClassInstance={sampleClass}
        displayRoomNumber={settingsService.displayRoomNumber}
        idx={0}
        highlightAsOngoing={false}
        isEditable={false}
        key={"random-key"}
      />
    )

    expect(renderedComponent.getByText(sampleClassName)).toBeTruthy()
  })
})

// function Example() {
//   const [name, setUser] = React.useState("")
//   const [show, setShow] = React.useState(false)

//   return (
//     <View>
//       <TextInput value={name} onChangeText={setUser} testID="input" />
//       <Button
//         title="Print Username"
//         onPress={() => {
//           // let's pretend this is making a server request, so it's async
//           // (you'd want to mock this imaginary request in your unit tests)...
//           setTimeout(() => {
//             setShow(true)
//           }, Math.floor(Math.random() * 200))
//         }}
//       />
//       {show && <Text testID="printed-username">{name}</Text>}
//     </View>
//   )
// }

// test("examples of some things", async () => {
//   const expectedUsername = "Ada Lovelace"

//   render(<Example />)

//   fireEvent.changeText(screen.getByTestId("input"), expectedUsername)
//   fireEvent.press(screen.getByText("Print Username"))

//   // Using `findBy` query to wait for asynchronous operation to finish
//   const usernameOutput = await screen.findByTestId("printed-username")

//   // Using `toHaveTextContent` matcher from `@testing-library/jest-native` package.
//   expect(usernameOutput).toHaveTextContent(expectedUsername)

//   expect(screen.toJSON()).toMatchSnapshot()
// })
