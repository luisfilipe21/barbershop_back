import { google } from "googleapis";
import { prisma } from "../config/database";
import { getOAuthClient } from "../utils/oAuth2.middleware";

export class CalendarService {
  createBarberCalendarEvent = async (barberId: number) => {
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });

    if (!barber || !barber.googleTokens)
      throw new Error("Barber not connected to Google Calendar");

    const client = getOAuthClient();

    client.setCredentials(barber.googleTokens as any);

    return google.calendar({ version: "v3", auth: client });
  };

  createEvent = async (barberId: number, startISO: string, endISO: string) => {
    const calendar = await this.createBarberCalendarEvent(barberId);

    const response = calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "Agendamento",
        start: { dateTime: startISO, timeZone: "America/Sao_Paulo" },
        end: { dateTime: endISO, timeZone: "America/Sao_Paulo" },
      },
    });
    return response
  };
}
