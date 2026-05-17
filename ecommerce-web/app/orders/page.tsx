"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Order } from "@/types/order.type";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) return;

    api.get("/orders")
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem đơn hàng.</p>
        <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">Đăng nhập</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="mt-3 h-3 w-1/2 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="Chưa có đơn hàng nào" icon="📋" />
          <div className="mt-6 text-center">
            <Link href="/products" className="text-indigo-600 hover:underline">Bắt đầu mua sắm →</Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-sm text-gray-500">Đơn hàng #{order.id.slice(-8).toUpperCase()}</span>
                  <span className="ml-2 text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  <OrderStatusBadge status={order.status} />
                  <OrderStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              {/* Items */}
              <div className="mt-3 space-y-1">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product?.name || "Sản phẩm"} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <span className="text-xs text-gray-400">+{order.items.length - 3} sản phẩm khác</span>
                )}
              </div>

              {/* Total */}
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm text-gray-500">Tổng thanh toán</span>
                <span className="text-lg font-bold text-indigo-600">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
