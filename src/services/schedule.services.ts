import moment from "moment";
import { prisma } from "../config/database";
import { ISchedule } from "../interface/schedule.interfaces";
import { IUserReturn } from "../interface/user.interfaces";
import { AppError, ZodError } from "../errors/AppError";
import { GoogleCalendarService } from "./GoogleCalendarService";

export class ScheduleService {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

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
      throw new ZodError("As datas ou horas fornecidas são inválidas.");
    }

    if (startDateTimeString.isAfter(endDateTimeString)) {
      throw new ZodError(
        "A hora de início não pode ser igual ou posterior à hora de término."
      );
    }

    const startISO = startDateTimeString.toISOString();
    const endISO = endDateTimeString.toISOString();

    const hasConflict =
      await this.googleCalendarService.handleCalendarConflicts(
        userId,
        startISO,
        endISO
      );

    if (hasConflict) {
      throw new ZodError("O horário escolhido conflita com outro agendamento.");
    }

    const schedule = await this.listSchedule(userId);

    schedule.forEach((item) => {
      if (item.date.getDate() === new Date(fullDate).getDate()) {
        if (
          startDateTimeString.isSame(item.startTime) ||
          startDateTimeString.isSame(item.startTime)
        ) {
          throw new ZodError("O horário escolhido já foi agendado.");
        }
      }
    });

    const createDaysOfWork = await prisma.schedule.create({
      data: {
        userId,
        date: new Date(fullDate),
        startTime: new Date(startISO),
        endTime: new Date(endISO),
      },
    });

    try {
      const event =
        await this.googleCalendarService.createCalendarEventForBarber(
          userId,
          "Horário Disponível",
          startISO,
          endISO
        );

      await prisma.schedule.update({
        where: { id: createDaysOfWork.id },
        data: {
          googleEventId: event.id,
        },
      });

      const updated: unknown = prisma.schedule.findUnique({
        where: { id: createDaysOfWork.id },
      });

      return updated as ISchedule;
    } catch (error) {
      await prisma.schedule.delete({ where: { id: createDaysOfWork.id } });
      throw new AppError(500, "Internal server error");
    }
  };

  listSchedule = async (userId: number) => {
    return await prisma.schedule.findMany({
      where: { userId, isAvailable: true },
    });
  };

  listBarberSchedule = async (userId: number) => {
    return await this.googleCalendarService.listCalendarEventsForBarber(userId);
  };

  listBarberScheduleByUser = async (userId: number): Promise<IUserReturn> => {
    const schedule = await prisma.schedule.findMany({
      where: { userId, isAvailable: true },
    });

    const barber = await prisma.user.findFirst({
      where: { id: userId },
    });

    const barberSchedule = {
      name: barber!.name,
      email: barber!.email,
      phone: barber!.phone,
      role: barber!.role,
      Schedule: schedule,
    };

    return barberSchedule;
  };

  updateAvailability = async (userId: number, isAvailable: boolean) => {
    const updateSchedule = await prisma.schedule.update({
      where: { id: userId },
      data: { isAvailable },
    });
    return updateSchedule;
  };

  updateSchedule = async (
    scheduleId: number,
    newDate: string,
    newStart: string,
    newEnd: string
  ) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) throw new Error("Horário não encontrado");

    const barberId = schedule.userId;

    const [dia, mes, ano] = newDate.split("/");
    const fullDate = `${ano}-${mes}-${dia}`;

    const startISO = moment(
      `${fullDate} ${newStart}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();
    const endISO = moment(
      `${fullDate} ${newEnd}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();

    const conflict = await this.googleCalendarService.handleCalendarConflicts(
      barberId,
      startISO,
      endISO
    );

    if (conflict && conflict.id != schedule.googleEventId) {
      throw new ZodError("O horário escolhido conflita com outro agendamento.");
    }

    const updatedEvent = {
      summary: "Horário disponível",
      startISO: startISO,
      endISO: endISO,
    };

    if (schedule.googleEventId) {
      await this.googleCalendarService.updateCalendarEventForBarber(
        barberId,
        schedule.googleEventId,
        updatedEvent
      );
    } else {
      try {
        const event =
          await this.googleCalendarService.createCalendarEventForBarber(
            barberId,
            "Horário Disponível",
            startISO,
            endISO
          );
        await prisma.schedule.update({
          where: { id: scheduleId },
          data: {
            googleEventId: event.id,
          },
        });
      } catch (error) {
        throw new AppError(
          500,
          "Falha ao criar evento no Google Calendar durante update."
        );
      }
    }

    const updatedDatabase = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        date: new Date(fullDate),
        startTime: new Date(startISO),
        endTime: new Date(endISO),
      },
    });

    return updatedDatabase;
  };

  getScheduleTimeClient = async (userId: number): Promise<IUserReturn> => {
    const data = await this.listBarberScheduleByUser(userId);
    return data;
  };

  deleteSchedule = async (scheduleId: number) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) throw new ZodError("Horário não encontrado");

    if (schedule.googleEventId) {
      try {
        await this.googleCalendarService.deleteCalendarEventForBarber(
          schedule.userId,
          schedule.googleEventId
        );
      } catch (error) {
        throw new AppError(500, "Falha ao deletar evento no Google Calendar.");
      }
    }

    await prisma.schedule.delete({
      where: { id: scheduleId },
    });
    return { deleted: true, id: scheduleId };
  };
}
