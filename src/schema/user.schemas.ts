import { Role } from "@prisma/client";
import { z } from "zod";
import { scheduleSchema } from "./schedule.schema";

export const userSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
  phone: z.string().nullable(),
  email: z.string().email().min(2),
  role: z.nativeEnum(Role).default(Role.CLIENT),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date(),
});

export const userCreateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const userUpdateSchema = userCreateSchema.partial();

export const userReturnSchema = userCreateSchema.omit({ password: true }).extend({Schedule: z.array(scheduleSchema)});

export const loginUser = userCreateSchema.pick({ email: true, password: true });
