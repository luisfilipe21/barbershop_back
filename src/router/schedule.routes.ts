import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isBarber, isClient } from "../middlewares/accountRole.middleware";

export const scheduleRoute = Router();
const scheduleController = new ScheduleController();

scheduleRoute.get(
  "/client/:id",
  scheduleController.getBarberScheduleByUser
);

scheduleRoute.get(
  "/:id",
  scheduleController.getBarberSchedule
);

// scheduleRoute.use(authMiddleware, isBarber);
scheduleRoute.patch("/:id/availability", scheduleController.updateAvailability);
scheduleRoute.post("/:id", scheduleController.create);
