# GitHub Copilot Instructions

## Project Context
C2C e-commerce marketplace (Shopee-style) with Vietnamese UI. TypeScript monorepo: Express API + Next.js 14 frontend.

## Architecture
- **Backend** (`ecommerce-api/`): Express + Prisma + PostgreSQL + JWT auth + Zod validation
- **Frontend** (`ecommerce-web/`): Next.js 14 App Router + Zustand (client state) + React Query (server state) + TailwindCSS
- **Infra**: Docker Compose + Nginx reverse proxy

## Code Conventions

### Backend
- Each module in `src/modules/[name]/` has 4 files: `routes.ts`, `controller.ts`, `service.ts`, `validation.ts`
- Controllers use `asyncHandler()` wrapper for error catching
- Validation uses Zod schemas wrapping `{ body, query, params }`
- Errors use custom `ApiError` class with static factory methods
- Response format: `{ success: boolean, data?: any, message?: string }`

### Frontend
- All interactive components start with `"use client"` directive
- Data fetching through custom hooks in `hooks/` using `@tanstack/react-query`
- Client state (auth, cart, wishlist) via Zustand stores in `store/` with `persist` middleware
- Auth cookies synced from Zustand for Next.js middleware route protection
- UI text in Vietnamese, color theme: orange (shop), indigo (landing)
- TailwindCSS utility classes, responsive with sm/lg/xl breakpoints

### Naming
- Files: PascalCase for components (`ProductCard.tsx`), camelCase for hooks/stores (`useProducts.ts`, `auth.store.ts`)
- Types: `[entity].type.ts` in `types/` directory
- Routes: kebab-case in URL paths

### Type Definitions
- Product, Order, User, Category, Discount, Cart types in `ecommerce-web/types/`
- Backend Prisma types auto-generated from schema

## Patterns to Follow
```typescript
// Hook pattern (React Query)
export function useXxx(params?) {
  return useQuery<Type[]>({
    queryKey: ["xxx", params],
    queryFn: async () => {
      const res = await api.get("/xxx", { params });
      return res.data.data || [];
    },
  });
}

// Store pattern (Zustand + persist)
export const useXxxStore = create<XxxStore>()(
  persist((set, get) => ({ ... }), { name: "xxx-storage" })
);

// API controller pattern
export const xxxController = {
  getAll: asyncHandler(async (req, res) => {
    const result = await xxxService.getAll(req.query);
    ok(res, result);
  }),
};
```

## Important
- Vietnamese text for all user-facing strings
- Always use `api` instance from `lib/api.ts` (not raw axios/fetch)
- Use existing hooks and stores — don't create duplicate state management
- Database has 12 models defined in `ecommerce-api/prisma/schema.prisma`
