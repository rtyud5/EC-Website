"use client";

import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { LoginRequest, RegisterRequest } from "@/types/user.type";

export function useAuth() {
  const { user, token, setAuth, setUser, logout: storeLogout, isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginRequest) => {
    const res = await api.post("/auth/login", data);
    const { user, token } = res.data.data;
    setAuth(user, token); // Cookies được đồng bộ tự động trong store
    return res.data;
  };

  const register = async (data: RegisterRequest) => {
    const res = await api.post("/auth/register", data);
    const { user, token } = res.data.data;
    setAuth(user, token);
    return res.data;
  };

  const updateProfile = async (data: { name?: string; phone?: string; address?: string }) => {
    const res = await api.put("/users/me", data);
    setUser(res.data.data); // Cập nhật user info + sync cookie role
    return res.data;
  };

  const logout = () => {
    storeLogout(); // Cookies được xóa tự động trong store
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    updateProfile,
    logout,
    setUser,
  };
}
