import type { Request, Response } from "express";
import { userService } from "./user.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, paginated } from "../../utils/http";

export const userController = {
  /** GET /api/users */
  index: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await userService.list(page, limit);
    paginated(res, result.users, result.total, result.page, result.limit);
  }),

  /** GET /api/users/:id */
  show: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id);
    ok(res, user);
  }),

  /** PATCH /api/users/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);
    ok(res, user, "Cập nhật thành công");
  }),

  /** DELETE /api/users/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.remove(req.params.id);
    ok(res, result);
  }),
};
