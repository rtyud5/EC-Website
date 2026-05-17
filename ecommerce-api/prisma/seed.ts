import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ───────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecommerce.vn" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ecommerce.vn",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ─── Test User ────────────────────────────────────────
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@ecommerce.vn" },
    update: {},
    create: {
      name: "Nguyễn Văn A",
      email: "user@ecommerce.vn",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("✅ Test user:", user.email);

  // ─── Categories ───────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dien-thoai" },
      update: {},
      create: { name: "Điện thoại", slug: "dien-thoai", description: "Smartphone và phụ kiện", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    }),
    prisma.category.upsert({
      where: { slug: "laptop" },
      update: {},
      create: { name: "Laptop", slug: "laptop", description: "Laptop và máy tính xách tay", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    }),
    prisma.category.upsert({
      where: { slug: "thoi-trang" },
      update: {},
      create: { name: "Thời trang", slug: "thoi-trang", description: "Quần áo, giày dép, phụ kiện", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
    }),
    prisma.category.upsert({
      where: { slug: "my-pham" },
      update: {},
      create: { name: "Mỹ phẩm", slug: "my-pham", description: "Mỹ phẩm và chăm sóc sắc đẹp", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
    }),
    prisma.category.upsert({
      where: { slug: "do-gia-dung" },
      update: {},
      create: { name: "Đồ gia dụng", slug: "do-gia-dung", description: "Đồ dùng gia đình", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    }),
    prisma.category.upsert({
      where: { slug: "sach" },
      update: {},
      create: { name: "Sách", slug: "sach", description: "Sách và văn phòng phẩm", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400" },
    }),
  ]);
  console.log(`✅ ${categories.length} categories`);

  // ─── Products ─────────────────────────────────────────
  const products = [
    { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", price: 34990000, salePrice: 32990000, stock: 50, categoryId: categories[0].id, description: "iPhone 15 Pro Max 256GB chính hãng Apple", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"] },
    { name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", price: 31990000, stock: 35, categoryId: categories[0].id, description: "Samsung Galaxy S24 Ultra 256GB", images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400"] },
    { name: "MacBook Air M3", slug: "macbook-air-m3", price: 27990000, salePrice: 25990000, stock: 20, categoryId: categories[1].id, description: "MacBook Air 13 inch M3 chip, 8GB RAM, 256GB SSD", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"] },
    { name: "Laptop ASUS VivoBook", slug: "asus-vivobook-15", price: 15990000, stock: 40, categoryId: categories[1].id, description: "ASUS VivoBook 15 inch, Intel i5, 8GB RAM", images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400"] },
    { name: "Áo thun nam basic", slug: "ao-thun-nam-basic", price: 199000, salePrice: 149000, stock: 200, categoryId: categories[2].id, description: "Áo thun nam cotton 100% form regular fit", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"] },
    { name: "Quần jeans slim fit", slug: "quan-jeans-slim-fit", price: 450000, stock: 150, categoryId: categories[2].id, description: "Quần jeans nam slim fit co giãn thoải mái", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"] },
    { name: "Son môi MAC Ruby Woo", slug: "son-mac-ruby-woo", price: 590000, salePrice: 490000, stock: 80, categoryId: categories[3].id, description: "Son MAC Matte Lipstick màu Ruby Woo", images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400"] },
    { name: "Kem chống nắng Anessa", slug: "kem-chong-nang-anessa", price: 450000, stock: 120, categoryId: categories[3].id, description: "Kem chống nắng Anessa Perfect UV SPF50+", images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"] },
    { name: "Nồi chiên không dầu", slug: "noi-chien-khong-dau", price: 1890000, salePrice: 1590000, stock: 60, categoryId: categories[4].id, description: "Nồi chiên không dầu 5.5L đa năng", images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"] },
    { name: "Robot hút bụi thông minh", slug: "robot-hut-bui", price: 4990000, stock: 25, categoryId: categories[4].id, description: "Robot hút bụi lau nhà tự động, điều khiển qua app", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"] },
    { name: "Đắc nhân tâm", slug: "dac-nhan-tam", price: 86000, salePrice: 68000, stock: 300, categoryId: categories[5].id, description: "Dale Carnegie - Đắc nhân tâm (bìa mềm)", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"] },
    { name: "Atomic Habits", slug: "atomic-habits", price: 189000, stock: 180, categoryId: categories[5].id, description: "Atomic Habits - Thay đổi tí hon, hiệu quả bất ngờ", images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"] },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${products.length} products`);

  // ─── Discounts ────────────────────────────────────────
  const discounts = [
    { code: "WELCOME10", type: "PERCENTAGE" as const, value: 10, maxUses: 100, startsAt: new Date(), endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
    { code: "SAVE50K", type: "FIXED_AMOUNT" as const, value: 50000, minOrder: 500000, maxUses: 50, startsAt: new Date(), endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  ];

  for (const d of discounts) {
    await prisma.discount.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
  }
  console.log(`✅ ${discounts.length} discounts`);

  // ─── AI Models ────────────────────────────────────────
  const aiModels = [
    { name: "Product Recommendation", type: "RECOMMENDATION" as const, provider: "internal", description: "Gợi ý sản phẩm dựa trên hành vi mua hàng", status: "INACTIVE" as const },
    { name: "Customer Chatbot", type: "CHATBOT" as const, provider: "openai", description: "Chatbot tư vấn khách hàng", status: "INACTIVE" as const },
    { name: "Demand Forecaster", type: "DEMAND_FORECAST" as const, provider: "internal", description: "Dự đoán nhu cầu sản phẩm", status: "INACTIVE" as const },
  ];

  for (const m of aiModels) {
    const existing = await prisma.aIModel.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.aIModel.create({ data: m });
    }
  }
  console.log(`✅ ${aiModels.length} AI models`);

  console.log("\n🎉 Seed hoàn tất!");
  console.log("📧 Admin: admin@ecommerce.vn / admin123");
  console.log("📧 User:  user@ecommerce.vn / user123");
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
