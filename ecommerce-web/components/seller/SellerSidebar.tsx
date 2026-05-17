"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { name: "Tổng quan", href: "/seller/dashboard", icon: "📊" },
  { name: "Sản phẩm", href: "/seller/products", icon: "📦" },
  { name: "Đơn hàng", href: "/seller/orders", icon: "🛒" },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <h2 className="text-lg font-bold text-indigo-600">Kênh Người Bán</h2>
      </div>
      <nav className="mt-4 space-y-1 px-3">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
