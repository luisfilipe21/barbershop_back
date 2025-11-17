import { google } from "googleapis";
import { prisma } from "../config/database";
import { oAuthClientFromTokens } from "../oAuth2/oAuth2.middleware";

type CalendarEventItem = {
  id: string;
  summary?: string;
  start: { dateTime?: string } | null;
  end: { dateTime?: string } | null;
};

export class GoogleCalendarService {
  private calendar = google.calendar({ version: "v3", auth: this.auth });

  constructor(private readonly calendarId: string, private readonly auth: any) {
    this.calendar = google.calendar({ version: "v3", auth });
  }

  getAuth = async (barberId: number) => {
    const barber = await prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber || !barber.googleTokens) {
      throw new Error("Barbeiro não conectado ao Google Calendar");
    }

    const auth = oAuthClientFromTokens(barber.googleTokens as any);
    this.calendar = google.calendar({ version: "v3", auth });

    return auth;
  };

  listCalendarEventsForBarberBetween = async (
    barberId: number,
    timeMinISO: string,
    timeMaxISO: string
  ) => {
    await this.getAuth(barberId);

    const events = await this.calendar.events.list({
      calendarId: this.calendarId,
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });
    return (events.data.items || []) as CalendarEventItem[];
  };

  listCalendarEventsForBarber = async (barberId: number) => {
    const now = new Date().toISOString();
    const in30days = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365
    ).toISOString();
    return this.listCalendarEventsForBarberBetween(barberId, now, in30days);
  };

  createCalendarEventForBarber = async (
    barberId: number,
    summary: string,
    startISO: string,
    endISO: string
  ) => {
    await this.getAuth(barberId);

    const event = {
      summary,
      start: { dateTime: startISO, timeZone: "America/Sao_Paulo" },
      end: { dateTime: endISO, timeZone: "America/Sao_Paulo" },
    };

    const created = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
    });

    return created.data;
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
    await this.getAuth(barberId);

    const response = await this.calendar.events.patch({
      calendarId: this.calendarId,
      eventId,
      requestBody: update,
    });
    return response.data;
  };

  deleteCalendarEventForBarber = async (barberId: number, eventId: string) => {
    await this.getAuth(barberId);

    await this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId,
    });

    return true;
  };

  handleCalendarConflicts = async (
    barberId: number,
    startISO: string,
    endISO: string
  ) => {
    const timeMin = new Date(
      new Date(startISO).setHours(0, 0, 0, 0)
    ).toISOString();
    const timeMax = new Date(
      new Date(endISO).setHours(23, 59, 59, 999)
    ).toISOString();

    const events = await this.listCalendarEventsForBarberBetween(
      barberId,
      timeMin,
      timeMax
    );

    const start = new Date(startISO).getTime();
    const end = new Date(endISO).getTime();

    for (const ev of events) {
      const evStart = ev.start?.dateTime
        ? new Date(ev.start.dateTime).getTime()
        : null;
      const evEnd = ev.end?.dateTime
        ? new Date(ev.end.dateTime).getTime()
        : null;
      if (!evStart || !evEnd) continue;

      const overlap = start < evEnd && end > evStart;
      if (overlap) {
        return {
          id: ev.id,
          summary: ev.summary,
          start: ev.start?.dateTime,
          end: ev.end?.dateTime,
        };
      }
    }
    return null;
  };
}
