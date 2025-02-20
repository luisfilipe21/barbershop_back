import { google } from "googleapis";
import { ScheduleRepository } from "../schedule/schedule.repository";

const calendar = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

const scheduleRepository = new ScheduleRepository();
export async function createGoogleEvent(start: Date) {
  let end = new Date(start);
  end.setMinutes(start.getMinutes() + 35);

  return await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: "Agendamento",
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
    },
  });
}
