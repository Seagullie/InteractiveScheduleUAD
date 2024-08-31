import { isArray } from "lodash"
import { ScheduleClass } from "../../../models/ScheduleClass/ScheduleClass"
import TeacherModel from "../../../models/TeacherModel/TeacherModel"
import SettingsService from "../../../services/SettingsService/SettingsService"
import { DisplayTeacherMode } from "../../../services/SettingsService/Types"

export const formatRoomName = (scheduleClassInstance: ScheduleClass, unfoldClassText: boolean) => {
  let room = ""

  if (
    scheduleClassInstance.room == "" ||
    scheduleClassInstance.room == null ||
    scheduleClassInstance.room == undefined
  ) {
    // collapse all kinds of missing values into empty string
    room = ""
  } else {
    if (typeof scheduleClassInstance.room == "string") {
      room = scheduleClassInstance.room
    } else if (scheduleClassInstance.room.length != undefined) {
      // array check
      room = scheduleClassInstance.room.join("\n")
    }
  }

  // pad dots with spaces
  room = room.replace(/\.(?!\s)/g, ". ")

  if (!unfoldClassText) {
    room = room.split("\n")[0]
  }

  return room
}

// TODO: annotate
export const formatTeacherName = (
  scheduleClassInstance: ScheduleClass,
  isEditable: boolean,
  settings: SettingsService | null // can be null if isEditable is true
) => {
  let teacher = ""

  let teacherTable = TeacherModel.GetInstance()
  let teacherSurname = scheduleClassInstance.teacher

  let surnameIsNull = teacherSurname == null
  let surnameIsArray = isArray(teacherSurname)

  if (surnameIsNull) {
    teacher = "..."
  } else if (surnameIsArray) {
    teacherSurname = teacherSurname as string[]

    if (teacherSurname.length == 1) {
      let firstEl = teacherSurname[0]
      //   if (typeof firstEl == "string" && firstEl.includes("Білик Оксана Петрівна")) {
      //     debugger
      //   }
      teacher = _formatTeacherString(firstEl, isEditable, settings, teacherTable)
    } else {
      let teachers = teacherSurname.map((sn) => teacherTable.getSurnameAndInitialsBySurname(sn))
      teacher = teachers.join(", ")
    }
  } else {
    // surname is string
    teacher = _formatTeacherString(teacherSurname as string, isEditable, settings, teacherTable)
  }

  return teacher
}

function _formatTeacherString(
  teacherSurname: string,
  isEditable: boolean,
  settings: SettingsService,
  teacherTable: TeacherModel
) {
  let teacher: string

  let displayTeacherNameMode = isEditable ? DisplayTeacherMode.Full : settings!.displayTeacherName

  if (displayTeacherNameMode == DisplayTeacherMode.Full) {
    teacher = teacherTable.getFullNameBySurname(teacherSurname)
  } else if (displayTeacherNameMode == DisplayTeacherMode.SurnameAndInitials) {
    teacher = teacherTable.getSurnameAndInitialsBySurname(teacherSurname)
  }
  return teacher
}
