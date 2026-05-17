import type { Request, Response } from "express";
import { aiService } from "./ai.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const aiController = {
  /** GET /api/ai-models */
  index: asyncHandler(async (_req: Request, res: Response) => {
    const models = await aiService.list();
    ok(res, models);
  }),

  /** GET /api/ai-models/types */
  types: asyncHandler(async (_req: Request, res: Response) => {
    const types = aiService.getModelTypes();
    ok(res, types);
  }),

  /** GET /api/ai-models/:id */
  show: asyncHandler(async (req: Request, res: Response) => {
    const model = await aiService.findById(req.params.id);
    ok(res, model);
  }),

  /** POST /api/ai-models */
  create: asyncHandler(async (req: Request, res: Response) => {
    const model = await aiService.create(req.body);
    created(res, model, "Tạo AI model thành công");
  }),

  /** PATCH /api/ai-models/:id */
  update: asyncHandler(async (req: Request, res: Response) => {
    const model = await aiService.update(req.params.id, req.body);
    ok(res, model, "Cập nhật AI model thành công");
  }),

  /** DELETE /api/ai-models/:id */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const result = await aiService.remove(req.params.id);
    ok(res, result);
  }),
};
