import { hash } from "bcrypt";
import { prisma } from "../../config/database";
import { IBarber, IBarberCreate, IBarberUpdate } from "./barber.interface";

export class BarberServices {
  create = async (payload: IBarberCreate): Promise<IBarber> => {
    payload.password = await hash(payload.password, 10);

    return await prisma.barber.create({ data: payload });
  };

  findAll = async (): Promise<IBarber[]> => {
    return await prisma.barber.findMany({
      orderBy: {
        id: "asc",
      },
    });
  };

  findOne = async (userId: number): Promise<IBarber> => {
    const foundBarber = await prisma.barber.findFirst({
      where: { id: userId },
    });
    if (!foundBarber) {
      throw new Error();
    }
    return foundBarber;
  };

  updateUser = async (
    userId: number,
    payload: IBarberUpdate
  ): Promise<IBarber | null> => {
    if (payload.password) await hash(payload.password, 10);

    const updateUser = await prisma.barber.update({
      where: { id: Number(userId) },
      data: { ...payload },
    });

    if (!updateUser) {
      throw new Error();
    }
    return updateUser;
  };

  delete = async (userId: number): Promise<void> => {
    const foundUser = await prisma.barber.delete({ where: { id: userId } });
    if (!foundUser) {
      throw new Error();
    }
  };
}
