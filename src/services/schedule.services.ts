import { prisma } from "../config/database";

export class ScheduleService {
  createSchedule = async (
    userId: number,
    data: string,
    startTime: string,
    endTime: string
  ) => {
    const schedule = await this.listSchedule(userId);

    schedule.map((day) => {
      if (day.date === data && day.startTime == startTime)
        throw new Error("You already have a schedule for that day");
    });

    const daysOfWork = await prisma.schedule.create({
      data: {
        userId,
        date: data,
        startTime,
        endTime,
      },
    });

    return daysOfWork;
  };

  listSchedule = async (userId: number) => {
    return await prisma.schedule.findMany({
      where: { userId, isAvailable: true },
    });
  };

  updateAvailability = async (userId: number, isAvailable: boolean) => {
    const updateSchedule = await prisma.schedule.update({
      where: { id: userId },
      data: { isAvailable },
    });
    return updateSchedule;
  };

  setScheduleTimeClient = async (
    userID: number,
    date: string,
    startTime: string
  ) => {
    const isDate = new Date();
    const dayOfAppointment = await prisma.schedule.findUnique({
      where: { id: userID, date: isDate.toISOString() },
    });
  };
}
