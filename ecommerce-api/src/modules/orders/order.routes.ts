import { Router } from "express";
import { orderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.post("/", orderController.create);
orderRoutes.get("/", orderController.index);
orderRoutes.get("/stats", roleMiddleware("ADMIN"), orderController.stats);
orderRoutes.get("/seller-stats", roleMiddleware("SELLER"), orderController.sellerStats);
orderRoutes.get("/:id", orderController.show);
orderRoutes.patch("/:id/status", roleMiddleware("ADMIN", "SELLER"), orderController.updateStatus);
