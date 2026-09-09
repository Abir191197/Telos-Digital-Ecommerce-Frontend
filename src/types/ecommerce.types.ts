// ── E-Commerce Product & Category Types ──────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  itemCount: number;
  featured: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Gray", "16GB RAM / 512GB SSD", "XL"
  price: number;
  inStock: boolean;
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
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string; // e.g. "BDT"
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  isFeatured: boolean;
  isFlashDeal: boolean;
  isNewArrival: boolean;
  badge?: "Trending" | "Hot" | "Sale" | "New" | "Official Warranty";
  images: string[];
  thumbnail: string;
  brand: string;
  sku: string;
  specifications: Record<string, string | undefined>;
  variants?: ProductVariant[];
  tags: string[];
  createdAt: string;
}
