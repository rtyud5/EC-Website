---
name: E-Commerce Project Style Guide
description: Conventions and patterns for the C2C marketplace project
---

# E-Commerce Marketplace — Style Guide

## Project Overview
C2C multi-vendor e-commerce marketplace with Vietnamese UI.
- **Backend**: `ecommerce-api/` — Express + Prisma + PostgreSQL + Redis
- **Frontend**: `ecommerce-web/` — Next.js 14 + TailwindCSS + Zustand + React Query
- **Infra**: Docker Compose + Nginx reverse proxy

## Architecture Principles

### Backend Module Pattern
Every API feature lives in `src/modules/[name]/` with exactly 4 files:
```
routes.ts      → Router definition with middleware chain
controller.ts  → Request handling, delegates to service
service.ts     → Business logic, database queries via Prisma
validation.ts  → Zod schemas for request validation
```

### Frontend State Management
- **Server state** (products, orders, categories, vouchers) → React Query hooks in `hooks/`
- **Client state** (auth, cart, wishlist) → Zustand stores in `store/` with `persist` middleware
- **Never** mix: don't use useEffect+useState for data that should be in React Query

### Auth Architecture
```
Login → setAuth(user, token) → Zustand (localStorage) + Cookies (auth-token, user-role)
                                     ↓                           ↓
                              API interceptor              Next.js middleware
                              (Authorization header)       (route protection)
```

## Code Conventions

### Language & Text
- All UI text in Vietnamese
- Code identifiers in English
- Comments in Vietnamese or English

### Styling
- TailwindCSS utility classes only (no CSS modules, no styled-components)
- Color theme: **Orange** (#f97316) for shop, **Indigo** (#6366f1) for landing/CTA
- Font: Inter (Google Fonts)
- Responsive: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`

### File Naming
| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `ProductCard.tsx` |
| Hook | camelCase + use prefix | `useProducts.ts` |
| Store | camelCase + .store suffix | `auth.store.ts` |
| Type | camelCase + .type suffix | `product.type.ts` |
| Route page | `page.tsx` in directory | `app/cart/page.tsx` |

### Common Patterns

#### React Query Hook
```typescript
export function useXxx(params?) {
  return useQuery<Type[]>({
    queryKey: ["xxx", params],
    queryFn: async () => {
      const res = await api.get("/xxx", { params });
      return res.data.data || [];
    },
    staleTime: 2 * 60 * 1000, // optional cache
  });
}
```

#### Zustand Store
```typescript
export const useXxxStore = create<XxxStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
    }),
    { name: "xxx-storage" }
  )
);
```

#### API Controller
```typescript
export const xxxController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await xxxService.getAll(req.query);
    ok(res, result);
  }),
};
```

## Key Files Reference
| Purpose | File |
|---------|------|
| DB Schema | `ecommerce-api/prisma/schema.prisma` |
| API Entrypoint | `ecommerce-api/src/app.ts` |
| API Routes | `ecommerce-api/src/routes/index.ts` |
| Auth Store | `ecommerce-web/store/auth.store.ts` |
| API Client | `ecommerce-web/lib/api.ts` |
| Route Guard | `ecommerce-web/middleware.ts` |
| Homepage | `ecommerce-web/app/page.tsx` |

## Database (12 Prisma Models)
User, Seller, Category, Product, CartItem, Order, OrderItem, Payment, Discount, Commission, AIModel

## Setup Commands
```bash
cd ecommerce-api && npm i && npx prisma generate && npx prisma migrate dev && npx prisma db seed && npm run dev
cd ecommerce-web && npm i && npm run dev
```
