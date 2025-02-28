import { prisma } from "../config/database";

export class AvailableTimeService {
  
  listAllAvailableTime = async (barberId: number, date: string) => {
    return await prisma.availableTime.findMany({
      where: { barberId, date: new Date(date) },
    });
  };

  setAvailableTime = async (
    barberId: number,
    date: string,
    startTime: string,
    endTime: string) => {



    return await prisma.availableTime.create({
        data: { barberId, date: new Date(date), startTime, endTime },
      });
  }
}
