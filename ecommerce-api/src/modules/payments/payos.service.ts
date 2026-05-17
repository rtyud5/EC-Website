import { payosConfig } from "../../config/payos";
import crypto from "crypto";

/**
 * PayOS Service - Cổng thanh toán Việt Nam.
 * Placeholder: khi có PayOS keys thật, tích hợp SDK hoặc REST API tại đây.
 * Docs: https://payos.vn/docs
 */
export const payosService = {
  /** Kiểm tra đã cấu hình PayOS chưa */
  isConfigured(): boolean {
    return Boolean(payosConfig.clientId && payosConfig.apiKey && payosConfig.checksumKey);
  },

  /** Tạo link thanh toán PayOS */
  async createPaymentLink(params: {
    orderCode: number;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
  }) {
    if (!this.isConfigured()) {
      // Trả về mock data khi chưa cấu hình PayOS
      return {
        checkoutUrl: `https://pay.payos.vn/mock?order=${params.orderCode}`,
        paymentLinkId: `mock_${params.orderCode}`,
        status: "PENDING",
        mock: true,
      };
    }

    // TODO: Gọi PayOS API thật
    // const response = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-client-id": payosConfig.clientId,
    //     "x-api-key": payosConfig.apiKey,
    //   },
    //   body: JSON.stringify({
    //     orderCode: params.orderCode,
    //     amount: params.amount,
    //     description: params.description,
    //     returnUrl: params.returnUrl,
    //     cancelUrl: params.cancelUrl,
    //   }),
    // });
    // return response.json();

    return {
      checkoutUrl: `https://pay.payos.vn/mock?order=${params.orderCode}`,
      paymentLinkId: `mock_${params.orderCode}`,
      status: "PENDING",
      mock: true,
    };
  },

  /** Xác thực webhook signature từ PayOS */
  verifyWebhookSignature(payload: Record<string, any>, signature: string): boolean {
    if (!payosConfig.checksumKey) {
      console.warn("[PayOS] Checksum key chưa được cấu hình, bỏ qua verify.");
      return true;
    }

    // TODO: Implement checksum verification theo docs PayOS
    const sortedKeys = Object.keys(payload).sort();
    const dataString = sortedKeys.map((key) => `${key}=${payload[key]}`).join("&");
    const computedSignature = crypto
      .createHmac("sha256", payosConfig.checksumKey)
      .update(dataString)
      .digest("hex");

    return computedSignature === signature;
  },

  /** Xử lý webhook callback từ PayOS */
  async handleWebhook(payload: Record<string, any>) {
    // TODO: Khi tích hợp PayOS thật, parse payload và cập nhật trạng thái order
    console.log("[PayOS Webhook]", JSON.stringify(payload, null, 2));

    return {
      success: true,
      orderCode: payload.orderCode,
      status: payload.code === "00" ? "PAID" : "FAILED",
    };
  },
};
