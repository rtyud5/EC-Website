import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-indigo-600">ECommerce</h3>
            <p className="mt-2 text-sm text-gray-500">
              Nền tảng thương mại điện tử hiện đại, tiện lợi và an toàn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Sản phẩm</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-500 hover:text-indigo-600">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?sort=sale" className="text-sm text-gray-500 hover:text-indigo-600">Đang giảm giá</Link></li>
              <li><Link href="/products?sort=new" className="text-sm text-gray-500 hover:text-indigo-600">Mới nhất</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Tài khoản</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600">Đăng nhập</Link></li>
              <li><Link href="/register" className="text-sm text-gray-500 hover:text-indigo-600">Đăng ký</Link></li>
              <li><Link href="/orders" className="text-sm text-gray-500 hover:text-indigo-600">Đơn hàng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500">Email: support@ecommerce.vn</span></li>
              <li><span className="text-sm text-gray-500">Hotline: 1900 xxxx</span></li>
              <li><span className="text-sm text-gray-500">Thanh toán: PayOS</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ECommerce. Đồ án tốt nghiệp — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
