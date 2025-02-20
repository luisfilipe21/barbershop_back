import { prisma } from "../../config/database";
import { ISchedule, ITimeSlot } from "./schedule.interfaces";


export class ScheduleRepository {
  async createSchedule(schedule: ISchedule) {
    return prisma.schedule.create({ data: schedule });
  }

  async updateAvailability(scheduleId: number, isAvailable: boolean) {
    return prisma.schedule.update({ where: { id: scheduleId }, data: { isAvailable } });
  }

  async createTimeSlot(timeSlot: ITimeSlot) {
    return prisma.timeSlot.create({ data: timeSlot });
  }

  async getScheduleByBarber(barberId: number) {
    return prisma.schedule.findMany({ where: { barberId }, include: { timeSlots: true } });
  }
}
