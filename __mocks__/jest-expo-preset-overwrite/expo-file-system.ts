export default function mockExpoFileSystem() {
  jest.mock("expo-file-system", () => {
    const mockGetInfoAsyncImplementation = () => {
      return Promise.resolve({ exists: true })
    }

    const mockGetInfoAsync = jest.fn().mockImplementation(mockGetInfoAsyncImplementation)

    const FileSystemMock = {
      ...jest.requireActual("expo-file-system"), // use actual implementation for all non-mocked methods
      getInfoAsync: mockGetInfoAsync,

      readDirectoryAsync: jest.fn().mockReturnValue(Promise.resolve(["scheduleFileName1", "scheduleFileName2"])),

      makeDirectoryAsync: jest.fn().mockReturnValue(Promise.resolve()),

      readAsStringAsync: jest.fn().mockImplementation(() =>
        Promise.resolve(
          JSON.stringify({
            filename: "ІСТ-example.json",
            revision: 0,
            createdAt: "",
            updatedAt: "",
            json_parsed: mockExampleSchedule,
          })
        )
      ),

      writeAsStringAsync: jest.fn().mockReturnValue(Promise.resolve()),

      downloadAsync: jest.fn().mockReturnValue(Promise.resolve()),
    }

    return {
      ...FileSystemMock,
      __esModule: true,
    }
  })
}

import ExampleScheduleKN from "../../assets/example_schedules/КН-example.json"
import ExampleScheduleIST from "../../assets/example_schedules/ІСТ-example.json"
const mockExampleSchedule = ExampleScheduleIST

// jest.mock("expo-file-system")

// jest.mock("@react-native-community/netinfo", () => {
//   const mockNetInfo = {
//     fetch: jest.fn().mockResolvedValue({
//       isConnected: true,
//       isInternetReachable: true,
//     }),
//   }

//   return {
//     default: mockNetInfo,
//     __esModule: true,
//   }
// })
