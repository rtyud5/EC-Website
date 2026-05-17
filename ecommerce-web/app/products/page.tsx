"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";

const CATEGORIES = [
  { id: "", name: "Tất cả" },
  { id: "dien-thoai", name: "Điện thoại" },
  { id: "laptop", name: "Laptop" },
  { id: "thoi-trang", name: "Thời trang" },
  { id: "my-pham", name: "Mỹ phẩm" },
  { id: "do-gia-dung", name: "Đồ gia dụng" },
  { id: "sach", name: "Sách" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data, isLoading } = useProducts({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
  });

  const products = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Sản phẩm</h1>
      <p className="mt-1 text-gray-500">Khám phá hàng ngàn sản phẩm chất lượng</p>

      {/* Search & Filter */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white">
              <div className="aspect-square bg-gray-200" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-8 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState message="Không tìm thấy sản phẩm nào" icon="🔍" />
        </div>
      )}

      {/* Pagination info */}
      {data?.pagination && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Hiển thị {products.length} / {data.pagination.total} sản phẩm
        </div>
      )}
    </div>
  );
}
