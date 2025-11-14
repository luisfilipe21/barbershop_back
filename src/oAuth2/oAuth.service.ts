import { google } from 'googleapis';
import { oAuth2Client } from './googleAuth';

export const createCalendarEvent = async (summary: string, start: string, end: string) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary,
    start: { dateTime: start, timeZone: 'America/Sao_Paulo' },
    end: { dateTime: end, timeZone: 'America/Sao_Paulo' },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
};