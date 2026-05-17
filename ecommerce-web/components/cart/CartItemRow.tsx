"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart.type";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const price = item.salePrice || item.price;
  const imageUrl = item.image || "https://via.placeholder.com/100x100?text=No+Image";

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image src={imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-sm font-medium text-gray-800">{item.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-600">{formatCurrency(price)}</span>
          {item.salePrice && item.salePrice < item.price && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(item.price)}</span>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="hidden w-28 text-right sm:block">
        <span className="text-sm font-bold text-gray-800">{formatCurrency(price * item.quantity)}</span>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.productId)}
        className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
