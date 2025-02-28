import { google } from "googleapis";

export class GoogleCalendarService {
  async createEvent(summary: string, start: string) {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"]
    );

    const calendar = google.calendar({ version: "v3", auth });

    return await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        start: { dateTime: start, timeZone: "America/Sao_Paulo" },
        end: { dateTime: new Date(new Date(start).getTime() + 35 * 60000).toISOString(), timeZone: "America/Sao_Paulo" },
      },
    });
  }
}