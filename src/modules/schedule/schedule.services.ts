import { ISchedule, ITimeSlot } from "./schedule.interfaces";
import { ScheduleRepository } from "./schedule.repository";

export class ScheduleService {
    private scheduleRepository = new ScheduleRepository();
  
    async createSchedule(schedule: ISchedule, timeSlots: ITimeSlot[]) {
      const createdSchedule = await this.scheduleRepository.createSchedule(schedule);
      for (const slot of timeSlots) {
        slot.scheduleId = createdSchedule.id!;
        await this.scheduleRepository.createTimeSlot(slot);
      }
      return createdSchedule;
    }
  
    async updateAvailability(scheduleId: number, isAvailable: boolean) {
      return await this.scheduleRepository.updateAvailability(scheduleId, isAvailable);
    }
  
    async getBarberSchedule(barberId: number) {
      return await this.scheduleRepository.getScheduleByBarber(barberId);
    }
  }