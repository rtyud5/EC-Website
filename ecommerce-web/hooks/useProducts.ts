"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product } from "@/types/product.type";

// Mock data fallback khi API chưa sẵn sàng
const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", price: 34990000, salePrice: 32990000, stock: 50, images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"], status: "ACTIVE", category: { id: "1", name: "Điện thoại", slug: "dien-thoai" } },
  { id: "2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", price: 31990000, stock: 35, images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400"], status: "ACTIVE", category: { id: "1", name: "Điện thoại", slug: "dien-thoai" } },
  { id: "3", name: "MacBook Air M3", slug: "macbook-air-m3", price: 27990000, salePrice: 25990000, stock: 20, images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], status: "ACTIVE", category: { id: "2", name: "Laptop", slug: "laptop" } },
  { id: "4", name: "Laptop ASUS VivoBook", slug: "asus-vivobook-15", price: 15990000, stock: 40, images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400"], status: "ACTIVE", category: { id: "2", name: "Laptop", slug: "laptop" } },
  { id: "5", name: "Áo thun nam basic", slug: "ao-thun-nam-basic", price: 199000, salePrice: 149000, stock: 200, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"], status: "ACTIVE", category: { id: "3", name: "Thời trang", slug: "thoi-trang" } },
  { id: "6", name: "Son môi MAC Ruby Woo", slug: "son-mac-ruby-woo", price: 590000, salePrice: 490000, stock: 80, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400"], status: "ACTIVE", category: { id: "4", name: "Mỹ phẩm", slug: "my-pham" } },
  { id: "7", name: "Nồi chiên không dầu", slug: "noi-chien-khong-dau", price: 1890000, salePrice: 1590000, stock: 60, images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"], status: "ACTIVE", category: { id: "5", name: "Đồ gia dụng", slug: "do-gia-dung" } },
  { id: "8", name: "Đắc nhân tâm", slug: "dac-nhan-tam", price: 86000, salePrice: 68000, stock: 300, images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"], status: "ACTIVE", category: { id: "6", name: "Sách", slug: "sach" } },
];

export function useProducts(params?: { search?: string; categoryId?: string; page?: number; limit?: number; sort?: string; minPrice?: number; maxPrice?: number }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const res = await api.get("/products", { params });
        return res.data;
      } catch {
        // Fallback mock data khi API không khả dụng
        return {
          success: true,
          data: MOCK_PRODUCTS,
          pagination: { total: MOCK_PRODUCTS.length, page: 1, limit: 12, totalPages: 1 },
        };
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/${id}`);
        return res.data.data as Product;
      } catch {
        return MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
      }
    },
    enabled: !!id,
  });
}
