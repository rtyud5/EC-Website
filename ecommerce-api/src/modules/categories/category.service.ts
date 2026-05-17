import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const categoryService = {
  /** Danh sách categories */
  async list() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  },

  /** Lấy category theo ID */
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw ApiError.notFound("Không tìm thấy danh mục");
    return category;
  },

  /** Tạo category mới */
  async create(data: { name: string; description?: string; image?: string }) {
    const slug = data.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return prisma.category.create({
      data: { ...data, slug },
    });
  },

  /** Cập nhật category */
  async update(id: string, data: { name?: string; description?: string; image?: string }) {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    return prisma.category.update({ where: { id }, data: updateData });
  },

  /** Xóa category */
  async remove(id: string) {
    await prisma.category.delete({ where: { id } });
    return { message: "Đã xóa danh mục" };
  },
};
