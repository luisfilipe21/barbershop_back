import express, { json } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./router/user.routes";
import { handleGlobalErrors } from "./errors/handleErrors";
import { loginRouter } from "./router/login.routes";
import { scheduleRoute } from "./router/schedule.routes";

export const app = express();
dotenv.config();

app.use(helmet());
app.use(json());
app.use(cors());

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/users/schedule", scheduleRoute);

app.use(handleGlobalErrors);
