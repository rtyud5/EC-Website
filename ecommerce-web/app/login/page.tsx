"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
            <p className="mt-2 text-sm text-gray-500">Chào mừng bạn quay trở lại!</p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Đăng ký
            </Link>
          </p>

          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            <strong>Demo:</strong> admin@ecommerce.vn / admin123 <br />
            <strong>User:</strong> user@ecommerce.vn / user123
          </div>
        </div>
      </div>
    </div>
  );
}
