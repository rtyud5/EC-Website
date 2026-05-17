import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes yêu cầu đăng nhập
const PROTECTED_ROUTES = ["/orders", "/checkout", "/profile", "/vouchers", "/wishlist"];
// Routes chỉ dành cho ADMIN
const ADMIN_ROUTES = ["/admin"];
// Routes chỉ dành cho SELLER
const SELLER_ROUTES = ["/seller"];
// Routes chỉ cho guest (chưa đăng nhập)
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  // Redirect nếu đã đăng nhập mà vào trang login/register
  if (GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Kiểm tra route cần đăng nhập
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isSeller = SELLER_ROUTES.some((r) => pathname.startsWith(r));

  if ((isProtected || isAdmin || isSeller) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kiểm tra quyền ADMIN
  if (isAdmin && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Kiểm tra quyền SELLER
  if (isSeller && userRole !== "SELLER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/orders/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/vouchers/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/login",
    "/register",
  ],
};
