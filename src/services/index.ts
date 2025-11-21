import { GoogleCalendarService } from "./GoogleCalendarService";
import { ScheduleService } from "./schedule.services";

const googleCalendarService = new GoogleCalendarService();
const scheduleService = new ScheduleService(googleCalendarService);

export { googleCalendarService, scheduleService };