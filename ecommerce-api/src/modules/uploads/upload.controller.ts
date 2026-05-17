import type { Request, Response } from "express";
import { cloudinaryService } from "./cloudinary.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok } from "../../utils/http";

export const uploadController = {
  /** POST /api/uploads/image */
  uploadImage: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Khi sử dụng multer middleware để nhận file upload
    const result = await cloudinaryService.uploadImage(req.file || req.body);
    ok(res, result, "Upload thành công");
  }),
};
