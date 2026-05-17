import type { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";

export const paymentController = {
  /** POST /api/payments/create */
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.createPayment(req.user!.id, req.body.orderId);
    created(res, result, "Tạo link thanh toán thành công");
  }),

  /** POST /api/payments/payos-webhook */
  webhook: asyncHandler(async (req: Request, res: Response) => {
    const signature = (req.headers["x-payos-signature"] as string) || "";
    const result = await paymentService.handleWebhook(req.body, signature);
    ok(res, result);
  }),

  /** GET /api/payments/:orderId/status */
  status: asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentService.getPaymentStatus(req.params.orderId);
    ok(res, payment);
  }),
};
