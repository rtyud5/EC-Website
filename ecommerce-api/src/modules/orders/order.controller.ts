import type { Request, Response } from "express";
import { orderService } from "./order.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/http";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const orderController = {
  /** POST /api/orders */
  create: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.create(req.user!.id, req.body);
    created(res, order, "Tạo đơn hàng thành công");
  }),

  /** GET /api/orders */
  index: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const asSeller = req.query.asSeller === "true";

    let result;
    if (req.user!.role === "ADMIN") {
      result = await orderService.listAll(page, limit);
    } else if (req.user!.role === "SELLER" && asSeller) {
      const seller = await prisma.seller.findUnique({ where: { userId: req.user!.id } });
      if (!seller) throw ApiError.forbidden("Không tìm thấy thông tin bán hàng");
      result = await orderService.listAll(page, limit, seller.id);
    } else {
      result = await orderService.listByUser(req.user!.id, page, limit);
    }

    paginated(res, result.orders, result.total, result.page, result.limit);
  }),

  /** GET /api/orders/:id */
  show: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.role === "ADMIN" ? undefined : req.user!.id;
    const order = await orderService.findById(req.params.id, userId);
    ok(res, order);
  }),

  /** PATCH /api/orders/:id/status */
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    ok(res, order, "Cập nhật trạng thái thành công");
  }),

  /** GET /api/orders/stats */
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await orderService.getStats();
    ok(res, stats);
  }),

  /** GET /api/orders/seller-stats */
  sellerStats: asyncHandler(async (req: Request, res: Response) => {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user!.id } });
    if (!seller) throw ApiError.forbidden("Bạn không phải người bán");
    const stats = await orderService.getSellerStats(seller.id);
    ok(res, stats);
  }),
};
