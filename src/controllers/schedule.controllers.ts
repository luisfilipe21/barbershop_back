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

    schedule.filter((item) => {
      if (moment(item.date).format("DD/MM/YYYY") >= moment(getTimeNow).format("DD/MM/YYYY")){
        // isTimeAvailable.push(item);
        if (moment(item.startTime, "HH:mm:ss").format("HH:mm") >= timeNow) {
          isTimeAvailable.push(item);
          return
        }
      }
    });

    const setDateStraight = isTimeAvailable.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );

    // const setTimeStraight = setDateStraight.sort(
    //   (a, b) => moment(b.startTime).valueOf() - moment(a.startTime).valueOf()
    // );

    res.status(200).json(setDateStraight);
  };

}
