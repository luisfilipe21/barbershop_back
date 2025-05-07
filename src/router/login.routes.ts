import { Router } from "express";
import { LoginController } from "../controllers/login.controller";

export const loginRouter = Router();
const loginController = new LoginController();

loginRouter.post("/", loginController.login)