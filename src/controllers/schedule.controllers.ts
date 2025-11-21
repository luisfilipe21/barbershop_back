import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.services";
import moment from "moment";
import { ISchedule } from "../interface/schedule.interfaces";
import { GoogleCalendarService } from "../services/GoogleCalendarService";
import { scheduleService } from "../services";

export class ScheduleController {
  create = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.decodedAccountData.sub;
      if (!userId) res.status(401).json({ error: "Unauthorized" });

      const { date, startTime, endTime } = req.body;

      if (!date || !startTime || !endTime)
        res.status(400).json({ error: "Bad Request" });

      const schedule = await scheduleService.createSchedule(
        Number(userId),
        date,
        startTime,
        endTime
      );
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  updateAvailability = async (req: Request, res: Response) => {
    const { isAvailable } = req.body;
    const barberId = Number(res.locals.decodedAccountData.sub);
    const updatedSchedule = await scheduleService.updateAvailability(
      barberId,
      isAvailable
    );

    res.status(200).json(updatedSchedule);
  };

  getBarberSchedule = async (req: Request, res: Response) => {
    const barberId = Number(req.params.id);

    const schedule = await scheduleService.listSchedule(barberId);
    const getTimeNow = new Date();
    const timeNow = moment(getTimeNow, "HH:mm:ss").format("HH:mm");
    const isTimeAvailable: ISchedule[] = [];

    schedule.filter((item) => {
      if (
        moment(item.date).format("YYYY/MM/DD") >=
        moment(getTimeNow).format("YYYY/MM/DD")
      ) {
        if (moment(item.startTime, "HH:mm:ss").format("HH:mm") >= timeNow) {
          isTimeAvailable.push(item);
          return;
        }
      }
    });

    const setDateStraight = isTimeAvailable.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );
    res.status(200).json(setDateStraight);
  };

  getBarberScheduleByUser = async (req: Request, res: Response) => {
    const barberId = req.body.userId;
    const fetchBarberSchedule = await scheduleService.listBarberScheduleByUser(
      barberId
    );

    const getTimeNow = new Date();
    const timeNow = moment(getTimeNow, "HH:mm:ss").format("HH:mm");
    const isTimeAvailable: ISchedule[] = [];

    fetchBarberSchedule!.Schedule.filter((item) => {
      if (
        moment(item.date).format("YYYY/MM/DD") >=
        moment(getTimeNow).format("YYYY/MM/DD")
      ) {
        if (moment(item.startTime, "HH:mm:ss").format("HH:mm") >= timeNow) {
          isTimeAvailable.push(item as ISchedule);
          return;
        }
      }
    });

    const setDateStraight = isTimeAvailable.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );

    const updatedBarberSchedule = {
      ...fetchBarberSchedule,
      Schedule: setDateStraight,
    };

    res.status(200).json(updatedBarberSchedule);
  };

  getClientTimeSlot = async (req: Request, res: Response) => {
    const { id } = req.params;
    const barberId = req.body.userId;

    const fetchBarberSchedule =
      await scheduleService.listBarberScheduleByUser(barberId);

    const getTimeNow = new Date();
    const timeNow = moment(getTimeNow, "HH:mm:ss").format("HH:mm");
    const isTimeAvailable: ISchedule[] = [];

    fetchBarberSchedule!.Schedule.filter((item) => {
      if (
        moment(item.date).format("YYYY/MM/DD") >=
        moment(getTimeNow).format("YYYY/MM/DD")
      ) {
        if (moment(item.startTime, "HH:mm:ss").format("HH:mm") >= timeNow) {
          isTimeAvailable.push(item as ISchedule);
          return;
        }
      }
    });

    const setDateStraight = isTimeAvailable.sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );

    const updatedBarberSchedule = {
      ...fetchBarberSchedule,
      Schedule: setDateStraight,
    };

    res.status(200).json(updatedBarberSchedule);
  };
}
