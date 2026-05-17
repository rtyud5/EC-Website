"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId?: string;
  user: { name: string; avatar?: string };
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-xl ${star <= value ? "text-yellow-400" : "text-gray-300"} ${onChange ? "cursor-pointer hover:text-yellow-300" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${productId}/reviews`)
      .then((res) => setReviews(res.data.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  // Kiểm tra user đã review chưa (dựa vào danh sách reviews đã load)
  const hasReviewed = !loading && user
    ? reviews.some((r) => r.userId === user.id || r.user?.name === user.name)
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/products/${productId}/reviews`, form);
      setReviews((prev) => [res.data.data, ...prev]);
      setForm({ rating: 5, comment: "" });
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-900">Đánh giá sản phẩm</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="mt-4 flex items-center gap-4 rounded-xl bg-orange-50 p-4">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-orange-500">{avgRating.toFixed(1)}</p>
            <StarRating value={Math.round(avgRating)} />
            <p className="mt-1 text-xs text-gray-400">{reviews.length} đánh giá</p>
          </div>
        </div>
      )}

      {/* Form — chỉ hiển thị khi đã đăng nhập VÀ chưa review */}
      {isAuthenticated() && !hasReviewed && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Viết đánh giá của bạn</h3>
          <div className="mb-3">
            <p className="mb-1 text-xs text-gray-500">Chọn số sao</p>
            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      )}

      {/* Thông báo đã review */}
      {isAuthenticated() && hasReviewed && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
          ✓ Bạn đã đánh giá sản phẩm này.
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-gray-100 p-4 h-20" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-center text-sm text-gray-400">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-500">
                    {r.user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{r.user.name}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
              <StarRating value={r.rating} />
              {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
