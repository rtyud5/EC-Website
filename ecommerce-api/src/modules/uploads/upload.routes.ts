import { Router } from "express";
import { uploadController } from "./upload.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const uploadRoutes = Router();

// Upload yêu cầu đăng nhập
uploadRoutes.post("/image", authMiddleware, uploadController.uploadImage);
