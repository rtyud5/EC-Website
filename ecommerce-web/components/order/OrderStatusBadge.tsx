import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Đang xử lý", className: "bg-indigo-100 text-indigo-700" },
  SHIPPED: { label: "Đang giao", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Đã giao", className: "bg-teal-100 text-teal-700" },
  COMPLETED: { label: "Hoàn thành", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
  PAID: { label: "Đã thanh toán", className: "bg-green-100 text-green-700" },
  FAILED: { label: "Thất bại", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Hoàn tiền", className: "bg-gray-100 text-gray-700" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
