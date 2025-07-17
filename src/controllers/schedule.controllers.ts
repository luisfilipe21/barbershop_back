import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.services";
import moment from "moment";
import { ISchedule } from "../interface/schedule.interfaces";

export class ScheduleController {
  private scheduleService = new ScheduleService();

  create = async (req: Request, res: Response) => {
    const userId = res.locals.decodedAccountData.sub;

    if (!userId) res.status(401).json({ error: "Unauthorized" });

    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime)
      res.status(400).json({ error: "Bad Request" });

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
    const barberId = Number(req.params.id);

    const schedule = await this.scheduleService.listSchedule(barberId);

    const getTimeNow = new Date();
    const timeNow = moment(getTimeNow, "HH:mm:ss").format("HH:mm");
    const isTimeAvailable: ISchedule[] = [];

    schedule.sort((a, b) => {
      const dataA = moment(a.date, "DD/MM/YYYY");
      const dataB = moment(b.date, "DD/MM/YYYY");

      if (dataA.isAfter(dataB)) return 1;
      if (dataA.isBefore(dataB)) return -1;
      return 0;
    });

    schedule.map((item) => {
      if (
        moment(item.date).format("DD/MM/YYYY") >=
        moment(getTimeNow).format("DD/MM/YYYY")
      )
        isTimeAvailable.push(item);
      {
        if (moment(item.startTime, "HH:mm:ss").format("HH:mm") >= timeNow) {
          isTimeAvailable.push(item);
        } else {
          return null;
        }
      }
    });

    res.status(200).json(isTimeAvailable);
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
