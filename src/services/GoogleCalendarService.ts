import { google } from "googleapis";
import { prisma } from "../config/database";
import { getGoogleOAuthClient } from "../utils/googleClient";

type CalendarEventItem = {
  id: string;
  summary?: string;
  start: { dateTime?: string } | null;
  end: { dateTime?: string } | null;
};

export class GoogleCalendarService {
  private calendarClientForAuth = (auth: any) => {
    return google.calendar({ version: "v3", auth: auth });
  };

  getAuth = async (barberId: number) => {
    const barber = await prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber || !barber.googleTokens) {
      throw new Error("Barbeiro não conectado ao Google Calendar");
    }

    const client = getGoogleOAuthClient();
    client.setCredentials(barber.googleTokens as any);
    return client;
  };

  listCalendarEventsForBarberBetween = async (
    barberId: number,
    timeMinISO: string,
    timeMaxISO: string
  ) => {
    const auth = await this.getAuth(barberId);
    const calendar = this.calendarClientForAuth(auth);

    const events = await calendar.events.list({
      calendarId: "primary",
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
    const auth = await this.getAuth(barberId);
    const calendar = this.calendarClientForAuth(auth);

    const event = {
      summary,
      start: { dateTime: startISO, timeZone: "America/Sao_Paulo" },
      end: { dateTime: endISO, timeZone: "America/Sao_Paulo" },
    };

    const created = await calendar.events.insert({
      calendarId: "primary",
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
    const auth = await this.getAuth(barberId);
    const calendar = this.calendarClientForAuth(auth);

    const requestBody: any = {};
    if (update.summary !== undefined) requestBody.summary = update.summary;
    if (update.startISO)
      requestBody.start = {
        dateTime: update.startISO,
        timeZone: "America/Sao_Paulo",
      };
    if (update.endISO)
      requestBody.end = {
        dateTime: update.endISO,
        timeZone: "America/Sao_Paulo",
      };

    const response = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      requestBody: update,
    });
    return response.data;
  };

  deleteCalendarEventForBarber = async (barberId: number, eventId: string) => {
    const auth = await this.getAuth(barberId);
    const calendar = this.calendarClientForAuth(auth);

    await calendar.events.delete({
      calendarId: "primary",
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
