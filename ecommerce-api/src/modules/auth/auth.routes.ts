import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.get("/me", authMiddleware, authController.getMe);
