import { prisma } from "../../config/database";
import { GoogleCalendarService } from "../googleCalendar/GoogleCalendarService";

const googleCalendarService = new GoogleCalendarService();
export class ScheduleService {
  selfSchedule = async (
    barberId: number,
    date: Date,
    time: string
  ) => {
    const availableTime = await prisma.availableTime.findFirst({
      where: { barberId, date: new Date(date), startTime: time },
    });

    if(!availableTime) {
      throw new Error("Esse horário já está preenchido.");
    }

  };

  listScheduleForBarber = async (barberId: number) => {
    return await prisma.schedule.findMany({
      where: { barberId },
      orderBy: { date: "asc" },
    });
  };
}
