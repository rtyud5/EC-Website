/** Format tiền tệ VND */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

/** Format ngày giờ */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/** Format trạng thái đơn hàng sang tiếng Việt */
export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };
  return map[status] || status;
}

/** Format trạng thái thanh toán sang tiếng Việt */
export function formatPaymentStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thất bại",
    CANCELLED: "Đã hủy",
    REFUNDED: "Đã hoàn tiền",
  };
  return map[status] || status;
}

/** Tạo classNames  */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
