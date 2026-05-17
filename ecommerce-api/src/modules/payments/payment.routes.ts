import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const paymentRoutes = Router();

paymentRoutes.post("/create", authMiddleware, paymentController.create);
paymentRoutes.post("/payos-webhook", paymentController.webhook); // PayOS gọi webhook, không cần auth
paymentRoutes.get("/:orderId/status", authMiddleware, paymentController.status);
