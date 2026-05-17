import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const discountService = {
  /** Danh sách mã giảm giá */
  async list() {
    return prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  },

  /** Lấy discount theo code (public - kiểm tra khi checkout) */
  async findByCode(code: string) {
    const discount = await prisma.discount.findUnique({ where: { code } });
    if (!discount) throw ApiError.notFound("Mã giảm giá không tồn tại");

    const now = new Date();
    if (!discount.isActive) throw ApiError.badRequest("Mã giảm giá đã bị vô hiệu hóa");
    if (now < discount.startsAt || now > discount.endsAt) throw ApiError.badRequest("Mã giảm giá đã hết hạn");
    if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) throw ApiError.badRequest("Mã giảm giá đã hết lượt sử dụng");

    return discount;
  },

  /** Tạo mã giảm giá mới */
  async create(data: {
    code: string;
    type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    minOrder?: number;
    maxUses?: number;
    startsAt: string;
    endsAt: string;
  }) {
    return prisma.discount.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrder: data.minOrder,
        maxUses: data.maxUses || 0,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
    });
  },

  /** Cập nhật mã giảm giá */
  async update(id: string, data: Partial<{
    code: string;
    type: string;
    value: number;
    minOrder: number;
    maxUses: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
  }>) {
    const updateData: any = { ...data };
    if (data.startsAt) updateData.startsAt = new Date(data.startsAt);
    if (data.endsAt) updateData.endsAt = new Date(data.endsAt);
    if (data.code) updateData.code = data.code.toUpperCase();

    return prisma.discount.update({ where: { id }, data: updateData });
  },

  /** Xóa mã giảm giá */
  async remove(id: string) {
    await prisma.discount.delete({ where: { id } });
    return { message: "Đã xóa mã giảm giá" };
  },
};
