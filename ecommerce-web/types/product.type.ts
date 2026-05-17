export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  images: string[];
  categoryId?: string;
  sellerId?: string;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  category?: { id: string; name: string; slug: string };
  createdAt?: string;
  updatedAt?: string;
};

export type ProductListResponse = {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
