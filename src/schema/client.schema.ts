import { z } from "zod";

export const clientSchema = z.object({
    id: z.number().positive(),
    userid: z.number().positive(),
    name: z.string().min(2).max(100),
    phone: z.string().nullable(),
    email: z.string().email().min(2),
})

export const clientCreateSchema = clientSchema.omit({
    id: true,
})
