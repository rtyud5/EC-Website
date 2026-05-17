import type { Request, Response, NextFunction } from "express";

/**
 * Placeholder rate limiter.
 * TODO: Tích hợp Redis để rate limit thật khi cần.
 * Hiện tại dùng in-memory Map đơn giản.
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Quá nhiều request. Vui lòng thử lại sau.",
      });
    }

    record.count++;
    next();
  };
}
