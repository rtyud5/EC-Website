"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type Stats = { totalOrders: number; totalProducts: number; totalUsers: number; totalRevenue: number };

const MOCK_STATS: Stats = { totalOrders: 156, totalProducts: 48, totalUsers: 320, totalRevenue: 245000000 };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(MOCK_STATS);

  useEffect(() => {
    api.get("/orders/stats")
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(MOCK_STATS));
  }, []);

  const cards = [
    { label: "Tổng sản phẩm", value: stats.totalProducts, icon: "📦", color: "from-blue-500 to-indigo-600" },
    { label: "Tổng đơn hàng", value: stats.totalOrders, icon: "🛒", color: "from-purple-500 to-pink-600" },
    { label: "Tổng người dùng", value: stats.totalUsers, icon: "👥", color: "from-teal-500 to-emerald-600" },
    { label: "Doanh thu", value: formatCurrency(stats.totalRevenue), icon: "💰", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Tổng quan hệ thống</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
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

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Hệ thống</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>🔗 <strong>API:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}</p>
          <p>💳 <strong>Payment:</strong> PayOS (placeholder)</p>
          <p>🤖 <strong>AI Models:</strong> 5 loại model đã đăng ký</p>
          <p>📦 <strong>Storage:</strong> Cloudinary (placeholder)</p>
        </div>
      </div>
    </div>
  );
}
