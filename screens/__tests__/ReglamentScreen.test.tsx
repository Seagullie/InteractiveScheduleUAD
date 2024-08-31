import { render } from "@testing-library/react-native"
import ReglamentScreen from "../ReglamentScreen"
jest.mock("../../utilities/utilities", () => {
  let thirdClassDate = new Date()
  thirdClassDate.setHours(13)
  thirdClassDate.setMinutes(5)

  const actualUtilities = jest.requireActual("../../utilities/utilities")
  return {
    ...actualUtilities,
    determineInterval: () => actualUtilities.determineInterval(thirdClassDate),
  }
})

// jest.spyOn(Utilities, "determineInterval").mockImplementation(() => {
//   let thirdClassDate = new Date()
//   thirdClassDate.setHours(13)
//   thirdClassDate.setMinutes(5)

//   const actualUtilities = jest.requireActual("../../utilities/utilities")

//   debugger

//   return actualUtilities.determineInterval(thirdClassDate)
// })

describe("<ReglamentScreen />", () => {
  it("renders everything correctly", async () => {
    let renderedComponent = render(<ReglamentScreen />)

    expect(renderedComponent.getByText("1 пара")).toBeTruthy()
    expect(renderedComponent.getByText("2 пара")).toBeTruthy()
    expect(renderedComponent.getAllByText("ПОЧАТОК")).toBeTruthy()
  })

  it("highlights current time period", () => {
    let renderedComponent = render(<ReglamentScreen />)

    let currentPeriod = renderedComponent.getByTestId("currentClass2")
    expect(currentPeriod).toBeTruthy()
  })
})
