import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.services";

export class ScheduleController {
  private scheduleService = new ScheduleService();

  create = async (req: Request, res: Response) => {
    const userId = res.locals.decodedAccountData.sub;

    const {  date, startTime, endTime } = req.body;
    const schedule = await this.scheduleService.createSchedule(
      Number(userId),
      date,
      startTime,
      endTime
    );
    res.status(201).json(schedule);
  };

  updateAvailability = async (req: Request, res: Response) => {
    const { isAvailable } = req.body;
    const barberId = Number(res.locals.decodedAccountData.sub);
    const updatedSchedule = await this.scheduleService.updateAvailability(
      barberId,
      isAvailable
    );
    res.status(200).json(updatedSchedule);
  };

  getBarberSchedule = async (req: Request, res: Response) => {
    // const barberId = Number(res.locals.decodedAccountData.sub);
    const barberId = Number(req.params.id);

    const schedule = await this.scheduleService.listSchedule(barberId);
    res.status(200).json(schedule);
  };

  // Fazer depois do frontend
  // setScheduleTimeClient = async (req: Request, res: Response) => {
  //   const {sub: barberId, date: barberScheduleDate} = res.locals.decodedAccountData;

  //   const timeSelected = barberScheduleDate.startingTime;
  //   const daySelected = barberScheduleDate.date;
   
  //   // Fazer com que os dados selecionados venham da tabela do schedule por meio do .map() 

  //   const reservedTime = await this.scheduleService.setScheduleTimeClient(barberId, daySelected, timeSelected);
  //   res.status(201).json(reservedTime)
  // }
}
