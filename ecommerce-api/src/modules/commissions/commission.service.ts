import { prisma } from "../../config/prisma";

/**
 * Commission Service - Quản lý hoa hồng marketplace.
 * Placeholder: tính hoa hồng khi seller bán được hàng.
 */
export const commissionService = {
  /** Danh sách commissions */
  async list(page = 1, limit = 20, sellerId?: string) {
    const skip = (page - 1) * limit;
    const where = sellerId ? { sellerId } : {};
    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        skip,
        take: limit,
        include: {
          seller: { select: { id: true, shopName: true } },
          order: { select: { id: true, finalAmount: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.commission.count({ where }),
    ]);
    return { commissions, total, page, limit };
  },

  /** Tạo commission record */
  async create(data: { sellerId: string; orderId: string; rate: number; amount: number }) {
    return prisma.commission.create({ data });
  },

  /** Cập nhật trạng thái commission */
  async update(id: string, data: { status?: string; paidAt?: string }) {
    const updateData: any = { ...data };
    if (data.paidAt) updateData.paidAt = new Date(data.paidAt);
    return prisma.commission.update({ where: { id }, data: updateData });
  },

  /** Xóa commission */
  async remove(id: string) {
    await prisma.commission.delete({ where: { id } });
    return { message: "Đã xóa commission" };
  },
};
