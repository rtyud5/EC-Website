import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import type { Prisma } from "@prisma/client";

export const productService = {
  /** Danh sách sản phẩm với phân trang, tìm kiếm, filter */
  async list(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sellerId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Search theo name hoặc description
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Filter theo category
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Filter theo seller
    if (query.sellerId) {
      where.sellerId = query.sellerId;
    }

    // Filter theo status (mặc định chỉ hiện ACTIVE cho public)
    if (query.status) {
      where.status = query.status as any;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (query.sortBy === "price") {
      orderBy.price = (query.sortOrder as any) || "asc";
    } else if (query.sortBy === "name") {
      orderBy.name = (query.sortOrder as any) || "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },

  /** Lấy sản phẩm theo ID */
  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, shopName: true } },
      },
    });
    if (!product) throw ApiError.notFound("Không tìm thấy sản phẩm");
    return product;
  },

  /** Tạo sản phẩm mới */
  async create(data: {
    name: string;
    description?: string;
    price: number;
    salePrice?: number;
    stock?: number;
    images?: string[];
    categoryId?: string;
    sellerId?: string;
    status?: string;
  }) {
    const slug = data.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36);

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        stock: data.stock || 0,
        images: data.images || [],
        categoryId: data.categoryId,
        sellerId: data.sellerId,
        status: (data.status as any) || "ACTIVE",
      },
      include: { category: { select: { id: true, name: true } } },
    });
  },

  /** Cập nhật sản phẩm */
  async update(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    stock: number;
    images: string[];
    categoryId: string | null;
    status: string;
  }>) {
    return prisma.product.update({
      where: { id },
      data: data as any,
      include: { category: { select: { id: true, name: true } } },
    });
  },

  /** Xóa sản phẩm */
  async remove(id: string) {
    await prisma.product.delete({ where: { id } });
    return { message: "Đã xóa sản phẩm" };
  },
};
