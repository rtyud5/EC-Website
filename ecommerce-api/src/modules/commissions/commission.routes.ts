import { Router } from "express";
import { commissionController } from "./commission.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const commissionRoutes = Router();

commissionRoutes.use(authMiddleware, roleMiddleware("ADMIN"));

commissionRoutes.get("/", commissionController.index);
commissionRoutes.post("/", commissionController.create);
commissionRoutes.patch("/:id", commissionController.update);
commissionRoutes.delete("/:id", commissionController.remove);
