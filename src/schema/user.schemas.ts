import { z } from "zod";

export const userSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(30),
  password: z.string(),
  phone: z.string().nullish(),
  email: z.string().email(),
  role: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userCreateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const userUpdateSchema = userCreateSchema.partial();
export const userReturnSchema = userCreateSchema.omit({ password: true });
