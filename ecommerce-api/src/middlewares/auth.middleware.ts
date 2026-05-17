import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { ApiError } from "../utils/ApiError";

/**
 * Middleware xác thực JWT.
 * Lấy token từ header Authorization: Bearer <token>
 * Gắn user info vào req.user
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Token không hợp lệ hoặc không được cung cấp");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch {
    throw ApiError.unauthorized("Token hết hạn hoặc không hợp lệ");
  }
}
