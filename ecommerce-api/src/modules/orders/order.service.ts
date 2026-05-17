import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";

export const orderService = {
  /** Tạo đơn hàng từ giỏ hàng */
  async create(userId: string, data: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    note?: string;
    discountCode?: string;
  }) {
    // Lấy giỏ hàng
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw ApiError.badRequest("Giỏ hàng trống");
    }

    // Group by sellerId
    const groupedItems: Record<string, typeof cartItems> = {};
    for (const item of cartItems) {
      const sId = item.product.sellerId || "SYSTEM";
      if (!groupedItems[sId]) groupedItems[sId] = [];
      groupedItems[sId].push(item);
    }

    // Prepare discount
    let discountObj = null;
    if (data.discountCode) {
      const discount = await prisma.discount.findUnique({ where: { code: data.discountCode } });
      if (discount && discount.isActive) {
        const now = new Date();
        if (now >= discount.startsAt && now <= discount.endsAt) {
          if (discount.maxUses === 0 || discount.usedCount < discount.maxUses) {
            discountObj = discount;
            // Tăng số lần sử dụng
            await prisma.discount.update({
              where: { id: discount.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }
    }

    const createdOrders = await prisma.$transaction(async (tx: any) => {
      const orders = [];
      
      const numGroups = Object.keys(groupedItems).length;

      for (const sId of Object.keys(groupedItems)) {
        const items = groupedItems[sId];
        let totalAmount = 0;
        const orderItems = items.map((item: any) => {
          const price = item.product.salePrice || item.product.price;
          totalAmount += price * item.quantity;
          return { productId: item.productId, quantity: item.quantity, price };
        });

        // Áp dụng discount
        let discountAmount = 0;
        if (discountObj) {
          if (discountObj.type === "PERCENTAGE") {
            discountAmount = totalAmount * (discountObj.value / 100);
          } else {
            // Chia đều số tiền giảm cho các đơn con
            discountAmount = discountObj.value / numGroups;
          }
        }

        const finalAmount = Math.max(0, totalAmount - (discountAmount || 0));

        const order = await tx.order.create({
          data: {
            userId,
            totalAmount,
            discountAmount: discountAmount || 0,
            finalAmount,
            shippingName: data.shippingName,
            shippingPhone: data.shippingPhone,
            shippingAddress: data.shippingAddress,
            note: data.note,
            discountId: discountObj?.id,
            items: { create: orderItems },
          },
          include: { items: { include: { product: { select: { id: true, name: true, images: true } } } } },
        });

        orders.push(order);
      }

      // Giảm stock & xóa giỏ hàng
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { userId } });

      return orders;
    });

    return createdOrders;
  },

  /** Danh sách đơn hàng của user */
  async listByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          payment: { select: { status: true, provider: true } },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total, page, limit };
  },

  /** Tất cả đơn hàng (admin / seller) */
  async listAll(page = 1, limit = 20, sellerId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (sellerId) {
      where.items = { some: { product: { sellerId } } };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
          payment: { select: { status: true, provider: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    return { orders, total, page, limit };
  },

  /** Lấy order theo ID */
  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true, price: true, images: true } } } },
        payment: true,
      },
    });

    if (!order) throw ApiError.notFound("Không tìm thấy đơn hàng");
    return order;
  },

  /** Cập nhật trạng thái đơn hàng (admin) */
  async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    });
  },

  /** Dashboard stats */
  async getStats() {
    const [totalOrders, totalProducts, totalUsers, revenueResult] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: { in: ["COMPLETED", "DELIVERED"] } },
      }),
    ]);

    return {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueResult._sum.finalAmount || 0,
    };
  },

  /** Seller Dashboard stats */
  async getSellerStats(sellerId: string) {
    const [totalOrders, totalProducts, revenueResult] = await Promise.all([
      prisma.order.count({
        where: { items: { some: { product: { sellerId } } } },
      }),
      prisma.product.count({
        where: { sellerId },
      }),
      prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { 
          items: { some: { product: { sellerId } } },
          status: { in: ["COMPLETED", "DELIVERED"] } 
        },
      }),
    ]);

    return {
      totalOrders,
      totalProducts,
      totalRevenue: revenueResult._sum.finalAmount || 0,
    };
  },
};
