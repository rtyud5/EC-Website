"use client";

import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { LoginRequest, RegisterRequest } from "@/types/user.type";

export function useAuth() {
  const { user, token, setAuth, logout: storeLogout, isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginRequest) => {
    const res = await api.post("/auth/login", data);
    const { user, token } = res.data.data;
    setAuth(user, token);
    return res.data;
  };

  const register = async (data: RegisterRequest) => {
    const res = await api.post("/auth/register", data);
    const { user, token } = res.data.data;
    setAuth(user, token);
    return res.data;
  };

  const logout = () => {
    storeLogout();
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    logout,
  };
}
