"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilter } from "@/components/product/ProductFilter";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";

const SORT_OPTIONS = [
  { label: "Phổ biến", value: "" },
  { label: "Mới nhất", value: "createdAt_desc" },
  { label: "Giá thấp đến cao", value: "price_asc" },
  { label: "Giá cao đến thấp", value: "price_desc" },
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);

  const { data, isLoading } = useProducts({
    categoryId: slug,
    page,
    limit: 20,
    sort: sort || undefined,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] || undefined,
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <ProductFilter priceRange={priceRange} onPriceChange={setPriceRange} />
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
            <span className="text-sm text-gray-500">
              {pagination ? `${pagination.total} sản phẩm` : "Đang tải..."}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sắp xếp:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`rounded px-3 py-1 transition ${
                    sort === opt.value
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white">
                  <div className="aspect-square bg-gray-200" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState message="Không có sản phẩm trong danh mục này" icon="🛍️" />
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
