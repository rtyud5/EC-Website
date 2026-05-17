"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Discount } from "@/types/discount.type";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = () => {
    api.get("/discounts")
      .then((res) => setDiscounts(res.data.data || []))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa mã giảm giá này?")) return;
    try {
      await api.delete(`/discounts/${id}`);
      fetchDiscounts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
          <p className="text-sm text-gray-500">{discounts.length} mã giảm giá</p>
        </div>
        <Button size="sm">+ Thêm mã giảm giá</Button>
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-gray-200" />)}
        </div>
      ) : discounts.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có mã giảm giá" icon="🏷️" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Giá trị</th>
                <th className="px-4 py-3">Sử dụng</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600">{d.code}</td>
                  <td className="px-4 py-3">{d.type === "PERCENTAGE" ? "Phần trăm" : "Số tiền"}</td>
                  <td className="px-4 py-3 font-medium">{d.type === "PERCENTAGE" ? `${d.value}%` : formatCurrency(d.value)}</td>
                  <td className="px-4 py-3">{d.usedCount}/{d.maxUses || "∞"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(d.startsAt)} → {formatDate(d.endsAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {d.isActive ? "Hoạt động" : "Tắt"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(d.id)} className="text-xs text-red-500 hover:text-red-700">Xóa</button>
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
