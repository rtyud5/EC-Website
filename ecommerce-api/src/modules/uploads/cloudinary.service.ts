/**
 * Cloudinary Upload Service - Placeholder.
 * TODO: Tích hợp Cloudinary SDK khi có API keys.
 * Có thể thay bằng AWS S3 hoặc Supabase Storage.
 */
export const cloudinaryService = {
  /** Upload ảnh lên Cloudinary */
  async uploadImage(_file: Express.Multer.File | unknown) {
    // TODO: Khi cấu hình Cloudinary:
    // import { v2 as cloudinary } from "cloudinary";
    // cloudinary.config({
    //   cloud_name: env.CLOUDINARY_CLOUD_NAME,
    //   api_key: env.CLOUDINARY_API_KEY,
    //   api_secret: env.CLOUDINARY_API_SECRET,
    // });
    // const result = await cloudinary.uploader.upload(file.path);
    // return { url: result.secure_url, publicId: result.public_id };

    return {
      url: "https://via.placeholder.com/400x400?text=Product+Image",
      publicId: `placeholder_${Date.now()}`,
      mock: true,
    };
  },

  /** Xóa ảnh khỏi Cloudinary */
  async deleteImage(_publicId: string) {
    // TODO: cloudinary.uploader.destroy(publicId);
    return { success: true, mock: true };
  },
};
