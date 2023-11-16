import * as FileSystem from "expo-file-system"
import { AssetFile } from "contentful"
import _ from "lodash"
import NetInfo from "@react-native-community/netinfo"

import ScheduleModel from "../models/ScheduleModel"
import { ScheduleDay } from "../models/ScheduleDay"
import { workDaysEnLower } from "../constants/Days"
import { ensureExtension, getContentfulClient, isRunningInBrowser } from "../utilities/utilities"
import ExampleScheduleKN from "../assets/example_schedules/КН-example.json"
import ExampleScheduleIST from "../assets/example_schedules/ІСТ-example.json"
import ExampleScheduleTE from "../assets/example_schedules/ТЕ-example.json"
import EditedSchedulesStorageService from "./EditedScheduleStorageService"

// This is a singleton service that loads schedules from local storage / contentful and provides it to the rest of the application
// if no schedules are available (no schedules folder), it should retrieve them from contentful and store them locally
// if schedules are indeed available, we gotta check whether they are up to date or not
// for that we will have to rely on some additional field. Perhaps revision or perhaps creactedAt.
// or perhaps both

export type ContentfulScheduleFileMetadata = {
  filename: string
  revision: number
  createdAt: string
  updatedAt: string
}

export interface ScheduleFile extends ContentfulScheduleFileMetadata {
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

      // log loaded schedule files
      console.log(`[${this.name}] schedule loader service instance constructed successfully`)
      console.log(`[${this.name}] schedule loader files:`)
      this.instance.scheduleFiles.forEach((file) => console.log(`[${this.name}] file: ${file.filename}`))
    }

    return this.instance
  }

  protected constructor() {}

  protected async init() {
    if (isRunningInBrowser()) {
      await this.getSchedulesFromContentful()
      // replace contentful schedules with their user edited versions
      await this.replaceContentfulSchedulesWithEditedVersions()
    } else {
      // check whether schedules are available locally
      const schedulesAvailableLocally = (await FileSystem.getInfoAsync(this.pathToScheduleFolder)).exists

      // TODO: refactor try catches into one hoisted try catch
      if (schedulesAvailableLocally) {
        await this.getSchedulesFromFileSystem()

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
    }

    this.scheduleFiles = _.sortBy(this.scheduleFiles, (sf) => sf.filename)
  }
  async replaceContentfulSchedulesWithEditedVersions() {
    const editedSchedulesStorage = await EditedSchedulesStorageService.GetInstance()

    let editedCounterpartsPromises = this.scheduleFiles.map(async (sf) => {
      // patch contentful schedules with edited versions
      const editedSchedule = await editedSchedulesStorage.loadEditedSchedule(sf.filename)
      if (editedSchedule) {
        sf.json_parsed = editedSchedule.scheduleDays
      }

      return sf
    })

    let editedCounterparts = await Promise.all(editedCounterpartsPromises)

    this.scheduleFiles = editedCounterparts
  }

  async getSchedulesFromFileSystem() {
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
    return scheduleFiles
  }

  // downloads schedules and sets them to .scheduleFiles
  // also saves them to schedules folder (android only)
  async getSchedulesFromContentful() {
    // retrieve schedules from contentful
    console.log(`[Schedule Loader] retrieving schedules from contentful`)

    const client = getContentfulClient()
    const assets = await client.getAssets({
      limit: 1000,
    })
    console.log(`[Schedule Loader] retrieved ${assets.items.length} schedule assets from Contentful`)

    // iterate over assets and download them

    const scheduleFiles: ScheduleFile[] = await Promise.all(
      assets.items.map(async (a) => {
        const file: AssetFile = a.fields.file

        const protocol = "https:"
        const linkToFile = protocol + file.url

        // get file located at url and temporarily store it in .json file as I don't know how to download it in memory
        const linkToDestFile = `${this.pathToScheduleFolder}${file.fileName}`

        var scheduleClassesJson: string

        if (!isRunningInBrowser()) {
          await FileSystem.downloadAsync(linkToFile, linkToDestFile)
          scheduleClassesJson = await FileSystem.readAsStringAsync(linkToDestFile)
        } else {
          let res = await fetch(linkToFile)

          const blob = await res.blob()
          const data = await blob.text()

          scheduleClassesJson = data
        }

        let scheduleFile: ScheduleFile = {
          filename: file.fileName,
          revision: a.sys.revision,
          createdAt: a.sys.createdAt,
          updatedAt: a.sys.updatedAt,
          json_parsed: JSON.parse(scheduleClassesJson),
        }

        if (!isRunningInBrowser()) {
          // save schedule classes json together with metadata to schedules folder
          await FileSystem.writeAsStringAsync(linkToDestFile, JSON.stringify(scheduleFile))
        }

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

      {
        filename: "ТЕ-example.json",
        revision: 0,
        createdAt: "",
        updatedAt: "",
        json_parsed: ExampleScheduleTE,
      },
    ]

    this.scheduleFiles = scheduleFiles

    return scheduleFiles
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

    const assets = await client.getAssets({
      limit: 1000,
    })
    console.log(`[Schedule Loader] retrieved ${assets.items.length} schedule assets from contentful`)

    // iterate over assets and download their metadata
    // TODO: dry up the duplicate

    const scheduleFileMetadatas: (ContentfulScheduleFileMetadata & { linkToFile: string })[] = await Promise.all(
      assets.items.map(async (itm) => {
        const file: AssetFile = itm.fields.file

        const protocol = "https:"
        const linkToFile = protocol + file.url

        let scheduleFileMetadata: ContentfulScheduleFileMetadata & { linkToFile: string } = {
          filename: file.fileName,
          revision: itm.sys.revision,
          createdAt: itm.sys.createdAt,
          updatedAt: itm.sys.updatedAt,
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

  getScheduleFileMetadata(scheduleFile: ScheduleFile): ContentfulScheduleFileMetadata | undefined {
    if (!scheduleFile) {
      return undefined
    }

    return {
      filename: scheduleFile.filename,
      revision: scheduleFile.revision,
      createdAt: scheduleFile.createdAt,
      updatedAt: scheduleFile.updatedAt,
    }
  }

  // persists schedule model into file
  async dumpSchedule(schedule: ScheduleModel) {
    // get corresponding schedule file
    let scheduleFile = this.getScheduleFileByFileName(ensureExtension(schedule.name, ".json"))

    let jsonToDump: { [key: string]: ScheduleDay } = {}

    workDaysEnLower.forEach((day, idx) => {
      jsonToDump[day] = schedule.scheduleDays[idx]
    })

    // replace .json_parsed with schedule contents
    scheduleFile!.json_parsed = jsonToDump

    if (isRunningInBrowser()) {
      const editedScheduleStorage = await EditedSchedulesStorageService.GetInstance()
      await editedScheduleStorage.saveEditedSchedule(schedule)

      return Promise.resolve()
    }

    console.log(`[Schedule Loader] dumping schedule ${scheduleFile?.filename} to file`)
    // write to file
    return FileSystem.writeAsStringAsync(
      `${this.pathToScheduleFolder}${scheduleFile!.filename}`,
      JSON.stringify(scheduleFile)
    )
  }
}
