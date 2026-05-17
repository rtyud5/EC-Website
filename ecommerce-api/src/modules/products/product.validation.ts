import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Tên sản phẩm ít nhất 2 ký tự"),
    description: z.string().optional(),
    price: z.number().positive("Giá phải lớn hơn 0"),
    salePrice: z.number().positive().optional(),
    stock: z.number().int().min(0).default(0),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    salePrice: z.number().positive().nullable().optional(),
    stock: z.number().int().min(0).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string().uuid().nullable().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
