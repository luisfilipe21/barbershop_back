import { GoogleCalendarService } from "./GoogleCalendarService";

export const googleCalendarService = new GoogleCalendarService(
    process.env.GOOGLE_CALENDAR_ID as string,
);