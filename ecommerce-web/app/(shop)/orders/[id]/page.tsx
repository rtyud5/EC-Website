"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { formatCurrency, formatDate, formatOrderStatus } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-500">Không tìm thấy đơn hàng.</p>
        <Link href="/orders" className="mt-4 inline-block text-orange-500 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/orders" className="text-sm text-orange-500 hover:underline">← Đơn hàng của tôi</Link>
          <h1 className="mt-1 text-xl font-bold text-gray-900">
            Đơn hàng #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Progress Bar */}
      {order.status !== "CANCELLED" && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Trạng thái đơn hàng</h2>
          <div className="relative flex items-center justify-between">
            {/* Line */}
            <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center gap-1">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  i <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] text-center ${i <= currentStep ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                  {formatOrderStatus(step)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Sản phẩm đã đặt</h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => {
            const image = item.product?.images?.[0] || "https://via.placeholder.com/80x80?text=SP";
            return (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  <Image src={image} alt={item.product?.name || ""} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.product?.name || "Sản phẩm"}</p>
                  <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Địa chỉ giao hàng</h2>
          <p className="text-sm font-medium text-gray-800">{order.shippingName}</p>
          <p className="mt-1 text-sm text-gray-500">{order.shippingPhone}</p>
          <p className="mt-1 text-sm text-gray-500">{order.shippingAddress}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Thanh toán</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-orange-500">{formatCurrency(order.finalAmount)}</span>
            </div>
          </div>
          <div className="mt-3">
            <OrderStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Ghi chú</h2>
          <p className="text-sm text-gray-500">{order.note}</p>
        </div>
      )}
    </div>
  );
}
