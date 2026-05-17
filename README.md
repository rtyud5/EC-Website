# 🛒 E-Commerce Platform

Dự án web thương mại điện tử generic, xây dựng theo kiến trúc monorepo với frontend và backend riêng biệt. Dùng cho đồ án tốt nghiệp / đồ án môn học.

## 📋 Thành phần chính

| Thành phần | Công nghệ | Port |
|------------|-----------|------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Zustand, React Query | 3000 |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM | 4000 |
| **Database** | PostgreSQL 16 | 5432 |
| **Cache** | Redis 7 | 6379 |
| **Payment** | PayOS (placeholder) | — |
| **Upload** | Cloudinary (placeholder) | — |
| **AI/ML** | Module placeholder (5 loại model) | — |

## 🏗️ Cấu trúc thư mục

```
ecommerce/
├── docker-compose.yml          # Docker local
├── README.md
├── .gitignore
├── ecommerce-api/              # Backend Express API
│   ├── prisma/                 # Schema + Seed data
│   ├── src/
│   │   ├── config/             # Env, JWT, Prisma, Redis, PayOS
│   │   ├── middlewares/        # Auth, Role, Error, Validate, Rate Limit
│   │   ├── modules/            # 12 modules (auth, products, orders, payments...)
│   │   ├── routes/             # Route aggregator
│   │   ├── utils/              # ApiError, asyncHandler, response helpers
│   │   └── types/              # TypeScript declarations
│   ├── Dockerfile
│   └── package.json
└── ecommerce-web/              # Frontend Next.js
    ├── app/                    # Pages (App Router)
    │   ├── admin/              # Admin panel (dashboard, products, orders, users, discounts, ai-models)
    │   ├── products/           # Danh sách + Chi tiết sản phẩm
    │   ├── cart/               # Giỏ hàng
    │   ├── checkout/           # Thanh toán
    │   ├── orders/             # Đơn hàng
    │   ├── login/              # Đăng nhập
    │   └── register/           # Đăng ký
    ├── components/             # UI Components
    ├── hooks/                  # React hooks
    ├── lib/                    # API client, utils
    ├── store/                  # Zustand stores
    ├── types/                  # TypeScript types
    ├── Dockerfile
    └── package.json
```

## 🚀 Cách chạy

### Cách 1: Docker (khuyến nghị)

```bash
docker compose up --build
```

### Cách 2: Chạy thủ công

**Terminal 1 — Database:**
```bash
# Chạy PostgreSQL và Redis bằng Docker
docker compose up postgres redis
```

**Terminal 2 — Backend API:**
```bash
cd ecommerce-api
npm install
cp .env.example .env          # Sửa thông tin nếu cần
npx prisma migrate dev --name init
npx prisma db seed            # Tạo dữ liệu mẫu
npm run dev
```

**Terminal 3 — Frontend:**
```bash
cd ecommerce-web
npm install
cp .env.example .env.local
npm run dev
```

### Link truy cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| API Health Check | http://localhost:4000/api/health |

### Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@ecommerce.vn | admin123 |
| User | user@ecommerce.vn | user123 |

## 💳 Thanh toán — PayOS

Dự án dùng **PayOS** thay vì Stripe vì phù hợp thị trường Việt Nam hơn:
- Hỗ trợ VNĐ trực tiếp
- Tích hợp ngân hàng nội địa, ví điện tử
- API đơn giản, docs tiếng Việt
- Website: https://payos.vn

Hiện tại PayOS là **placeholder** — chạy với mock data. Khi có PayOS keys thật, đặt vào `.env`:
```
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key
```

## 🤖 Module AI Models

Module `ai-models` là **placeholder** để sau này tích hợp AI/ML:

| Loại model | Mục đích |
|------------|----------|
| `RECOMMENDATION` | Gợi ý sản phẩm dựa trên hành vi mua hàng |
| `CHATBOT` | Chatbot tư vấn khách hàng tự động |
| `DEMAND_FORECAST` | Dự đoán doanh thu, xu hướng bán hàng |
| `PRODUCT_CLASSIFICATION` | Phân loại sản phẩm tự động |
| `USER_BEHAVIOR_ANALYSIS` | Phân tích hành vi người dùng |

Mỗi model có `name`, `type`, `provider`, `endpoint`, `status`, `description`. Quản lý qua API và trang admin `/admin/ai-models`.

## 📦 API Endpoints

### Auth
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `GET /api/auth/me` — Thông tin user (auth)

### Products
- `GET /api/products` — Danh sách (search, filter, pagination)
- `GET /api/products/:id` — Chi tiết
- `POST /api/products` — Tạo (admin/seller)
- `PATCH /api/products/:id` — Cập nhật
- `DELETE /api/products/:id` — Xóa (admin)

### Categories
- `GET /api/categories` — Danh sách
- `POST /api/categories` — Tạo (admin)

### Cart
- `GET /api/cart` — Giỏ hàng (auth)
- `POST /api/cart/items` — Thêm item
- `PATCH /api/cart/items/:id` — Cập nhật số lượng
- `DELETE /api/cart/items/:id` — Xóa

### Orders
- `POST /api/orders` — Tạo đơn hàng (auth)
- `GET /api/orders` — Danh sách
- `GET /api/orders/:id` — Chi tiết
- `PATCH /api/orders/:id/status` — Cập nhật (admin)
- `GET /api/orders/stats` — Dashboard stats (admin)

### Payments (PayOS)
- `POST /api/payments/create` — Tạo link thanh toán
- `POST /api/payments/payos-webhook` — Webhook callback
- `GET /api/payments/:orderId/status` — Trạng thái thanh toán

### Discounts
- `GET /api/discounts` — Danh sách (admin)
- `GET /api/discounts/check/:code` — Kiểm tra mã (public)
- `POST /api/discounts` — Tạo (admin)
- `PATCH /api/discounts/:id` — Cập nhật
- `DELETE /api/discounts/:id` — Xóa

### Sellers & Commissions
- Placeholder cho marketplace, thu hoa hồng

### Uploads
- `POST /api/uploads/image` — Upload ảnh (placeholder)

### AI Models
- CRUD `/api/ai-models` — Quản lý model AI (admin)

## 🔮 Mở rộng trong tương lai

- ✅ Mã giảm giá / voucher
- ⬜ Flash sale
- ✅ Marketplace (seller + commission placeholder)
- ⬜ Thu hoa hồng tự động khi có đơn hàng
- ⬜ AI recommendation thật (collaborative filtering)
- ⬜ Chatbot tư vấn (GPT API)
- ⬜ Phân tích hành vi người dùng
- ⬜ Notification (email, push)
- ⬜ Review / đánh giá sản phẩm
- ⬜ Wishlist

## 🛠️ Deploy

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Render PostgreSQL / Supabase |
| Redis | Upstash / Render |

## 📝 Ghi chú

- Backend Express là API chính, không dùng `app/api` của Next.js cho business logic.
- Admin panel đặt ở `app/admin/`, không dùng `app/(admin)`.
- Tất cả placeholder có comment rõ ràng để dễ phát triển tiếp.
- Dự án có thể đổi chủ đề sản phẩm (thời trang, mỹ phẩm, công nghệ, gia dụng, số) mà không cần thay đổi kiến trúc.
