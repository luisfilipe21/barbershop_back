import { Request, Response } from "express";
import { google } from "googleapis";
import { prisma } from "../config/database";
import { getGoogleOAuthClient } from "../utils/googleClient";

export class CalendarController {
  constructor() {
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  async getAuthClientForBarber(barberId: number) {
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber || !barber.googleTokens)
      throw new Error("Barber not connected to Google");

    const client = getGoogleOAuthClient();

    (client as any).on &&
      (client as any).on("tokens", async (tokens: any) => {
        await prisma.barber.update({
          where: { id: barberId },
          data: {
            googleTokens: { ...(barber.googleTokens as any), ...tokens },
          },
        });
      });

    return client;
  }

  createEvent = async (req: Request, res: Response) => {
    try {
      const { barberId, summary, startISO, endISO } = req.body;
      if (!barberId || !summary || !startISO || !endISO) {
        return res.status(400).send("Missing fields");
      }

      const auth = await this.getAuthClientForBarber(barberId);
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

      res.status(201).json(created.data);
    } catch (err: any) {
      console.error(err);
      res.status(500).send(err.message || "Error creating event");
    }
  }

  updateEvent = async (req: Request, res: Response) => {
    try {
      const { barberId, eventId, summary, startISO, endISO } = req.body;
      if (!barberId || !eventId) return res.status(400).send("Missing fields");

      const auth = await this.getAuthClientForBarber(barberId);
      const calendar = google.calendar({ version: "v3", auth });

      const response = await calendar.events.update({
        calendarId: "primary",
        eventId,
        requestBody: {
          summary,
          start: startISO
            ? { dateTime: startISO, timeZone: "America/Sao_Paulo" }
            : undefined,
          end: endISO
            ? { dateTime: endISO, timeZone: "America/Sao_Paulo" }
            : undefined,
        },
      });

      res.status(200).json(response.data);
    } catch (err: any) {
      console.error(err);
      res.status(500).send(err.message || "Error updating event");
    }
  }

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { barberId, eventId } = req.body;
      if (!barberId || !eventId) return res.status(400).send("Missing fields");

      const auth = await this.getAuthClientForBarber(barberId);
      const calendar = google.calendar({ version: "v3", auth });

      await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });

      res.sendStatus(204);
    } catch (err: any) {
      console.error(err);
      res.status(500).send(err.message || "Error deleting event");
    }
  }
}
