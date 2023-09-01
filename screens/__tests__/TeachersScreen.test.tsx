import { render, screen, fireEvent } from "@testing-library/react-native"
import TeachersScreen from "../TeachersScreen"

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native")
  return {
    Ionicons: View,
  }
})

describe("<TeachersScreen />", () => {
  it("renders correctly", async () => {
    let renderedComponent = render(<TeachersScreen />)

    expect(renderedComponent.getByPlaceholderText("Знайти викладача")).toBeTruthy()
  })

  it("filters teachers correctly", async () => {
    let renderedComponent = render(<TeachersScreen />)

    const searchInput = renderedComponent.getByPlaceholderText("Знайти викладача")

    fireEvent.changeText(searchInput, "Шеп")

    expect(renderedComponent.getByText("Шепіта Петро Ігорович")).toBeTruthy()
    expect(renderedComponent.getByText("Шепеть Тетяна Миколаївна")).toBeTruthy()
    expect(renderedComponent.queryByText("Миклушка Ігор Зіновійович")).toBeFalsy()
  })
})
