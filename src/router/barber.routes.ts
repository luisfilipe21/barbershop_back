import { Router } from "express";
import { BarberController } from "../../controllers/barber.controller";

export const barberRouter = Router();
const barberController = new BarberController();

barberRouter.post("/", barberController.create)