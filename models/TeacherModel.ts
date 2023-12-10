import teachersJson from "../assets/teachers.json"

import Fuse from "fuse.js"

// TODO: make teacher model

type Teacher = {
  "ПІБ викладача": string
  Кваліфікаця: string
  "E-mail": string
  "Кафедра Абревіатура": string
  "Кафедра Повна назва": string
  "Кафедра Посилання": string
  "№": number
}

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
    if (typeof surname != "string") return "Викладача не знайдено"

    let match = this.teachersFuse.search(surname)

    if (match.length == 0) return "Викладача не знайдено"

    return match[0].item
  }

  getFullNameBySurname(surname: string): string {
    let teacher = this.getTeacherBySurname(surname)
    if (teacher == "Викладача не знайдено") return surname

    if (typeof teacher == "string") return teacher
    return teacher["ПІБ викладача"]
  }

  getSurnameAndInitialsBySurname(surname: string): string {
    let teacher = this.getTeacherBySurname(surname)
    if (typeof teacher == "string") return surname

    const teacherFullNameBits = teacher["ПІБ викладача"].split(" ")

    surname = teacherFullNameBits[0]
    let name = teacherFullNameBits[1]
    let patronymic = teacherFullNameBits[2]

    return `${surname} ${name[0]}. ${patronymic[0]}.`
  }
}
