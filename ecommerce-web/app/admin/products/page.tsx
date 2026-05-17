"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.type";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get("/products?limit=50")
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500">{products.length} sản phẩm</p>
        </div>
        <Button size="sm">+ Thêm sản phẩm</Button>
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6"><EmptyState message="Chưa có sản phẩm nào" icon="📦" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Tồn kho</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.category?.name || "—"}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium">{formatCurrency(p.salePrice || p.price)}</span>
                    {p.salePrice && p.salePrice < p.price && (
                      <span className="ml-1 text-xs text-gray-400 line-through">{formatCurrency(p.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      p.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
