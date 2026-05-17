import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const userRoutes = Router();

userRoutes.get("/", authMiddleware, roleMiddleware("ADMIN"), userController.index);
userRoutes.get("/:id", authMiddleware, userController.show);
userRoutes.patch("/:id", authMiddleware, userController.update);
userRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), userController.remove);
