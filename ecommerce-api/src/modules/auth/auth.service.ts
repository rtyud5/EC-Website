import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { signToken } from "../../config/jwt";
import { ApiError } from "../../utils/ApiError";

export const authService = {
  /** Đăng ký tài khoản mới */
  async register(data: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw ApiError.conflict("Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return { user, token };
  },

  /** Đăng nhập */
  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw ApiError.unauthorized("Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized("Email hoặc mật khẩu không đúng");
    }

    const token = signToken({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  /** Lấy thông tin user hiện tại */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("Không tìm thấy user");
    }

    return user;
  },
};
