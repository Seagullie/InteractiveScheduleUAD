import _ from "lodash"
import { workDaysEnLower } from "../../constants/Days"
import { ScheduleDay } from "../../models/ScheduleDay/ScheduleDay"
import { ensureExtension } from "../../utilities/utilities"
import EditedSchedulesStorageService from "../EditedScheduleStorageService/EditedScheduleStorageService"
import ScheduleLoaderServiceBase from "./ScheduleLoaderServiceBase"
import { IScheduleModel } from "../../models/ScheduleModel/Types"

/**
 * Web version of the ScheduleLoaderService
 */
export default class ScheduleLoaderService extends ScheduleLoaderServiceBase {
  protected override async init() {
    await this.getSchedulesFromContentful()
    // replace contentful schedules with their user edited versions
    await this.replaceContentfulSchedulesWithEditedVersions()

    // sort schedules by filename
    this.scheduleFiles = _.sortBy(this.scheduleFiles, (sf) => sf.filename)
  }

  /**
   * Replaces Contentful schedules with their user-edited counterparts.
   */
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

  /**
   * Persists given schedule model into local storage. Overrides parent class' method.
   */
  override async dumpSchedule(schedule: IScheduleModel) {
    // get corresponding schedule file
    let scheduleFile = this.getScheduleFileByFileName(ensureExtension(schedule.name, ".json"))

    let jsonToDump: {
      [key: string]: ScheduleDay
    } = {}

    workDaysEnLower.forEach((day, idx) => {
      jsonToDump[day] = schedule.scheduleDays[idx]
    })

    // replace .json_parsed with schedule contents
    scheduleFile!.json_parsed = jsonToDump

    const editedScheduleStorage = await EditedSchedulesStorageService.GetInstance()
    await editedScheduleStorage.saveEditedSchedule(schedule)

    return Promise.resolve()
  }
}
