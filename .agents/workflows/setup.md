---
description: How to set up and run the project locally or with Docker
---

# Setup & Run Project

## Option A: Local Development (no Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL running on port 5434
- Redis running on port 6380

### Backend
// turbo
1. `cd ecommerce-api && npm install`
// turbo
2. `cd ecommerce-api && npx prisma generate`
// turbo
3. `cd ecommerce-api && npx prisma migrate dev`
// turbo
4. `cd ecommerce-api && npx prisma db seed`
// turbo
5. `cd ecommerce-api && npm run dev`

### Frontend
// turbo
6. `cd ecommerce-web && npm install`
// turbo
7. `cd ecommerce-web && npm run dev`

## Option B: Docker Development (hot reload)
// turbo
1. `docker-compose -f docker-compose.dev.yml up --build`

## Option C: Docker Production
1. `docker-compose up --build`

## Test Accounts (after seeding)
- **Admin**: admin@ecommerce.vn / admin123
- **User**: user@ecommerce.vn / user123
