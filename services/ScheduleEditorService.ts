// perhaps won't need this service at all

// singleton service
export default class ScheduleEditorService {
  scheduleUpdated = false

  private static instance: ScheduleEditorService

  GetInstance(): ScheduleEditorService {
    if (!ScheduleEditorService.instance) {
      ScheduleEditorService.instance = new ScheduleEditorService()
    }
    return ScheduleEditorService.instance
  }
}
