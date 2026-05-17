import { Router } from "express";
import { aiController } from "./ai.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const aiRoutes = Router();

aiRoutes.get("/", authMiddleware, roleMiddleware("ADMIN"), aiController.index);
aiRoutes.get("/types", authMiddleware, roleMiddleware("ADMIN"), aiController.types);
aiRoutes.get("/:id", authMiddleware, roleMiddleware("ADMIN"), aiController.show);
aiRoutes.post("/", authMiddleware, roleMiddleware("ADMIN"), aiController.create);
aiRoutes.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), aiController.update);
aiRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), aiController.remove);
