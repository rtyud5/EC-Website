import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const categoryRoutes = Router();

categoryRoutes.get("/", categoryController.index);
categoryRoutes.get("/:id", categoryController.show);
categoryRoutes.post("/", authMiddleware, roleMiddleware("ADMIN"), categoryController.create);
categoryRoutes.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), categoryController.update);
categoryRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), categoryController.remove);
