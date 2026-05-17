import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";

/**
 * Global error handler middleware.
 * Xử lý ApiError, ZodError, Prisma errors, JWT errors.
 */
export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[ERROR] ${error.name}: ${error.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(error.stack);
  }

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

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token đã hết hạn",
    });
  }

  // Prisma known request error (dùng duck typing thay vì import trực tiếp)
  if (error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;
    if (prismaError.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Dữ liệu đã tồn tại (trùng lặp)",
      });
    }
    if (prismaError.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dữ liệu",
      });
    }
  }

  // Prisma client initialization error (database chưa kết nối)
  if (error.name === "PrismaClientInitializationError") {
    return res.status(503).json({
      success: false,
      message: "Không thể kết nối database. Vui lòng thử lại sau.",
    });
  }

  // Lỗi không xác định
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "development"
      ? `Lỗi hệ thống: ${error.message}`
      : "Lỗi hệ thống nội bộ",
  });
}
