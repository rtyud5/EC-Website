"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import type { Order } from "@/types/order.type";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get("/orders?limit=50")
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
      <p className="text-sm text-gray-500">{orders.length} đơn hàng</p>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-gray-200" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có đơn hàng" icon="🛒" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(order.finalAmount)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
