import { Router } from "express";
import { discountController } from "./discount.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const discountRoutes = Router();

discountRoutes.get("/check/:code", discountController.check); // Public - kiểm tra mã giảm giá
discountRoutes.get("/", authMiddleware, roleMiddleware("ADMIN"), discountController.index);
discountRoutes.post("/", authMiddleware, roleMiddleware("ADMIN"), discountController.create);
discountRoutes.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), discountController.update);
discountRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), discountController.remove);
