import type { Request, Response } from "express";
import { productService } from "./product.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created, paginated } from "../../utils/http";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const productController = {
  /** GET /api/products */
  index: asyncHandler(async (req: Request, res: Response) => {
    let sellerId = req.query.sellerId as string;
    // Nếu là seller gọi ở phần admin/seller thì thường họ muốn xem của chính họ
    // Tính năng này có thể được điều hướng từ query
    const result = await productService.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      search: req.query.search as string,
      categoryId: req.query.categoryId as string,
      sellerId,
      status: req.query.status as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
    });
    paginated(res, result.products, result.total, result.page, result.limit);
  }),

  /** GET /api/products/:id */
  show: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.findById(req.params.id);
    ok(res, product);
  }),

  /** POST /api/products */
  create: asyncHandler(async (req: Request, res: Response) => {
    let payload = { ...req.body };
    if (req.user?.role === "SELLER") {
      const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
      if (!seller) throw ApiError.forbidden("Không tìm thấy thông tin tài khoản người bán");
      payload.sellerId = seller.id;
    }
    const product = await productService.create(payload);
    created(res, product, "Tạo sản phẩm thành công");
  }),

  /** PATCH /api/products/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.findById(req.params.id);
    if (req.user?.role === "SELLER") {
      const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
      if (product.sellerId !== seller?.id) throw ApiError.forbidden("Bạn không có quyền sửa sản phẩm này");
    }
    const updated = await productService.update(req.params.id, req.body);
    ok(res, updated, "Cập nhật sản phẩm thành công");
  }),

  /** DELETE /api/products/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.remove(req.params.id);
    ok(res, result);
  }),
};
