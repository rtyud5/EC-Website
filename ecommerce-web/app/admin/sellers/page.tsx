"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/common/Button";

type Seller = {
  id: string;
  userId: string;
  shopName: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  createdAt: string;
  user: { name: string; email: string };
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = () => {
    api.get("/sellers")
      .then((res) => setSellers(res.data.data || []))
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Bạn chắc chắn muốn đổi trạng thái thành ${status}?`)) return;
    try {
      await api.patch(`/sellers/${id}`, { status });
      fetchSellers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quản lý Shop (Sellers)</h1>
      <p className="text-sm text-gray-500">{sellers.length} cửa hàng đăng ký</p>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-200" />)}
        </div>
      ) : sellers.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có cửa hàng nào đăng ký" icon="🏪" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Cửa hàng</th>
                <th className="px-4 py-3">Người đăng ký</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {seller.shopName}
                    <div className="text-xs font-normal text-gray-500">{seller.description || "Không có mô tả"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{seller.user.name}</div>
                    <div className="text-xs text-gray-500">{seller.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      seller.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      seller.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>{seller.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(seller.createdAt)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {seller.status !== "APPROVED" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(seller.id, "APPROVED")}>Duyệt</Button>
                    )}
                    {seller.status !== "SUSPENDED" && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(seller.id, "SUSPENDED")}>Khoá</Button>
                    )}
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
