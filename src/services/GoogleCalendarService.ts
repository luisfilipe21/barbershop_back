import { google } from "googleapis";
import { prisma } from "../config/database";
import { oAuthClientFromTokens } from "../oAuth2/oAuth2.middleware";

export class GoogleCalendarService {
  getAuth = async (barberId: number) => {
    const barber = await prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber || !barber.googleTokens) {
      throw new Error("Barbeiro não conectado ao Google Calendar");
    }

    return oAuthClientFromTokens(barber.googleTokens);
  };

  createCalendarEventForBarber = async (
    barberId: number,
    summary: string,
    startISO: string,
    endISO: string
  ) => {
    const auth = await this.getAuth(barberId);
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary,
      start: { dateTime: startISO, timeZone: "America/Sao_Paulo" },
      end: { dateTime: endISO, timeZone: "America/Sao_Paulo" },
    };

    const created = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return created.data.id;
  };

  updateCalendarEventForBarber = async (
    barberId: number,
    eventId: string,
    update: {
      summary?: string;
      startISO: string;
      endISO: string;
    }
  ) => {
    const auth = await this.getAuth(barberId);
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: update,
    });
    const response = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: update,
    });
    return response.data;
  };

  deleteCalendarEventForBarber = async (barberId: number, eventId: string) => {
    const auth = await this.getAuth(barberId);
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return true;
  };

  listCalendarEventsForBarber = async (barberId: number) => {
    const auth = await this.getAuth(barberId);
    const calendar = google.calendar({ version: "v3", auth });

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });
    return events.data.items || [];
  };

  handleCalendarConflicts = async (
    barberId: number,
    startISO: string,
    endISO: string
  ) => {
    const events = await this.listCalendarEventsForBarber(barberId);

    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();

    for (const event of events) {
      const eventStart = new Date(event.start?.dateTime ?? "").getTime();
      const eventEnd = new Date(event.end?.dateTime ?? "").getTime();

      const hasOverlap = start < eventEnd && end > eventStart;
      if (hasOverlap) return true;
    }
    return false;
  };
}
