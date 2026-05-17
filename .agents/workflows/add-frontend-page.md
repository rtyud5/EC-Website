---
description: How to add a new frontend page with data fetching
---

# Add New Frontend Page

## Steps

1. **Create the hook** (if fetching server data) in `ecommerce-web/hooks/use[Name].ts`:
```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function use[Name](params?) {
  return useQuery({
    queryKey: ["[name]", params],
    queryFn: async () => {
      const res = await api.get("/[endpoint]", { params });
      return res.data.data || [];
    },
  });
}
```

2. **Create the page** in `ecommerce-web/app/[route]/page.tsx`:
```typescript
"use client";
import { use[Name] } from "@/hooks/use[Name]";

export default function [Name]Page() {
  const { data, isLoading } = use[Name]();
  // Implement with skeleton loading, empty state, responsive grid
}
```

3. **Add route protection** if needed in `ecommerce-web/middleware.ts`:
   - Add to `PROTECTED_ROUTES` for login-required pages
   - Add to `ADMIN_ROUTES` or `SELLER_ROUTES` for role-restricted pages
   - Add the path to the `config.matcher` array

4. **Add navigation link** in Header or relevant component.

## Checklist
- [ ] `"use client"` directive at top
- [ ] Vietnamese UI text
- [ ] Skeleton loading when `isLoading`
- [ ] Empty state when no data
- [ ] Responsive grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- [ ] Orange theme colors for interactive elements
