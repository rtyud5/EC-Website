import type { Request, Response, NextFunction } from "express";

/**
 * Wrapper cho async route handlers.
 * Tự động catch error và forward tới error middleware.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
