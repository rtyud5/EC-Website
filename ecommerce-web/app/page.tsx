"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";

const CATEGORIES = [
  { name: "Điện thoại", slug: "dien-thoai", icon: "📱", color: "from-blue-500 to-indigo-600" },
  { name: "Laptop", slug: "laptop", icon: "💻", color: "from-purple-500 to-pink-600" },
  { name: "Thời trang", slug: "thoi-trang", icon: "👗", color: "from-pink-500 to-rose-600" },
  { name: "Mỹ phẩm", slug: "my-pham", icon: "💄", color: "from-rose-500 to-orange-500" },
  { name: "Đồ gia dụng", slug: "do-gia-dung", icon: "🏠", color: "from-teal-500 to-emerald-600" },
  { name: "Sách", slug: "sach", icon: "📚", color: "from-amber-500 to-yellow-600" },
];

export default function HomePage() {
  const { data } = useProducts({ limit: 8 });
  const products = data?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Mua sắm <span className="text-yellow-300">thông minh</span>
              <br />cùng ECommerce
            </h1>
            <p className="mt-4 text-lg text-indigo-100 sm:text-xl">
              Hàng ngàn sản phẩm chất lượng, giá tốt nhất thị trường. Thanh toán an toàn qua PayOS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl">
                Khám phá ngay
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/register" className="inline-flex items-center rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Danh mục nổi bật</h2>
          <p className="mt-2 text-gray-500">Khám phá sản phẩm theo danh mục yêu thích</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-2xl shadow-sm transition group-hover:scale-110`}>
                {cat.icon}
              </div>
              <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-indigo-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Sản phẩm nổi bật</h2>
              <p className="mt-2 text-gray-500">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link href="/products" className="hidden items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 sm:flex">
              Xem tất cả
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 sm:p-12">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">Sẵn sàng mua sắm?</h2>
            <p className="mx-auto mt-3 max-w-md text-indigo-100">
              Đăng ký tài khoản ngay để nhận ưu đãi giảm giá 10% cho đơn hàng đầu tiên với mã WELCOME10.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50">
                Đăng ký ngay
              </Link>
              <Link href="/products" className="rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
