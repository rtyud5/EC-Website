import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Middleware kiểm tra role (phân quyền).
 * Phải dùng sau authMiddleware.
 */
export function roleMiddleware(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized("Chưa xác thực");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("Bạn không có quyền truy cập tài nguyên này");
    }

    next();
  };
}
