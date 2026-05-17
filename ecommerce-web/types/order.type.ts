export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: { id: string; name: string; images?: string[] };
};

export type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  note?: string;
  items: OrderItem[];
  user?: { id: string; name: string; email: string };
  createdAt: string;
};
