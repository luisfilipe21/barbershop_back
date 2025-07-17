import moment from "moment";
import { prisma } from "../config/database";
import { ISchedule } from "../interface/schedule.interfaces";

export class ScheduleService {
  createSchedule = async (
    userId: number,
    data: string,
    startTime: string,
    endTime: string
  ): Promise<ISchedule> => {
    const [dia, mes, ano] = data.split("/");
    const fullDate = `${ano}-${mes}-${dia}`;

    const startDateTimeString = moment(
      `${fullDate} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endDateTimeString = moment(
      `${fullDate} ${endTime}`,
      "YYYY-MM-DD HH:mm"
    );

    if (!startDateTimeString.isValid() || !endDateTimeString.isValid()) {
      throw new Error("As datas ou horas fornecidas são inválidas.");
    }

    if (!startDateTimeString || !endDateTimeString) {
      throw new Error("As datas ou horas fornecidas são inválidas. 2");
    }

    if (startDateTimeString.isAfter(endDateTimeString)) {
      throw new Error(
        "A hora de início não pode ser igual ou posterior à hora de término."
      );
    }

    const schedule = await this.listSchedule(userId);

    schedule.forEach((item) => {
      if (item.date.getDate() === new Date(fullDate).getDate()) {
        if (
          startDateTimeString.isSame(item.startTime) ||
          startDateTimeString.isSame(item.startTime)
        ) {
          throw new Error("O horário escolhido já foi agendado.");
        }
      }
    });

    const daysOfWork = await prisma.schedule.create({
      data: {
        userId,
        date: new Date(fullDate),
        startTime: new Date(startDateTimeString.toISOString()),
        endTime: new  Date(endDateTimeString.toString()),
      },
    });
    console.log(daysOfWork)
    // return daysOfWork;
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
