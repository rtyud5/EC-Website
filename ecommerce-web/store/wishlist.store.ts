"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Chỉ lưu các trường cần thiết thay vì toàn bộ Product object
// → giảm dung lượng localStorage đáng kể
type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  stock: number;
  status: string;
  category?: { id: string; name: string; slug: string };
};

type WishlistStore = {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          // Chỉ lưu trường cần thiết
          const slim: WishlistItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            salePrice: product.salePrice,
            images: product.images?.slice(0, 1) || [], // Chỉ lưu 1 ảnh đầu
            stock: product.stock,
            status: product.status,
            category: product.category,
          };
          set((state) => ({ items: [...state.items, slim] }));
        }
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) => get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
);
