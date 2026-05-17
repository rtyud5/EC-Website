import { Router } from "express";
import { sellerController } from "./seller.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

export const sellerRoutes = Router();

sellerRoutes.get("/", authMiddleware, roleMiddleware("ADMIN"), sellerController.index);
sellerRoutes.get("/:id", authMiddleware, sellerController.show);
sellerRoutes.post("/register", authMiddleware, sellerController.register);
sellerRoutes.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), sellerController.update);
sellerRoutes.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), sellerController.remove);
