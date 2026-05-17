import type { Request, Response } from "express";
import { cartService } from "./cart.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const cartController = {
  /** GET /api/cart */
  getCart: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.id);
    ok(res, cart);
  }),

  /** POST /api/cart/items */
  addItem: asyncHandler(async (req: Request, res: Response) => {
    const item = await cartService.addItem(req.user!.id, req.body);
    created(res, item, "Đã thêm vào giỏ hàng");
  }),

  /** PATCH /api/cart/items/:id */
  updateItem: asyncHandler(async (req: Request, res: Response) => {
    const item = await cartService.updateItem(req.user!.id, req.params.id, req.body.quantity);
    ok(res, item, "Cập nhật giỏ hàng thành công");
  }),

  /** DELETE /api/cart/items/:id */
  removeItem: asyncHandler(async (req: Request, res: Response) => {
    const result = await cartService.removeItem(req.user!.id, req.params.id);
    ok(res, result);
  }),
};
