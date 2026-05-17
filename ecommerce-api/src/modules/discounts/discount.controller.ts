import type { Request, Response } from "express";
import { discountService } from "./discount.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const discountController = {
  /** GET /api/discounts */
  index: asyncHandler(async (_req: Request, res: Response) => {
    const discounts = await discountService.list();
    ok(res, discounts);
  }),

  /** GET /api/discounts/check/:code */
  check: asyncHandler(async (req: Request, res: Response) => {
    const discount = await discountService.findByCode(req.params.code);
    ok(res, discount);
  }),

  /** POST /api/discounts */
  create: asyncHandler(async (req: Request, res: Response) => {
    const discount = await discountService.create(req.body);
    created(res, discount, "Tạo mã giảm giá thành công");
  }),

  /** PATCH /api/discounts/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const discount = await discountService.update(req.params.id, req.body);
    ok(res, discount, "Cập nhật thành công");
  }),

  /** DELETE /api/discounts/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await discountService.remove(req.params.id);
    ok(res, result);
  }),
};
