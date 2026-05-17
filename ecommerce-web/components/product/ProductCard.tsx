"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product.type";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: 1,
      image: imageUrl,
      stock: product.stock,
    });
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-indigo-200 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.category && (
            <span className="text-xs text-gray-400">{product.category.name}</span>
          )}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-indigo-600">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-bold text-indigo-600">
              {formatCurrency(hasDiscount ? product.salePrice! : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </Link>
  );
}
