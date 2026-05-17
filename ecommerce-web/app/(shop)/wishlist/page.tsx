"use client";

import { useWishlistStore } from "@/store/wishlist.store";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
          <p className="mt-1 text-sm text-gray-400">{items.length} sản phẩm</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState message="Chưa có sản phẩm yêu thích" icon="❤️" />
          <div className="mt-6 text-center">
            <Link href="/products" className="inline-block rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
