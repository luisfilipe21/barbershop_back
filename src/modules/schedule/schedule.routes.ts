import { Router } from "express";
import { ScheduleController } from "./schedule.controllers";

export const routes = Router()
const scheduleController = new ScheduleController();

routes.post("/", scheduleController.create)
routes.get("/:barberId", scheduleController.getBarberSchedule)
routes.patch("/availability", scheduleController.updateAvailability)
