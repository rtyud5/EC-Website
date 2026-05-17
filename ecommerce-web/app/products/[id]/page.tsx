"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/common/Button";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/3 rounded bg-gray-200" />
              <div className="h-20 rounded bg-gray-200" />
              <div className="h-12 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
        <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:underline">← Quay lại</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || "https://via.placeholder.com/600x600?text=No+Image";
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice! : product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      image: imageUrl,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-indigo-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          {hasDiscount && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
              -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="text-sm text-gray-400">{product.category.name}</span>
          )}
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">{formatCurrency(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Còn {product.stock} sản phẩm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Hết hàng
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Mô tả sản phẩm</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center rounded-lg border border-gray-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:text-indigo-600">−</button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-gray-600 hover:text-indigo-600">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={product.stock === 0} size="lg" className="flex-1">
                {added ? "✓ Đã thêm!" : product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </Button>
              <Link href="/cart">
                <Button variant="outline" size="lg">Giỏ hàng</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
