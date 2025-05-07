import { z } from "zod";
import { loginUser, userCreateSchema, userReturnSchema, userSchema, userUpdateSchema } from "../schema/user.schemas";

export type IUser = z.infer<typeof userSchema>;
export type IUserCreate = z.infer<typeof userCreateSchema>;
export type IUserUpdate = z.infer<typeof userUpdateSchema>;
export type IUserReturn = z.infer<typeof userReturnSchema>;


export type ILogin = z.infer<typeof loginUser>
