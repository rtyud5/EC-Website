# AGENTS.md — Codex Context
# Full context: see .ai-context.md

## Project
C2C e-commerce marketplace (Shopee-style). TypeScript monorepo: Express API + Next.js 14. Vietnamese UI.

## Quick Reference
- **API modules**: `ecommerce-api/src/modules/[name]/` → routes, controller, service, validation (Zod)
- **Frontend hooks**: `ecommerce-web/hooks/` → React Query hooks
- **Frontend stores**: `ecommerce-web/store/` → Zustand (auth, cart, wishlist)
- **Route guard**: `ecommerce-web/middleware.ts` → reads cookies (auth-token, user-role)
- **DB schema**: `ecommerce-api/prisma/schema.prisma` → 12 models

## Conventions
- Vietnamese UI text, English code
- TailwindCSS only, Orange (#f97316) shop theme
- `"use client"` on interactive components
- PascalCase components, camelCase hooks/stores
- Use `api` from `lib/api.ts` (JWT auto-attached)
- Data fetching → React Query hooks (NOT useEffect+useState)
- Client state → Zustand stores with persist

## See `.ai-context.md` for full architecture details.
