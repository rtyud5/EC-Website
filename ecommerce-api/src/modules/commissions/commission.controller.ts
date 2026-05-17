import type { Request, Response } from "express";
import { commissionService } from "./commission.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/http";

export const commissionController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await commissionService.list(page, limit, req.query.sellerId as string);
    paginated(res, result.commissions, result.total, result.page, result.limit);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const commission = await commissionService.create(req.body);
    created(res, commission, "Tạo commission thành công");
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const commission = await commissionService.update(req.params.id, req.body);
    ok(res, commission, "Cập nhật commission thành công");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await commissionService.remove(req.params.id);
    ok(res, result);
  }),
};
