// 📦 E-Commerce Product, Variant, Review & Category Types 📦

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  imageKey?: string | null;
  itemCount: number;
  featured: boolean;
  isActive?: boolean;
  isFeaturedHomepage?: boolean;
  subcategories: Subcategory[];
  subCategories?: Subcategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id: string;
  categoryId?: string;
  slug: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name?: string; // Fallback / Display name e.g. "Space Gray", "XL", "18kg"
  productId?: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  weight?: string | null;
  price: number;
  originalPrice?: number | null;
  costPrice?: number | null;
  stock: number;
  inStock?: boolean;
  image?: string | null;
  imageKey?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt?: string;
  customer?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  subCategorySlug?: string;
  brandId?: string;
  costPrice?: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string; // e.g. "BDT"
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  lowStockThreshold?: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  isNewArrival: boolean;
  hasVariants?: boolean;
  hasVoucher?: boolean;
  voucherDiscountType?: "PERCENTAGE" | "FLAT" | null;
  voucherDiscountValue?: number | null;
  voucherCouponCode?: string | null;
  showVoucherBadge?: boolean;
  showStorefrontBadge?: boolean;
  storefrontBadgeText?: string | null;
  badge?: "Trending" | "Hot" | "Sale" | "New" | "Official Warranty" | string;
  images: string[];
  thumbnail: string;
  thumbnailKey?: string | null;
  brand: string;
  brandSlug?: string;
  brandImage?: string;
  sku: string;
  specifications: Record<string, string | undefined>;
  warranty?: string | null;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  tags: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  image?: string | null;
  imageKey?: string | null;
  isActive?: boolean;
  isFeaturedMarquee?: boolean;
  itemCount?: number;
  _count?: {
    products?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}
