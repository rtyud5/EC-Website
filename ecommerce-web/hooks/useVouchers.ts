import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Discount } from "@/types/discount.type";

export function useVouchers(params?: { isActive?: boolean }) {
  return useQuery<Discount[]>({
    queryKey: ["vouchers", params],
    queryFn: async () => {
      const res = await api.get("/discounts", { params });
      return res.data.data || [];
    },
    staleTime: 2 * 60 * 1000, // Cache 2 phút
  });
}

export function useVoucher(id: string) {
  return useQuery<Discount>({
    queryKey: ["vouchers", id],
    queryFn: async () => {
      const res = await api.get(`/discounts/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
