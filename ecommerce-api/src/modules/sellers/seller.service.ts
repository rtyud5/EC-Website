import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

/**
 * Seller Service - Placeholder cho marketplace.
 * Cho phép user đăng ký làm seller, admin duyệt.
 */
export const sellerService = {
  /** Danh sách sellers */
  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [sellers, total] = await Promise.all([
      prisma.seller.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.seller.count(),
    ]);
    return { sellers, total, page, limit };
  },

  /** Lấy seller theo ID */
  async findById(id: string) {
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { products: true, commissions: true } },
      },
    });
    if (!seller) throw ApiError.notFound("Không tìm thấy seller");
    return seller;
  },

  /** Đăng ký seller */
  async register(userId: string, data: { shopName: string; description?: string }) {
    const existing = await prisma.seller.findUnique({ where: { userId } });
    if (existing) throw ApiError.conflict("Bạn đã đăng ký seller");

    return prisma.seller.create({
      data: {
        userId,
        shopName: data.shopName,
        description: data.description,
      },
    });
  },

  /** Duyệt/cập nhật seller (admin) */
  async update(id: string, data: { status?: string; commissionRate?: number }) {
    const seller = await prisma.seller.update({
      where: { id },
      data: data as any,
    });

    if (data.status === "APPROVED") {
      await prisma.user.update({
        where: { id: seller.userId },
        data: { role: "SELLER" },
      });
    } else if (data.status === "SUSPENDED" || data.status === "PENDING") {
      await prisma.user.update({
        where: { id: seller.userId },
        data: { role: "USER" },
      });
    }

    return seller;
  },

  /** Xóa seller */
  async remove(id: string) {
    await prisma.seller.delete({ where: { id } });
    return { message: "Đã xóa seller" };
  },
};
