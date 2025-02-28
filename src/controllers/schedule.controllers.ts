import { Request, Response } from "express";
import { ScheduleService } from "./schedule.services";

export class ScheduleController {
  private scheduleService = new ScheduleService();

  create = async (req: Request, res: Response) => {
    const { barberId, date, timeSlots } = req.body;
    const schedule = await this.scheduleService.createSchedule(
      { barberId, date },
      timeSlots
    );
    res.status(201).json(schedule);
  };

  updateAvailability = async (req: Request, res: Response) => {
    const { scheduleId, isAvailable } = req.body;
    const updatedSchedule = await this.scheduleService.updateAvailability(
      scheduleId,
      isAvailable
    );
    res.status(200).json(updatedSchedule);
  };

  getBarberSchedule = async (req: Request, res: Response) => {
    const barberId = Number(req.params.barberId);
    const schedule = await this.scheduleService.getBarberSchedule(barberId);
    res.status(200).json(schedule);
  };
}
