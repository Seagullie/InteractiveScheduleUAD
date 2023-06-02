export const daysInShortenedForm = ["Пн", "Вт", "Ср", "Чт", "Пт"]
export const localizedDays = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]

export const workDays = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця"]
export const workDaysEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
export const workDaysEnLower = workDaysEn.map((day) => day.toLowerCase())

export function mapEnWorkDayToUkrWorkDay(day: string): string {
  let index = workDaysEnLower.indexOf(day.toLowerCase())
  return workDays[index]
}

export function mapUkrWorkDayToEnWorkDay(day: string): string {
  day = day.toLowerCase()
  let workDaysLower = workDays.map((d) => d.toLowerCase())

  let index = workDaysLower.indexOf(day)
  return workDaysEn[index]
}
