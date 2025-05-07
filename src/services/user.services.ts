import { hash } from "bcrypt";
import { IUser, IUserCreate, IUserUpdate } from "../interface/user.interfaces";
import { prisma } from "../config/database";
import { ConflictError } from "../errors/AppError";

export class UserServices {
  sameEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
  }

  // isUserBarber = async (userid: number, user: ) => {
      //isso vai ser um middleware 
  // }

  create = async (payload: IUserCreate): Promise<IUser> => {
    payload.password = await hash(payload.password, 10);

    const sameEmail = await this.sameEmail(payload.email);
    if(sameEmail) throw new ConflictError("Email already exists");

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
    payload: IUserUpdate
  ): Promise<IUser | null> => {
    if (payload.password) await hash(payload.password, 10);

    const updateUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { ...payload}
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
