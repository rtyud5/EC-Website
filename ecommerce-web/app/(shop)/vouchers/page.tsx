"use client";

import { useState } from "react";
import { useVouchers } from "@/hooks/useVouchers";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function VouchersPage() {
  const { data: vouchers = [], isLoading } = useVouchers({ isActive: true });
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
      <p className="mt-1 text-sm text-gray-500">Lưu mã và dùng khi thanh toán để được giảm giá</p>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse h-28 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-4xl">🎟️</p>
          <p className="mt-3 text-gray-500">Hiện chưa có mã giảm giá nào</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="relative flex overflow-hidden rounded-xl border border-dashed border-orange-300 bg-white"
            >
              {/* Left badge */}
              <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-orange-500 px-2 py-4 text-white">
                <span className="text-2xl font-extrabold">
                  {v.type === "PERCENTAGE" ? `${v.value}%` : `${Math.round(v.value / 1000)}K`}
                </span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wide opacity-80">
                  Giảm
                </span>
              </div>

              {/* Notch */}
              <div className="absolute left-24 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 -translate-x-1/2 rounded-full bg-gray-100" />
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    Giảm {v.type === "PERCENTAGE" ? `${v.value}%` : formatCurrency(v.value)}
                    {v.type === "PERCENTAGE" && v.maxUses > 0 && " (có giới hạn)"}
                  </p>
                  {v.minOrder && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      Đơn tối thiểu {formatCurrency(v.minOrder)}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-400">
                    HSD: {formatDate(v.endsAt)}
                  </p>
                  {v.maxUses > 0 && (
                    <p className="mt-0.5 text-xs text-orange-400">
                      Còn {v.maxUses - v.usedCount} lượt dùng
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(v.code)}
                  className="rounded-lg border border-orange-400 px-4 py-1.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
                >
                  {copied === v.code ? "Đã sao chép!" : v.code}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
