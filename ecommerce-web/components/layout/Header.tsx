"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCategories } from "@/hooks/useCategories";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: categories = [] } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const itemCount = getItemCount();

  // Đóng menu khi click ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-orange-500 shadow-md">
      {/* Top bar */}
      <div className="border-b border-orange-400">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1 text-xs text-orange-100">
          {isAuthenticated() ? (
            <>
              <Link href="/profile" className="flex items-center gap-1 hover:text-white">
                <span>👤</span> {user?.name}
              </Link>
              <span className="opacity-40">|</span>
              <button onClick={logout} className="hover:text-white">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link href="/register" className="hover:text-white">Đăng ký</Link>
              <span className="opacity-40">|</span>
              <Link href="/login" className="hover:text-white">Đăng nhập</Link>
            </>
          )}
          {user?.role === "SELLER" && (
            <>
              <span className="opacity-40">|</span>
              <Link href="/seller/dashboard" className="hover:text-white">Kênh người bán</Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <>
              <span className="opacity-40">|</span>
              <Link href="/admin/dashboard" className="hover:text-white">Quản trị</Link>
            </>
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-extrabold text-white">
          🛍️ Shop
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center rounded-sm bg-white overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            className="flex-1 px-4 py-2.5 text-sm text-gray-700 outline-none"
          />
          <button
            type="submit"
            className="flex h-full items-center bg-orange-500 px-5 py-2.5 text-white hover:bg-orange-600 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative text-white hover:text-orange-100">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-orange-500">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-white hover:text-orange-100">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-orange-700">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category nav — dynamic from API */}
      <div className="border-t border-orange-400">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5 text-sm">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded px-3 py-1 text-orange-100 transition hover:bg-orange-400 hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/vouchers" className="ml-auto flex items-center gap-1 rounded px-3 py-1 text-orange-100 transition hover:bg-orange-400 hover:text-white">
            🎟️ Voucher
          </Link>
        </div>
      </div>
    </header>
  );
}
