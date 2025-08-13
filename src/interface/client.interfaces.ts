import { z } from "zod";
import { clientSchema } from "../schema/client.schema";

export type IClient = z.infer<typeof clientSchema>;