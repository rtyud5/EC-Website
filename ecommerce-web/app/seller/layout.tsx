"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else if (user?.role !== "SELLER") {
      router.push("/seller/register"); // Chuyển đến đăng ký nếu chưa phải là Seller
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== "SELLER") {
    return <div className="p-8 text-center">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-130px)]">
      <SellerSidebar />
      <div className="flex-1 overflow-auto bg-gray-50 p-6">{children}</div>
    </div>
  );
}
