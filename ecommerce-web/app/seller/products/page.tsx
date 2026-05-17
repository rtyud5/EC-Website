"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.type";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    // Gọi API kèm asSeller query (nếu backend chưa auto-filter) hoặc dựa vào SELLER role backend.
    api.get("/products?limit=50&asSeller=true")
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddDemoProduct = async () => {
    const name = prompt("Nhập tên sản phẩm mới:");
    if (!name) return;
    try {
      await api.post("/products", {
        name,
        price: 150000,
        stock: 50,
        description: "Đây là sản phẩm do Seller tạo ra từ Kênh người bán.",
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi tạo sản phẩm");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm của tôi</h1>
          <p className="text-sm text-gray-500">{products.length} sản phẩm đang bán</p>
        </div>
        <Button size="sm" onClick={handleAddDemoProduct}>+ Thêm sản phẩm nhanh</Button>
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-gray-200" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6"><EmptyState message="Cửa hàng của bạn chưa có sản phẩm nào" icon="📦" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Tên sản phẩm</th>
                <th className="px-4 py-3">Giá bán</th>
                <th className="px-4 py-3">Kho</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 font-medium text-indigo-600">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {p.status}
                    </span>
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
