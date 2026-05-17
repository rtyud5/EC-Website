import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Global error handler middleware.
 * Xử lý ApiError, ZodError, Prisma errors.
 */
export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[ERROR] ${error.name}: ${error.message}`);

  // Custom ApiError
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Zod validation error
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: error.flatten(),
    });
  }

  // Prisma known request error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Dữ liệu đã tồn tại (trùng lặp)",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dữ liệu",
      });
    }
  }

  // Lỗi không xác định
  return res.status(500).json({
    success: false,
    message: "Lỗi hệ thống nội bộ",
  });
}
