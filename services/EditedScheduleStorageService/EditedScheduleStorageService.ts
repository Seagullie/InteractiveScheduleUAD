// web only.
// service for saving edited schedules to local storage

import AsyncStorage from "@react-native-async-storage/async-storage"

import { workDaysEnLower } from "../../constants/Days"
import ScheduleLoaderService from "../ScheduleLoaderService/ScheduleLoaderService"
import _ from "lodash"
import { ensureExtension } from "../../utilities/utilities"
import { IEditedScheduleStorageService, ScheduleWithMetadata } from "./Types"
import { IScheduleModel } from "../../models/ScheduleModel/Types"

/**
 * [Web only] Singleton service for saving edited schedules to local storage.
 */
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

  /**
   * Copies regular schedule to local storage
   */
  async createVersionForEdits(schedule: IScheduleModel) {
    // I wonder if this is enough
    await this.saveEditedSchedule(schedule)
    return schedule
  }

  /**
   * Saves schedule with its metadata to local storage.
   */
  async saveEditedSchedule(schedule: IScheduleModel): Promise<void> {
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
