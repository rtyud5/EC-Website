# CLAUDE.md — Claude Code Context
# Full context: see .ai-context.md

## What is this?
C2C e-commerce marketplace. TypeScript monorepo: Express API (`ecommerce-api/`) + Next.js 14 (`ecommerce-web/`). Vietnamese UI.

## Key Patterns
- Backend: Module pattern (routes → controller → service → validation)
- Frontend: React Query hooks (server state) + Zustand stores (client state)
- Auth: JWT in localStorage → cookies synced for Next.js middleware

## Gotchas
- Must `npx prisma generate` before API starts
- CORS_ORIGIN is comma-separated for multi-origin
- Auth cookies synced FROM Zustand TO browser (not the other way)
- JWT expiresIn uses `as any` cast (jsonwebtoken type strictness)
- Error middleware uses duck typing for Prisma errors (not direct import)

## See `.ai-context.md` for full architecture, patterns, and conventions.
