import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const userService = {
  /** Danh sách users (admin) */
  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit };
  },

  /** Lấy user theo ID */
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, avatar: true, createdAt: true },
    });
    if (!user) throw ApiError.notFound("Không tìm thấy user");
    return user;
  },

  /** Cập nhật user */
  async update(id: string, data: { name?: string; phone?: string; address?: string; avatar?: string; role?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, phone: true, address: true },
    });
  },

  /** Xóa user */
  async remove(id: string) {
    await prisma.user.delete({ where: { id } });
    return { message: "Đã xóa user" };
  },
};
