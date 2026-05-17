"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} sản phẩm</p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
            Xóa tất cả
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState message="Giỏ hàng trống. Hãy thêm sản phẩm!" icon="🛒" />
          <div className="mt-6 text-center">
            <Link href="/products">
              <Button>Tiếp tục mua sắm</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Tóm tắt đơn hàng</h3>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính ({items.length} sản phẩm)</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-indigo-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full" size="lg">
                  Thanh toán
                </Button>
              </Link>

              <Link href="/products" className="mt-3 block text-center text-sm text-gray-500 hover:text-indigo-600">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
