import { Router } from "express";
import { getOAuthClient } from "../utils/oAuth2.middleware";
import { OAuthController } from "../controllers/oAuth.controller";

export const authRoutes = Router();

const authController = new OAuthController();

authRoutes.get("/auth-url", authController.redirectToGoogle);
authRoutes.get("/callback", authController.googleCallback);