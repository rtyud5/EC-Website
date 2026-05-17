import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import { payosService } from "./payos.service";

export const paymentService = {
  /** Tạo payment cho đơn hàng */
  async createPayment(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw ApiError.notFound("Không tìm thấy đơn hàng");
    if (order.paymentStatus === "PAID") throw ApiError.badRequest("Đơn hàng đã thanh toán");

    // Tạo payment link qua PayOS
    const payosResult = await payosService.createPaymentLink({
      orderCode: Date.now(), // Dùng timestamp làm orderCode đơn giản
      amount: Math.round(order.finalAmount),
      description: `Thanh toan don hang #${order.id.slice(-8)}`,
      returnUrl: `${process.env.CORS_ORIGIN || "http://localhost:3000"}/orders/${order.id}`,
      cancelUrl: `${process.env.CORS_ORIGIN || "http://localhost:3000"}/orders/${order.id}`,
    });

    // Lưu payment record
    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        paymentUrl: payosResult.checkoutUrl,
        status: "PENDING",
      },
      create: {
        orderId,
        provider: "PAYOS",
        amount: order.finalAmount,
        paymentUrl: payosResult.checkoutUrl,
        transactionCode: payosResult.paymentLinkId,
      },
    });

    return {
      payment,
      checkoutUrl: payosResult.checkoutUrl,
      mock: (payosResult as any).mock || false,
    };
  },

  /** Xử lý webhook từ PayOS */
  async handleWebhook(payload: Record<string, any>, signature: string) {
    // Verify signature
    const isValid = payosService.verifyWebhookSignature(payload, signature);
    if (!isValid) throw ApiError.badRequest("Webhook signature không hợp lệ");

    const result = await payosService.handleWebhook(payload);

    // Cập nhật trạng thái payment và order
    if (result.orderCode) {
      const payment = await prisma.payment.findFirst({
        where: { transactionCode: String(result.orderCode) },
      });

      if (payment) {
        const newStatus = result.status === "PAID" ? "PAID" : "FAILED";
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: newStatus as any,
            paidAt: newStatus === "PAID" ? new Date() : undefined,
            rawData: payload,
          },
        });

        await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: newStatus as any,
            status: newStatus === "PAID" ? "CONFIRMED" : undefined,
          },
        });
      }
    }

    return { received: true };
  },

  /** Lấy trạng thái payment của đơn hàng */
  async getPaymentStatus(orderId: string) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });
    if (!payment) throw ApiError.notFound("Chưa có thông tin thanh toán");
    return payment;
  },
};
