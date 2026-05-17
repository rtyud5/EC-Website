export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrder?: number;
  maxUses: number;
  usedCount: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
};
