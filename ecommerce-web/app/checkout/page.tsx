"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const total = getTotal();

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    note: "",
    discountCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-gray-500">Giỏ hàng trống, không thể thanh toán.</p>
        <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">← Quay lại mua sắm</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // Tạo đơn hàng qua API
      const res = await api.post("/orders", form);
      const order = res.data.data;

      // Tạo link thanh toán PayOS
      try {
        const paymentRes = await api.post("/payments/create", { orderId: order.id });
        const { checkoutUrl, mock } = paymentRes.data.data;

        if (mock) {
          // PayOS chưa cấu hình, chuyển thẳng đến orders
          clearCart();
          router.push(`/orders`);
        } else {
          clearCart();
          window.location.href = checkoutUrl;
        }
      } catch {
        // Nếu tạo payment lỗi, vẫn chuyển đến trang orders
        clearCart();
        router.push(`/orders`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Thông tin nhận hàng</h2>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ tên *</label>
                <input
                  type="text"
                  required
                  value={form.shippingName}
                  onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={form.shippingPhone}
                  onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="0901234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng *</label>
                <textarea
                  required
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã giảm giá</label>
                <input
                  type="text"
                  value={form.discountCode}
                  onChange={(e) => setForm({ ...form, discountCode: e.target.value.toUpperCase() })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="VD: WELCOME10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng ({items.length} sản phẩm)</h3>

            <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="truncate text-gray-600">{item.name} x{item.quantity}</span>
                  <span className="flex-shrink-0 font-medium">{formatCurrency((item.salePrice || item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-xl font-bold text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-indigo-50 p-3">
              <p className="text-xs text-indigo-700">💳 Thanh toán qua PayOS — Cổng thanh toán an toàn tại Việt Nam</p>
            </div>

            <Button type="submit" disabled={loading} className="mt-4 w-full" size="lg">
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
