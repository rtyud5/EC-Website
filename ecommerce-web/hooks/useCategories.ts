"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/types/category.type";

// Fallback khi API chưa sẵn sàng
const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Điện thoại", slug: "dien-thoai" },
  { id: "2", name: "Laptop", slug: "laptop" },
  { id: "3", name: "Thời trang", slug: "thoi-trang" },
  { id: "4", name: "Mỹ phẩm", slug: "my-pham" },
  { id: "5", name: "Đồ gia dụng", slug: "do-gia-dung" },
  { id: "6", name: "Sách", slug: "sach" },
];

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await api.get("/categories");
        const data = res.data.data || res.data;
        return Array.isArray(data) && data.length > 0 ? data : FALLBACK_CATEGORIES;
      } catch {
        return FALLBACK_CATEGORIES;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút vì categories ít thay đổi
  });
}
