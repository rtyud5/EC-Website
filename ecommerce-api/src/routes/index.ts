import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";
import { categoryRoutes } from "../modules/categories/category.routes";
import { productRoutes } from "../modules/products/product.routes";
import { cartRoutes } from "../modules/cart/cart.routes";
import { orderRoutes } from "../modules/orders/order.routes";
import { paymentRoutes } from "../modules/payments/payment.routes";
import { discountRoutes } from "../modules/discounts/discount.routes";
import { sellerRoutes } from "../modules/sellers/seller.routes";
import { commissionRoutes } from "../modules/commissions/commission.routes";
import { uploadRoutes } from "../modules/uploads/upload.routes";
import { aiRoutes } from "../modules/ai-models/ai.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/discounts", discountRoutes);
router.use("/sellers", sellerRoutes);
router.use("/commissions", commissionRoutes);
router.use("/uploads", uploadRoutes);
router.use("/ai-models", aiRoutes);

export default router;
