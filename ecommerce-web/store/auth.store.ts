"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user.type";

// === Cookie helpers để đồng bộ với Next.js middleware ===
function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

type AuthStore = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        // Đồng bộ cookie cho middleware
        setCookie("auth-token", token);
        setCookie("user-role", user.role);
        set({ user, token });
      },

      setUser: (user) => {
        // Cập nhật user info (dùng trong profile)
        setCookie("user-role", user.role);
        set({ user });
      },

      logout: () => {
        // Xóa cookie khi logout
        deleteCookie("auth-token");
        deleteCookie("user-role");
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Đồng bộ lại cookie khi hydrate từ localStorage
        if (state?.token && state?.user) {
          setCookie("auth-token", state.token);
          setCookie("user-role", state.user.role);
        }
      },
    }
  )
);
