import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const cartService = {
  /** Lấy giỏ hàng của user */
  async getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, name: true, slug: true, price: true, salePrice: true, images: true, stock: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return { items, total, itemCount: items.length };
  },

  /** Thêm sản phẩm vào giỏ */
  async addItem(userId: string, data: { productId: string; quantity?: number }) {
    // Kiểm tra sản phẩm tồn tại
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw ApiError.notFound("Sản phẩm không tồn tại");
    if (product.stock < (data.quantity || 1)) throw ApiError.badRequest("Sản phẩm đã hết hàng");

    // Upsert: nếu đã có trong giỏ thì tăng số lượng
    return prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: data.productId } },
      update: { quantity: { increment: data.quantity || 1 } },
      create: { userId, productId: data.productId, quantity: data.quantity || 1 },
      include: { product: { select: { id: true, name: true, price: true, salePrice: true, images: true } } },
    });
  },

  /** Cập nhật số lượng */
  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) throw ApiError.notFound("Không tìm thấy item trong giỏ");

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return { message: "Đã xóa khỏi giỏ hàng" };
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { select: { id: true, name: true, price: true, salePrice: true, images: true } } },
    });
  },

  /** Xóa item khỏi giỏ */
  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } });
    if (!item) throw ApiError.notFound("Không tìm thấy item trong giỏ");

    await prisma.cartItem.delete({ where: { id: itemId } });
    return { message: "Đã xóa khỏi giỏ hàng" };
  },

  /** Xóa toàn bộ giỏ hàng */
  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({ where: { userId } });
    return { message: "Đã xóa toàn bộ giỏ hàng" };
  },
};
