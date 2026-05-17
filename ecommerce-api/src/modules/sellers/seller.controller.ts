import type { Request, Response } from "express";
import { sellerService } from "./seller.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/http";

export const sellerController = {
  index: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await sellerService.list(page, limit);
    paginated(res, result.sellers, result.total, result.page, result.limit);
  }),

  show: asyncHandler(async (req: Request, res: Response) => {
    const seller = await sellerService.findById(req.params.id);
    ok(res, seller);
  }),

  register: asyncHandler(async (req: Request, res: Response) => {
    const seller = await sellerService.register(req.user!.id, req.body);
    created(res, seller, "Đăng ký seller thành công, chờ duyệt");
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const seller = await sellerService.update(req.params.id, req.body);
    ok(res, seller, "Cập nhật seller thành công");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await sellerService.remove(req.params.id);
    ok(res, result);
  }),
};
