"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Sản phẩm", icon: "📦" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "🛒" },
  { href: "/admin/users", label: "Khách hàng", icon: "👥" },
  { href: "/admin/sellers", label: "Quản lý Shop", icon: "🏪" },
  { href: "/admin/discounts", label: "Mã giảm giá", icon: "🏷️" },
  { href: "/admin/ai-models", label: "AI Models", icon: "🤖" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-lg font-bold text-indigo-600">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          Admin Panel
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-indigo-600"
        >
          ← Về trang chủ
        </Link>
      </div>
    </aside>
  );
}
