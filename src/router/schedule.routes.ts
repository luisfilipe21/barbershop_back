import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isBarber } from "../middlewares/accountRole.middleware";

export const scheduleRoute = Router()
const scheduleController = new ScheduleController();

scheduleRoute.get("/:barberId", scheduleController.getBarberSchedule)

scheduleRoute.use(authMiddleware, isBarber)
scheduleRoute.patch("/:barberId/availability", scheduleController.updateAvailability)
scheduleRoute.post("/:barberId", scheduleController.create)