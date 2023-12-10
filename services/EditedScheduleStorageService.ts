// web only.
// service for saving edited schedules to local storage

// TODO: resolve require cycle: EditedScheduleStorageService.ts -> services\ScheduleLoaderService.ts -> EditedScheduleStorageService.ts

import AsyncStorage from "@react-native-async-storage/async-storage"

import ScheduleModel, { ScheduleDaysJson } from "../models/ScheduleModel"
import { ScheduleDay } from "../models/ScheduleDay"
import { workDaysEnLower } from "../constants/Days"
import ScheduleLoaderService, { ContentfulScheduleFileMetadata } from "./ScheduleLoaderService"
import _ from "lodash"
import { ensureExtension } from "../utilities/utilities"

type ScheduleWithMetadata = {
  scheduleDays: ScheduleDaysJson
  metadata: ContentfulScheduleFileMetadata
}

interface IEditedScheduleStorageService {
  createVersionForEdits: (schedule: ScheduleModel) => Promise<ScheduleModel>
  saveEditedSchedule: (schedule: ScheduleModel) => Promise<void>
  loadEditedSchedule: (scheduleFileName: string) => Promise<ScheduleWithMetadata | null>

  isOutdated: (scheduleFileName: string) => Promise<boolean>
  removeEditedSchedule: (scheduleName: string) => Promise<void>
}

// singleton service
export default class EditedSchedulesStorageService implements IEditedScheduleStorageService {
  private static instance: EditedSchedulesStorageService

  static async GetInstance(): Promise<EditedSchedulesStorageService> {
    if (!EditedSchedulesStorageService.instance) {
      EditedSchedulesStorageService.instance = new EditedSchedulesStorageService()

      await EditedSchedulesStorageService.instance.init()

      console.log("EditedScheduleStorageService instance constructed successfully")
    }

    return EditedSchedulesStorageService.instance
  }

  async init() {
    let scheduleLoader = await ScheduleLoaderService.GetInstance()
    // invalidate outdated edited schedules
    const results = scheduleLoader.scheduleFiles.map(async (scheduleFile) => {
      if (await this.isOutdated(scheduleFile.filename)) {
        await this.removeEditedSchedule(scheduleFile.filename)
      }
    })

    await Promise.all(results)
  }

  // copies regular schedule to local storage
  async createVersionForEdits(schedule: ScheduleModel) {
    // I wonder if this is enough
    await this.saveEditedSchedule(schedule)
    return schedule
  }

  // saves schedule with its metadata to local storage
  async saveEditedSchedule(schedule: ScheduleModel): Promise<void> {
    const scheduleLoader = await ScheduleLoaderService.GetInstance()
    const scheduleMetadata = scheduleLoader.getScheduleFileMetadata(
      scheduleLoader.getScheduleFileByFileName(ensureExtension(schedule.name, ".json"))
    )

    let jsonToDump: ScheduleWithMetadata = {
      metadata: scheduleMetadata,
      scheduleDays: {},
    }

    workDaysEnLower.forEach((day, idx) => {
      jsonToDump["scheduleDays"][day] = schedule.scheduleDays[idx]
    })

    await AsyncStorage.setItem(ensureExtension(schedule.name, ".json"), JSON.stringify(jsonToDump))
  }

  // gets edited schedule from local storage
  async loadEditedSchedule(scheduleFileName: string): Promise<ScheduleWithMetadata | null> {
    const scheduleWithMetadata = await AsyncStorage.getItem(scheduleFileName)

    if (!scheduleWithMetadata) return null

    const scheduleWithMetadataJSON: ScheduleWithMetadata = JSON.parse(scheduleWithMetadata)

    return scheduleWithMetadataJSON
  }

  async isOutdated(scheduleFileName: string) {
    let scheduleLoader = await ScheduleLoaderService.GetInstance()
    let contentfulScheduleFile = scheduleLoader.getScheduleFileByFileName(scheduleFileName)

    let editVer = await this.loadEditedSchedule(scheduleFileName)
    if (!editVer) return false

    // debugger

    let editVerMetadata = editVer.metadata

    let contentfulVerMetadata = scheduleLoader.getScheduleFileMetadata(contentfulScheduleFile)

    return !_.isEqual(editVerMetadata, contentfulVerMetadata)
  }

  removeEditedSchedule(scheduleName: string) {
    return AsyncStorage.removeItem(scheduleName)
  }

  async hasEditedVersion(scheduleName: string) {
    const editedVersion = await this.loadEditedSchedule(scheduleName)
    return editedVersion != null
  }
}
