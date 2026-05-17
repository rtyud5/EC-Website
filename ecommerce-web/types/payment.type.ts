export type PaymentProvider = "PAYOS" | "COD";

export type Payment = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  transactionCode?: string;
  paymentUrl?: string;
  paidAt?: string;
};
