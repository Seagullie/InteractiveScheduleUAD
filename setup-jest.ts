// const matchers = require("jest-extended")
// expect.extend(matchers)

console.log("Running setup-jest.ts")

import "@testing-library/jest-native/extend-expect"
import mockExpoFileSystem from "./__mocks__/jest-expo-preset-overwrite/expo-file-system"

// apply expo module mocks (those overwrite the jest-expo-preset mocks)
mockExpoFileSystem()

// apply own module mocks
jest.mock("./utilities/utilities")

afterEach(() => {
  jest.useRealTimers()
})
