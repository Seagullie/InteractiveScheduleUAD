import { REGLAMENT_DATA } from "../../constants/Constants"
import { createEvenlySpacedTimeSequence, determineInterval, ensureExtension, getContentfulClient } from "../utilities"

// jest.mock("../utilities")

describe("utility function ensureExtension", () => {
  it("adds extension to string if it doesn't end with that extension", () => {
    const str = "test"
    const newStr = ensureExtension(str, ".txt")
    expect(newStr).toBe("test.txt")
  })

  it("doesn't add extension to string if it already ends with that extension", () => {
    const str = "test.txt"
    const newStr = ensureExtension(str, ".txt")
    expect(newStr).toBe("test.txt")
  })
})

describe("utility function determineInterval", () => {
  it("correctly determines interval for supplied date (late evening, no classes)", () => {
    let timepoint = new Date()
    timepoint.setHours(20)
    const interval = determineInterval(timepoint)
    expect(interval).toBe(false)
  })

  it("correctly determines interval for supplied date (noon, third class)", () => {
    let timepoint = new Date()
    timepoint.setHours(12)
    timepoint.setMinutes(30)

    const interval = determineInterval(timepoint)
    expect(interval).toStrictEqual(REGLAMENT_DATA[2])
  })
})

describe("utility function createEvenlySpacedTimeSequence", () => {
  it("creates exactly as many elements as needed", () => {
    const interval = createEvenlySpacedTimeSequence(10, 10, new Date())
    expect(interval.length).toBe(10)

    const interval2 = createEvenlySpacedTimeSequence(0, 10, new Date())
    expect(interval2.length).toBe(0)
  })
})

describe("utility function createContentfulClient", () => {
  it("creates client and client fetches example entries", async () => {
    console.log("contentful client:", getContentfulClient)
    const client = getContentfulClient()
    const entries = await client.getEntries()
    expect(entries.items[0].fields.title).toBe("test title")
    expect(entries.items[0].fields.body).toBe("test body")
  })
})
