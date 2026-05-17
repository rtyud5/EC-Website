import type { Response } from "express";

/** Response thành công */
export function ok<T>(res: Response, data: T, message = "Success") {
  return res.json({ success: true, message, data });
}

/** Response tạo mới thành công */
export function created<T>(res: Response, data: T, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}

/** Response phân trang */
export function paginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return res.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
