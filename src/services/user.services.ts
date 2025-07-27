import { hash } from "bcrypt";
import {
  IUser,
  IUserCreate,
  IUserReturn,
  IUserUpdate,
} from "../interface/user.interfaces";
import { prisma } from "../config/database";
import { ConflictError } from "../errors/AppError";
import { userReturnSchema } from "../schema/user.schemas";

export class UserServices {
  sameEmail = async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
      include: { Schedule: true },
    });
  };

  create = async (payload: IUserCreate): Promise<IUser> => {
    payload.password = await hash(payload.password, 10);

    const sameEmail = await this.sameEmail(payload.email);
    if (sameEmail) throw new ConflictError("Email already exists");

    return await prisma.user.create({ data: payload });
  };

  findAll = async (): Promise<IUser[]> => {
    return await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  };

  findOne = async (userId: number): Promise<IUserReturn> => {
    const foundUser = await prisma.user.findFirst({
      where: { id: userId },
      include: { Schedule: true },
    })
    if (!foundUser) {
      throw new Error();
    }
    
    const parsedUser = userReturnSchema.parse(foundUser);
    return parsedUser;
  };

  updateUser = async (
    userId: number,
    payload: IUserUpdate
  ): Promise<IUser | null> => {
    if (payload.password) await hash(payload.password, 10);

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
