export type CartItem = {
  productId: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  image?: string;
  stock?: number;
};
