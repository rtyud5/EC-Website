import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const authController = {
  /** POST /api/auth/register */
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    created(res, result, "Đăng ký thành công");
  }),

  /** POST /api/auth/login */
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ok(res, result, "Đăng nhập thành công");
  }),

  /** GET /api/auth/me */
  getMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    ok(res, user);
  }),
};
