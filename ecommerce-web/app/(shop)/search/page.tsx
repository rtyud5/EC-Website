"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";

const SORT_OPTIONS = [
  { label: "Liên quan", value: "" },
  { label: "Mới nhất", value: "createdAt_desc" },
  { label: "Bán chạy", value: "sold_desc" },
  { label: "Giá thấp → cao", value: "price_asc" },
  { label: "Giá cao → thấp", value: "price_desc" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  // Reset page khi query thay đổi
  useEffect(() => { setPage(1); }, [query]);

  const { data, isLoading } = useProducts({
    search: query || undefined,
    page,
    limit: 20,
    sort: sort || undefined,
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        {query ? (
          <p className="text-gray-600">
            Kết quả tìm kiếm cho{" "}
            <span className="font-semibold text-orange-500">"{query}"</span>
            {pagination && (
              <span className="ml-2 text-sm text-gray-400">({pagination.total} sản phẩm)</span>
            )}
          </p>
        ) : (
          <p className="text-gray-500">Nhập từ khóa để tìm kiếm sản phẩm</p>
        )}
      </div>

      {/* Sort Bar */}
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2.5">
        <span className="text-sm text-gray-500">Sắp xếp theo:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`rounded px-3 py-1 text-sm transition ${
              sort === opt.value
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:text-orange-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-white">
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
      ) : query ? (
        <div className="mt-8">
          <EmptyState
            message={`Không tìm thấy sản phẩm cho "${query}"`}
            icon="🔍"
          />
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
