import { Router } from "express";
import { cartController } from "./cart.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const cartRoutes = Router();

// Tất cả cart routes đều yêu cầu đăng nhập
cartRoutes.use(authMiddleware);

cartRoutes.get("/", cartController.getCart);
cartRoutes.post("/items", cartController.addItem);
cartRoutes.patch("/items/:id", cartController.updateItem);
cartRoutes.delete("/items/:id", cartController.removeItem);
