"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          ECommerce
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/products" className="text-sm font-medium text-gray-600 transition hover:text-indigo-600">
            Sản phẩm
          </Link>
          {isAuthenticated() && (
            <Link href="/orders" className="text-sm font-medium text-gray-600 transition hover:text-indigo-600">
              Đơn hàng
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 transition hover:text-indigo-600">
              Quản trị
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated() ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <span className="hidden sm:inline">{user?.name}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b px-4 py-2 text-sm text-gray-500">{user?.email}</div>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    Đơn hàng của tôi
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      Trang quản trị
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                Đăng nhập
              </Link>
              <Link href="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-gray-600 md:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
