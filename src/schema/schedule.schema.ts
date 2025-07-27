import { z } from "zod";

export const scheduleSchema = z.object({
  id: z.number().nullish(),
  userId: z.number().nullish(),
  date: z.date().nullish(),
  startTime: z.date().nullish(),
  endTime: z.date().nullish(),
  isAvailable: z.boolean().nullish(),
});

export const returnScheduleSchema = scheduleSchema.omit({endTime: true})