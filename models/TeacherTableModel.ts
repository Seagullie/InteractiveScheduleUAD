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

export default class TeacherTableModel {
  teachers = teachersJson
  teachersFuse = new Fuse(this.teachers, {
    keys: ["ПІБ викладача"],
    threshold: 0.3,
  })

  private static instance: TeacherTableModel

  static GetInstance(): TeacherTableModel {
    if (!TeacherTableModel.instance) {
      TeacherTableModel.instance = new TeacherTableModel()
    }

    return TeacherTableModel.instance
  }

  private constructor() {
    console.log("teacher table model constructed successfully")
  }

  getTeacherBySurname(surname: string): Teacher | string {
    // sanitized surname string: remove periods and spaces
    // surname = surname.split(" ")[0].replace(".", "").replace(" ", "")

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

    surname = teacher["ПІБ викладача"].split(" ")[0]
    let name = teacher["ПІБ викладача"].split(" ")[1]
    let patronymic = teacher["ПІБ викладача"].split(" ")[2]

    return `${surname} ${name[0]}. ${patronymic[0]}.`
  }
}
