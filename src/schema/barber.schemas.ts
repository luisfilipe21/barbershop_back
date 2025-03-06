import { z } from "zod";

export const barberSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(30),
  password: z.string(),
  email: z.string().email(),
  phone: z.string().nullish(),

  createdAt: z.date(),
  updatedAt: z.date(),

  schedule: z.string().nullish(),
  availableTime: z.string().nullish(),
});

export const barberCreateSchema = barberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const userUpdateSchema = barberCreateSchema.partial();
export const userReturnSchema = barberCreateSchema.omit({ password: true });
