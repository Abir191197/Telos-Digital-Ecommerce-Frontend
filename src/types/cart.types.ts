// ── Cart & Wishlist State Types ────────────────────────────
import type { Product, ProductVariant } from "./ecommerce.types";

export interface CartItem {
  id: string; // Unique cart line item ID (productId + variantId)
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  addedAt: string;
}

export interface CouponDiscount {
  code: string;
  percentage?: number; // e.g. 10 for 10%
  fixedAmount?: number; // e.g. 500 for ৳500
  minOrderAmount?: number;
  description: string;
}
