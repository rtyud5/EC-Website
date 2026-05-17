import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import { MODEL_TYPES } from "./model-registry";

export const aiService = {
  /** Danh sách AI models */
  async list() {
    return prisma.aIModel.findMany({ orderBy: { createdAt: "desc" } });
  },

  /** Lấy model theo ID */
  async findById(id: string) {
    const model = await prisma.aIModel.findUnique({ where: { id } });
    if (!model) throw ApiError.notFound("Không tìm thấy AI model");
    return model;
  },

  /** Tạo AI model mới */
  async create(data: {
    name: string;
    type: string;
    provider: string;
    endpoint?: string;
    description?: string;
    config?: Record<string, any>;
  }) {
    return prisma.aIModel.create({ data: data as any });
  },

  /** Cập nhật AI model */
  async update(id: string, data: Partial<{
    name: string;
    type: string;
    provider: string;
    endpoint: string;
    status: string;
    description: string;
    config: Record<string, any>;
  }>) {
    return prisma.aIModel.update({ where: { id }, data: data as any });
  },

  /** Xóa AI model */
  async remove(id: string) {
    await prisma.aIModel.delete({ where: { id } });
    return { message: "Đã xóa AI model" };
  },

  /** Lấy danh sách loại model */
  getModelTypes() {
    return MODEL_TYPES;
  },
};
