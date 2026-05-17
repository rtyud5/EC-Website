"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { Button } from "@/components/common/Button";

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ shopName: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user?.role === "SELLER") {
    router.push("/seller/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/sellers/register", form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi đăng ký shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Mở Gian Hàng</h1>
            <p className="mt-2 text-sm text-gray-500">Đăng ký trở thành Người Bán ngay hôm nay</p>
          </div>

          {success ? (
            <div className="mt-6 text-center">
              <div className="mb-4 text-4xl">⏳</div>
              <h3 className="font-semibold text-green-600">Đã gửi yêu cầu mở shop!</h3>
              <p className="mt-2 text-sm text-gray-600">
                Yêu cầu của bạn đang được Admin chờ duyệt. Hãy kiểm tra lại trạng thái sau.
              </p>
              <Button className="mt-6" onClick={() => router.push("/")}>Về trang chủ</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Shop *</label>
                <input
                  type="text"
                  required
                  value={form.shopName}
                  onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="VD: Cửa hàng Tuấn Phong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả Shop</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Shop chuyên bán đồ công nghệ..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? "Đang xử lý..." : "Đăng Ký Khởi Tạo Shop"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
