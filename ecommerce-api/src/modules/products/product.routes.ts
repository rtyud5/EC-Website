import { Router } from "express";
import { productController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.validation";

export const productRoutes = Router();

// Public routes
productRoutes.get("/", productController.index);
productRoutes.get("/:id", productController.show);

// Admin routes
productRoutes.post("/", authMiddleware, roleMiddleware("ADMIN", "SELLER"), validate(createProductSchema), productController.create);
productRoutes.patch("/:id", authMiddleware, roleMiddleware("ADMIN", "SELLER"), productController.update);
productRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), productController.remove);
