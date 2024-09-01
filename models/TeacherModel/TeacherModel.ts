import teachersJson from "../../assets/teachers.json"

import Fuse from "fuse.js"
import { Teacher } from "./Types"
import { TEACHER_NOT_FOUND_STRING } from "./Constants"
import { ensureEnding } from "../../utilities/utilities"

export default class TeacherModel {
  teachers = teachersJson
  teachersFuse = new Fuse(this.teachers, {
    keys: ["ПІБ викладача"],
    threshold: 0.3,
  })

  private static instance: TeacherModel

  static GetInstance(): TeacherModel {
    if (!TeacherModel.instance) {
      TeacherModel.instance = new TeacherModel()
    }

    return TeacherModel.instance
  }

  private constructor() {
    console.log("teacher table model constructed successfully")
  }

  getTeacherBySurname(surname: string): Teacher | string {
    if (typeof surname != "string") return TEACHER_NOT_FOUND_STRING

    let match = this.teachersFuse.search(surname)

    if (match.length == 0) return TEACHER_NOT_FOUND_STRING

    return match[0].item
  }

  getFullNameBySurname(surname: string): string {
    let teacher = this.getTeacherBySurname(surname)
    if (teacher == TEACHER_NOT_FOUND_STRING) return surname

    if (typeof teacher == "string") return teacher
    return teacher["ПІБ викладача"]
  }

  getSurnameAndInitialsBySurname(surname: string): string {
    let teacher = this.getTeacherBySurname(surname)

    // handle case of user-provided teacher name (via editor)
    let teacherFullNameBits: string[]
    if (teacher == TEACHER_NOT_FOUND_STRING) {
      teacherFullNameBits = surname.split(" ")
    } else {
      teacherFullNameBits = (teacher as Teacher)["ПІБ викладача"].split(" ")
    }

    surname = teacherFullNameBits[0]
    let name = teacherFullNameBits[1]
    let patronymic = teacherFullNameBits[2]

    // sometimes data is not consistent, e.g. Kolosivska O.V. instead of full name, so additional checks are needed
    let nameInitial = name ? ensureEnding(name[0], ".") : ""
    let patronymicInitial = patronymic ? ensureEnding(patronymic[0], ".") : ""

    return `${surname} ${nameInitial} ${patronymicInitial}`
  }
}
