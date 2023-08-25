import React from "react"
import renderer, { ReactTestRendererJSON } from "react-test-renderer"
import { Button, Text, TextInput, View } from "react-native"
import { render, screen, fireEvent } from "@testing-library/react-native"
import ScheduleClassComponent from "../ScheduleComponents/ScheduleClass"
import ScheduleModel, { ScheduleDay } from "../../models/ScheduleModel"
import ScheduleLoaderService from "../../services/ScheduleLoaderService"
import SettingsService from "../../services/SettingsService"
import { SettingsContext } from "../../contexts/settingsContext"

// TODO: move to test-utils

function isDayOff(day: ScheduleDay) {
  return day.classes.length === 0
}

async function getFirstSchedule() {
  const scheduleLoader = await ScheduleLoaderService.GetInstance()
  const schedule = new ScheduleModel("test schedule", "test schedule description", 5)
  await schedule.getScheduleFromScheduleLoader(scheduleLoader.scheduleFiles[0].filename)

  return schedule
}

async function getFirstClass(schedule: ScheduleModel) {
  const studyDay = schedule.scheduleDays.filter((day) => !isDayOff(day))[0]

  const sampleClass = studyDay.classes[0]

  return sampleClass
}
describe("<ScheduleClass />", () => {
  it("renders class name", async () => {
    let sampleClass = await getFirstClass(await getFirstSchedule())
    let sampleClassName = sampleClass.name

    let settingsService = await SettingsService.GetInstance()

    let renderedComponent = render(
      <SettingsContext.Provider value={settingsService}>
        <ScheduleClassComponent
          scheduleClassInstance={sampleClass}
          displayRoomNumber={settingsService.displayRoomNumber}
          idx={0}
          highlightAsOngoing={false}
          isEditable={false}
          key={"random-key"}
        />
      </SettingsContext.Provider>
    )

    expect(renderedComponent.getByText(sampleClassName)).toBeTruthy()
  })

  // no idea how to test this behavior properly as the dom element's content stays the same whether it's expanded or not
  it("unfolds class name & room on press", async () => {
    let sampleClass = await getFirstClass(await getFirstSchedule())
    sampleClass.room = ["а. 308", "К. 13"]

    // sampleClass.name =
    //   "Інтерактивні поліграфічні видання і паковання, Розробка та дизайн елементів захисту поліграфічної продукції (РДЕЗПП) В., Web-програмування (ДВВ)"

    let sampleClassName = sampleClass.name

    let settingsService = await SettingsService.GetInstance()

    let renderedComponent = render(
      <SettingsContext.Provider value={settingsService}>
        <ScheduleClassComponent
          scheduleClassInstance={sampleClass}
          displayRoomNumber={settingsService.displayRoomNumber}
          idx={0}
          highlightAsOngoing={false}
          isEditable={false}
          key={"random-key"}
        />
      </SettingsContext.Provider>
    )

    let classNameElement = renderedComponent.getByText(sampleClassName)
    let roomElementBeforeUnfold = renderedComponent.getByText(sampleClass.room[0])

    expect(classNameElement).toHaveProp("numberOfLines", 1)
    expect(roomElementBeforeUnfold).toBeTruthy()

    fireEvent.press(classNameElement)

    let roomElementAfterUnfold = renderedComponent.getByText(sampleClass.room.join("\n"))

    // number of lines set to 0 prevents the text from being truncated
    expect(classNameElement).toHaveProp("numberOfLines", 0)

    expect(roomElementAfterUnfold).toBeTruthy()
  })

  it("unfolds teacher name on press", async () => {
    let sampleClass = await getFirstClass(await getFirstSchedule())
    sampleClass.teacher = ["Білецький А. В.", "Шевченко В. В."]

    let settingsService = await SettingsService.GetInstance()

    let renderedComponent = render(
      <SettingsContext.Provider value={settingsService}>
        <ScheduleClassComponent
          scheduleClassInstance={sampleClass}
          displayRoomNumber={settingsService.displayRoomNumber}
          idx={0}
          highlightAsOngoing={false}
          isEditable={false}
          key={"random-key"}
        />
      </SettingsContext.Provider>
    )

    let teacherNameElement = renderedComponent.getByTestId("teacher-text")

    expect(teacherNameElement).toHaveProp("numberOfLines", 1)

    fireEvent.press(teacherNameElement)

    expect(teacherNameElement).toHaveProp("numberOfLines", 0)
  })

  it("highlights ongoing class", async () => {
    let sampleClass = await getFirstClass(await getFirstSchedule())

    let settingsService = await SettingsService.GetInstance()

    let renderedComponent = render(
      <SettingsContext.Provider value={settingsService}>
        <ScheduleClassComponent
          scheduleClassInstance={sampleClass}
          displayRoomNumber={settingsService.displayRoomNumber}
          idx={0}
          highlightAsOngoing={true}
          isEditable={false}
          key={"random-key"}
        />
      </SettingsContext.Provider>
    )

    let scheduleClass = renderedComponent.getByTestId("schedule-class")

    // TODO: extract the color to palette
    expect(scheduleClass).toHaveStyle({
      backgroundColor: "rgb(227, 239, 249)",
    })
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
