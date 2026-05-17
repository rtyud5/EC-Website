import type { Request, Response } from "express";
import { categoryService } from "./category.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const categoryController = {
  /** GET /api/categories */
  index: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.list();
    ok(res, categories);
  }),

  /** GET /api/categories/:id */
  show: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.findById(req.params.id);
    ok(res, category);
  }),

  /** POST /api/categories */
  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.body);
    created(res, category, "Tạo danh mục thành công");
  }),

  /** PATCH /api/categories/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.update(req.params.id, req.body);
    ok(res, category, "Cập nhật danh mục thành công");
  }),

  /** DELETE /api/categories/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.remove(req.params.id);
    ok(res, result);
  }),
};
