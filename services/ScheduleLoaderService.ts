import * as FileSystem from "expo-file-system"
import { AssetFile } from "contentful"
import { ensureExtension, getContentfulClient } from "../utilities/utilities"
import ScheduleModel, { ScheduleDay } from "../models/ScheduleModel"
import { workDaysEnLower } from "../constants/Days"
import _ from "lodash"

import * as Network from "expo-network"
import NetInfo from "@react-native-community/netinfo"
import ExampleScheduleKN from "../assets/example_schedules/КН-example.json"
import ExampleScheduleIST from "../assets/example_schedules/ІСТ-example.json"

// This is a singleton service that loads schedules from local storage / contentful and provides it to the rest of the application
// if no schedules are available (no schedules folder) it should retrieve them from contentful and store them locally
// if schedules are indeed available, we gotta check whether they are up to date or not
// for that we will have to rely on some additional field. Perhaps revision or perhaps creactedAt.
// or perhaps both

type ScheduleFileMetadata = {
  filename: string
  revision: number
  createdAt: string
  updatedAt: string
}

export interface ScheduleFile extends ScheduleFileMetadata {
  json_parsed: string
}

export default class ScheduleLoaderService {
  protected static instance: ScheduleLoaderService

  scheduleFiles: ScheduleFile[] = []

  pathToScheduleFolder = `${FileSystem.documentDirectory}schedules/`

  static async GetInstance(): Promise<ScheduleLoaderService> {
    if (!this.instance) {
      this.instance = new this()
      await this.instance.init()

      console.log(`[${this.name}] schedule loader service instance constructed successfully`)
      console.log(`[${this.name}] schedule loader files:`)
      this.instance.scheduleFiles.forEach((file) => console.log(`[${this.name}] file: ${file.filename}`))
    }

    return this.instance
  }

  protected constructor() {}

  protected async init() {
    // check whether schedules are available locally
    const schedulesAvailableLocally = (await FileSystem.getInfoAsync(this.pathToScheduleFolder)).exists

    if (schedulesAvailableLocally) {
      console.log(`[Schedule Loader] schedules are available locally. loading...`)
      let allScheduleFileNames = await FileSystem.readDirectoryAsync(this.pathToScheduleFolder)
      // sort the filenames alphabetically
      allScheduleFileNames.sort()

      console.log(`[Schedule Loader] allScheduleFileNames: ${allScheduleFileNames}`)
      const scheduleFiles: ScheduleFile[] = await Promise.all(
        allScheduleFileNames.map(async (filename) => {
          let file = await FileSystem.readAsStringAsync(`${this.pathToScheduleFolder}${filename}`)
          let json = JSON.parse(file)
          let { revision, createdAt, updatedAt, json_parsed } = json
          return {
            filename,
            revision,
            createdAt,
            updatedAt,
            json_parsed,
          }
        })
      )

      this.scheduleFiles = scheduleFiles

      // check for updates

      try {
        await this.checkForUpdatesAsync()
      } catch (e) {
        this.getExampleSchedules()
      }
    } else {
      // create schedules folder
      await FileSystem.makeDirectoryAsync(this.pathToScheduleFolder, { intermediates: true })

      try {
        await this.getSchedulesFromContentful()
      } catch (e) {
        this.getExampleSchedules()
      }
    }

    this.scheduleFiles = _.sortBy(this.scheduleFiles, (sf) => sf.filename)
  }

  // downloads schedules and sets them to .scheduleFiles
  // also saves them to schedules folder
  async getSchedulesFromContentful() {
    // retrieve schedules from contentful
    console.log(`[Schedule Loader] retrieving schedules from contentful`)

    const client = getContentfulClient()
    const assets = await client.getAssets()
    console.log(`[Schedule Loader] retrieved ${assets.items.length} schedule assets from contentful`)

    // iterate over assets and download them

    const scheduleFiles: ScheduleFile[] = await Promise.all(
      assets.items.map(async (a) => {
        const file: AssetFile = a.fields.file

        const protocol = "https:"
        const linkToFile = protocol + file.url

        // get file located at url and temporarily store it in .json file as I don't know how to download it in memory
        const linkToDestFile = `${this.pathToScheduleFolder}${file.fileName}`
        await FileSystem.downloadAsync(linkToFile, linkToDestFile)

        const scheduleClassesJson = await FileSystem.readAsStringAsync(linkToDestFile)

        let scheduleFile: ScheduleFile = {
          filename: file.fileName,
          revision: a.sys.revision,
          createdAt: a.sys.createdAt,
          updatedAt: a.sys.updatedAt,
          json_parsed: JSON.parse(scheduleClassesJson),
        }

        // save schedule classes json together with metadata to schedules folder
        await FileSystem.writeAsStringAsync(linkToDestFile, JSON.stringify(scheduleFile))

        return scheduleFile
      })
    )

    this.scheduleFiles = scheduleFiles
  }

  getExampleSchedules() {
    console.log(`[Schedule Loader] retrieving example schedules`)

    const scheduleFiles: ScheduleFile[] = [
      {
        filename: "КН-example.json",
        revision: 0,
        createdAt: "",
        updatedAt: "",
        json_parsed: ExampleScheduleKN,
      },
      {
        filename: "ІСТ-example.json",
        revision: 0,
        createdAt: "",
        updatedAt: "",
        json_parsed: ExampleScheduleIST,
      },
    ]

    this.scheduleFiles = scheduleFiles
  }

  getScheduleFileByFileName(fileName: string): ScheduleFile | undefined {
    return this.scheduleFiles.find((sf) => sf.filename === fileName)
  }

  // checks for updates and updates schedules if they are outdated
  async checkForUpdatesAsync() {
    let netInfo = await NetInfo.fetch()

    if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      console.log(`[Schedule Loader] no internet connection. skipping update check`)
      return
    }

    const client = getContentfulClient()

    const assets = await client.getAssets()

    // iterate over assets and download their metadata
    // TODO: dry up the duplicate

    const scheduleFileMetadatas: (ScheduleFileMetadata & { linkToFile: string })[] = await Promise.all(
      assets.items.map(async (a) => {
        const file: AssetFile = a.fields.file

        const protocol = "https:"
        const linkToFile = protocol + file.url

        let scheduleFileMetadata: ScheduleFileMetadata & { linkToFile: string } = {
          filename: file.fileName,
          revision: a.sys.revision,
          createdAt: a.sys.createdAt,
          updatedAt: a.sys.updatedAt,
          linkToFile,
        }

        return scheduleFileMetadata
      })
    )

    // update whatever schedules are outdated
    const updatedScheduleFiles: ScheduleFile[] = await Promise.all(
      scheduleFileMetadatas.map(async (sfm) => {
        let oldSchedule = this.getScheduleFileByFileName(sfm.filename)
        if (!oldSchedule) {
          // schedule is new, download it
          const linkToDestFile = `${this.pathToScheduleFolder}${sfm.filename}`
          await FileSystem.downloadAsync(sfm.linkToFile, linkToDestFile)

          let scheduleFile: ScheduleFile = {
            filename: sfm.filename,
            revision: sfm.revision,
            createdAt: sfm.createdAt,
            updatedAt: sfm.updatedAt,
            json_parsed: JSON.parse(await FileSystem.readAsStringAsync(linkToDestFile)),
          }

          // write newly downloaded schedule to schedules folder
          await FileSystem.writeAsStringAsync(linkToDestFile, JSON.stringify(scheduleFile))

          return scheduleFile
        } else {
          // schedule exists, check if it's outdated
          const isOutdated =
            oldSchedule.revision < sfm.revision ||
            new Date(oldSchedule.updatedAt) < new Date(sfm.updatedAt) ||
            new Date(oldSchedule.createdAt) < new Date(sfm.createdAt)

          //   console.log(`old schedule created at (date constructed from string): ${new Date(oldSchedule.createdAt)}`) // works
          console.log(`[Schedule Loader] schedule ${sfm.filename} is outdated: ${isOutdated}`)
          if (isOutdated) {
            // schedule is outdated, download it
            const linkToDestFile = `${this.pathToScheduleFolder}${sfm.filename}`
            await FileSystem.downloadAsync(sfm.linkToFile, linkToDestFile)

            let scheduleFile: ScheduleFile = {
              filename: sfm.filename,
              revision: sfm.revision,
              createdAt: sfm.createdAt,
              updatedAt: sfm.updatedAt,
              json_parsed: JSON.parse(await FileSystem.readAsStringAsync(linkToDestFile)),
            }

            // write newly downloaded schedule to schedules folder (important)
            await FileSystem.writeAsStringAsync(linkToDestFile, JSON.stringify(scheduleFile))

            return scheduleFile
          } else {
            // schedule is up to date, do nothing
            return oldSchedule
          }
        }
      })
    )

    this.scheduleFiles = updatedScheduleFiles
  }

  dumpSchedule(schedule: ScheduleModel) {
    // get corresponding schedule file
    let scheduleFile = this.getScheduleFileByFileName(ensureExtension(schedule.name, ".json"))

    let jsonToDump: { [key: string]: ScheduleDay } = {}

    workDaysEnLower.forEach((day, idx) => {
      jsonToDump[day] = schedule.scheduleDays[idx]
    })

    // replace .json_parsed with schedule contents
    scheduleFile!.json_parsed = jsonToDump

    console.log(`[Schedule Loader] dumping schedule ${scheduleFile?.filename} to file`)
    // write to file
    return FileSystem.writeAsStringAsync(
      `${this.pathToScheduleFolder}${scheduleFile!.filename}`,
      JSON.stringify(scheduleFile)
    )
  }
}
