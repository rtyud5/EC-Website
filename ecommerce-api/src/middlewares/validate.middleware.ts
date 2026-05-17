import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Middleware validate request data với Zod schema.
 * Validate body, query, params cùng lúc.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: result.error.flatten(),
      });
    }

    next();
  };
}
