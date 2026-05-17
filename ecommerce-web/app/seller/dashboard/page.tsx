"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type Stats = { totalOrders: number; totalProducts: number; totalRevenue: number };

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalProducts: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/seller-stats")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error("Lỗi lấy thống kê", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Sản phẩm của Shop", value: stats.totalProducts, icon: "📦", color: "from-blue-500 to-indigo-600" },
    { label: "Đơn hàng", value: stats.totalOrders, icon: "🛒", color: "from-purple-500 to-pink-600" },
    { label: "Doanh thu tạm tính", value: formatCurrency(stats.totalRevenue), icon: "💰", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Tổng quan Shop</h1>
      <p className="mt-1 text-sm text-gray-500">Thống kê hoạt động kinh doanh của bạn</p>

      {loading ? (
        <div className="mt-6 animate-pulse grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl bg-gray-200" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className={`bg-gradient-to-r ${card.color} p-4`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900">👋 Chào mừng bạn đến với Kênh Người Bán!</h3>
        <p className="mt-2 text-sm text-blue-800">
          Đây là không gian quản lý của riêng bạn. Hãy bắt đầu bằng cách thêm sản phẩm mới vào gian hàng để khách hàng có thể nhìn thấy nhé!
        </p>
      </div>
    </div>
  );
}
