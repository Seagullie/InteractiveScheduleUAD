import TeacherModel from "../TeacherModel"

describe("TeacherTableModel", () => {
  it("fetches full name by surname", () => {
    const teacherTableModel = TeacherModel.GetInstance()

    const sampleTeacher = teacherTableModel.teachers[0]
    const sampleTeacherSurname = sampleTeacher["ПІБ викладача"].split(" ")[0]

    const teacher = teacherTableModel.getFullNameBySurname(sampleTeacherSurname)

    expect(teacher).toBe(sampleTeacher["ПІБ викладача"])
  })

  it("once surname and initials are specified, fetches right person out of those with same surname", () => {
    const teacherTableModel = TeacherModel.GetInstance()

    const teachersWithSameSurname = teacherTableModel.teachers.filter((teacher) => {
      const surname = teacher["ПІБ викладача"].split(" ")[0]
      const nameSakes = teacherTableModel.teachers.filter((teacher2) => {
        const surname2 = teacher2["ПІБ викладача"].split(" ")[0]
        return surname2 == surname
      })
      const hasNamesakes = nameSakes.length > 1 // exclude self

      return hasNamesakes
    })

    const sampleTeacher1 = teachersWithSameSurname[0]
    const sharedSurname = sampleTeacher1["ПІБ викладача"].split(" ")[0]

    const sampleTeacher2 = teachersWithSameSurname[1]

    const sampleTeacher2Initials = `${sampleTeacher2["ПІБ викладача"].split(" ")[1][0]}. ${
      sampleTeacher2["ПІБ викладача"].split(" ")[2][0]
    }.`
    const sampleTeacher2SurnameWithInitials = `${sharedSurname} ${sampleTeacher2Initials}`

    const teacher1 = teacherTableModel.getTeacherBySurname(sharedSurname)
    const teacher2 = teacherTableModel.getTeacherBySurname(sampleTeacher2SurnameWithInitials)

    // debugger

    expect(teacher1).toBe(sampleTeacher1)
    expect(teacher2).toBe(sampleTeacher2)
  })
})
