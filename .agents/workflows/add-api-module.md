---
description: How to add a new API module (backend feature)
---

# Add New API Module

## Steps

1. Create module directory: `ecommerce-api/src/modules/[name]/`

2. Create **validation** file: `[name].validation.ts`
```typescript
import { z } from "zod";
export const createSchema = z.object({
  body: z.object({ /* fields */ }),
});
```

3. Create **service** file: `[name].service.ts`
```typescript
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
export const nameService = {
  async getAll() { return prisma.name.findMany(); },
  async getById(id: string) { /* ... */ },
  async create(data: any) { /* ... */ },
};
```

4. Create **controller** file: `[name].controller.ts`
```typescript
import type { Request, Response } from "express";
import { nameService } from "./[name].service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/http";
export const nameController = {
  getAll: asyncHandler(async (req, res) => {
    const result = await nameService.getAll();
    ok(res, result);
  }),
};
```

5. Create **routes** file: `[name].routes.ts`
```typescript
import { Router } from "express";
import { nameController } from "./[name].controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createSchema } from "./[name].validation";
export const nameRoutes = Router();
nameRoutes.get("/", nameController.getAll);
nameRoutes.post("/", authMiddleware, validate(createSchema), nameController.create);
```

6. Register route in `src/routes/index.ts`:
```typescript
import { nameRoutes } from "../modules/[name]/[name].routes";
router.use("/[name]", nameRoutes);
```

7. If needed, add Prisma model in `prisma/schema.prisma` and run:
// turbo
```bash
cd ecommerce-api && npx prisma migrate dev --name add_[name]
```
