import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin, isBarber } from "../middlewares/accountRole.middleware";

export const userRouter = Router();

const userController = new UserController();

userRouter.post("/", userController.create);
userRouter.get("/", userController.findAll);
userRouter.get("/:id", userController.findOne);

// userRouter.use(authMiddleware);
userRouter.patch("/:id", isBarber, userController.update);

userRouter.delete("/:id", isBarber, userController.delete);
