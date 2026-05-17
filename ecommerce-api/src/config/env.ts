export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "change_this_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // PayOS - Cổng thanh toán Việt Nam
  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID || "",
  PAYOS_API_KEY: process.env.PAYOS_API_KEY || "",
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY || "",

  // Cloudinary - Upload ảnh (placeholder)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};
