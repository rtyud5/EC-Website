"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user.type";

type AuthStore = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
