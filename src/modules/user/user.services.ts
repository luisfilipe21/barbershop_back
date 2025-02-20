import { prisma } from "../../config/database";
import { IUpdateUser, IUser, IUserCreate } from "./user.interfaces";

export class UserServices {
  create = async (payload: IUserCreate): Promise<IUser> => {
    return await prisma.user.create({ data: payload });
  };

  findAll = async (): Promise<IUser[]> => {
    return await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  };

  findOne = async (userId: number): Promise<IUser> => {
    const foundUser = await prisma.user.findFirst({ where: { id: userId } });
    if (!foundUser) {
      throw new Error();
    }
    return foundUser;
  };

  updateUser = async (
    userId: number,
    payload: IUpdateUser
  ): Promise<IUser | null> => {
    const updateUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { ...payload },
    });

    if (!updateUser) {
      throw new Error();
    }
    return updateUser;
  };

  delete = async (userId: number): Promise<void> => {
    const foundUser = await prisma.user.delete({ where: { id: userId } });
    if (!foundUser) {
      throw new Error();
    }
  };
}
