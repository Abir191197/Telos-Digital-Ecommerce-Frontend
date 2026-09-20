/**
 * ── Server-Side API Fetch Utilities ─────────────────────────────────────────
 *
 * These functions run EXCLUSIVELY in Next.js Server Components (RSC) and
 * API route handlers — NEVER in the browser. They use the native `fetch()`
 * with Next.js extended cache options to enable ISR and on-demand revalidation.
 *
 * Why not use RTK Query here?
 * RTK Query (`createApi`) is a client-side tool that depends on the Redux store
 * and React hooks. Neither is available in Server Components. We replicate the
 * same normalisation logic so the data shapes are identical on server and client.
 *
 * Cache strategy:
 *  - Homepage sections: revalidate every 60 seconds (ISR)
 *  - Product detail:    revalidate every 120 seconds (product data changes less often)
 *  - Both use `stale-while-revalidate` semantics built into Next.js fetch cache.
 */

import type { Product, ProductVariant, ProductReview } from "@/types/ecommerce.types";
import { Config } from "@/constants/app";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ServerProductQueryParams {
  limit?: number;
  page?: number;
  categoryId?: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Normalizer ───────────────────────────────────────────────────────────────
// Mirrors the normalizeProduct() in productApi.ts so client and server
// receive identically shaped Product objects.

function normalizeProduct(item: Record<string, unknown>): Product {
  if (!item) return item as unknown as Product;

  const price = Number(item.price) || 0;
  const originalPrice = item.originalPrice ? Number(item.originalPrice) : undefined;
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const rawImagesArr = Array.isArray(item.images) ? item.images : [];
  const rawImages: string[] = rawImagesArr
    .map((img: unknown) =>
      typeof img === "string" ? img : ((img as Record<string, unknown>)?.url as string),
    )
    .filter(Boolean);

  const thumbnail =
    (item.thumbnail as string) ||
    rawImages[0] ||
    "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80";

  const images = rawImages.length > 0 ? rawImages : [thumbnail];
  const parentStock = Number(item.stock) || 0;

  const variantsArr = Array.isArray(item.variants) ? item.variants : [];
  const variants: ProductVariant[] = variantsArr.map(
    (v: Record<string, unknown>) => {
      const vPrice =
        v.price !== null && v.price !== undefined ? Number(v.price) : price;
      const vOriginalPrice =
        v.originalPrice !== null && v.originalPrice !== undefined
          ? Number(v.originalPrice)
          : originalPrice;
      const rawVStock =
        v.stock !== null && v.stock !== undefined ? Number(v.stock) : null;
      const vStock =
        rawVStock !== null && !isNaN(rawVStock) && rawVStock > 0
          ? rawVStock
          : parentStock > 0
            ? parentStock
            : Number(v.stock) || 0;

      const labels = [v.color, v.size, v.weight].filter(Boolean) as string[];
      const name =
        (v.name as string) ||
        (labels.length > 0 ? labels.join(" / ") : "Standard Edition");

      return {
        id: v.id as string,
        productId: (v.productId as string) || (item.id as string),
        sku: (v.sku as string) || (item.sku as string) || "",
        name,
        color: (v.color as string) ?? null,
        size: (v.size as string) ?? null,
        weight: (v.weight as string) ?? null,
        price: vPrice,
        originalPrice: vOriginalPrice,
        costPrice:
          v.costPrice !== null && v.costPrice !== undefined
            ? Number(v.costPrice)
            : undefined,
        stock: vStock,
        inStock: vStock > 0,
        image: (v.image as string) ?? null,
        imageKey: (v.imageKey as string) ?? null,
        isDeleted: Boolean(v.isDeleted),
      };
    },
  );

  const reviewsArr = Array.isArray(item.reviews) ? item.reviews : [];
  const reviews: ProductReview[] = reviewsArr.map(
    (r: Record<string, unknown>) => ({
      id: r.id as string,
      productId: (r.productId as string) || (item.id as string),
      customerId: r.customerId as string,
      rating: Number(r.rating) || 0,
      title: (r.title as string) ?? null,
      comment: (r.comment as string) ?? null,
      isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
      createdAt: String(r.createdAt),
      customer: r.customer as ProductReview["customer"],
    }),
  );

  const hasVariants = variants.length > 0;
  const brandInfo = item.brand as Record<string, unknown> | string | undefined;

  return {
    id: item.id as string,
    slug: item.slug as string,
    name: item.name as string,
    shortDescription: (item.shortDescription as string) || "",
    description: (item.description as string) || "",
    categoryId: item.categoryId as string,
    categorySlug: (item.categorySlug as string) || "",
    categoryName: (item.categoryName as string) || "",
    subCategoryId: item.subCategoryId as string | undefined,
    subCategoryName: item.subCategoryName as string | undefined,
    subCategorySlug: item.subCategorySlug as string | undefined,
    brandId: item.brandId as string | undefined,
    price,
    originalPrice,
    discountPercentage,
    currency: "BDT",
    rating: Number(item.rating) || 0,
    reviewCount: Number(item.reviewCount) || 0,
    stock: parentStock,
    inStock: parentStock > 0,
    stockStatus: item.stockStatus as Product["stockStatus"],
    lowStockThreshold: item.lowStockThreshold
      ? Number(item.lowStockThreshold)
      : 5,
    isFeatured: Boolean(item.isFeatured),
    isFlashDeal: Boolean(item.isFlashDeal),
    isNewArrival: Boolean(item.isNewArrival ?? true),
    hasVariants,
    hasVoucher: Boolean(item.hasVoucher),
    voucherDiscountType: item.voucherDiscountType as Product["voucherDiscountType"],
    voucherDiscountValue: item.voucherDiscountValue
      ? Number(item.voucherDiscountValue)
      : null,
    voucherCouponCode: (item.voucherCouponCode as string) ?? null,
    showVoucherBadge: Boolean(item.showVoucherBadge),
    showStorefrontBadge: Boolean(item.showStorefrontBadge),
    storefrontBadgeText: (item.storefrontBadgeText as string) ?? null,
    badge:
      (item.storefrontBadgeText as string) ||
      (item.badge as string) ||
      undefined,
    images,
    thumbnail,
    thumbnailKey: (item.thumbnailKey as string) ?? null,
    brand:
      typeof brandInfo === "string"
        ? brandInfo
        : (brandInfo?.name as string) || "Brand",
    brandSlug:
      typeof brandInfo === "object" ? (brandInfo?.slug as string) : undefined,
    brandImage:
      typeof brandInfo === "object"
        ? (brandInfo?.image as string)
        : undefined,
    sku: (item.sku as string) || "",
    specifications:
      (item.specifications as Record<string, string | undefined>) || {},
    warranty: (item.warranty as string) ?? null,
    variants,
    reviews,
    tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
    isActive: item.isActive !== undefined ? Boolean(item.isActive) : undefined,
    createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
    updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
  };
}

// ── Query String Builder ─────────────────────────────────────────────────────

function buildQueryString(params: ServerProductQueryParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

// ── Public Fetch Functions ───────────────────────────────────────────────────

/**
 * Fetch a paginated list of products for use in Server Components.
 *
 * @param params   Query parameters (limit, page, categoryId, etc.)
 * @param revalidate  ISR revalidation interval in seconds. Default: 60s.
 * @returns        Normalized Product[] — empty array on any error.
 */
export async function serverFetchProducts(
  params: ServerProductQueryParams = { limit: 30 },
  revalidate = 60,
): Promise<Product[]> {
  try {
    const url = `${Config.apiUrl}/products${buildQueryString(params)}`;
    const response = await fetch(url, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(
        `[serverFetchProducts] Non-OK response: ${response.status} for ${url}`,
      );
      return [];
    }

    const json = await response.json();
    const rawList: Record<string, unknown>[] = Array.isArray(json?.data)
      ? json.data
      : [];

    return rawList.map(normalizeProduct);
  } catch (error) {
    console.error("[serverFetchProducts] Fetch failed:", error);
    return [];
  }
}

/**
 * Fetch a single product by its URL slug for SSR product detail pages.
 *
 * @param slug       The product slug from the URL params.
 * @param revalidate ISR revalidation interval in seconds. Default: 120s.
 * @returns          Normalized Product, or null if not found / error.
 */
export async function serverFetchProductBySlug(
  slug: string,
  revalidate = 120,
): Promise<Product | null> {
  try {
    const url = `${Config.apiUrl}/products/slug/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.warn(
        `[serverFetchProductBySlug] Non-OK response: ${response.status} for slug "${slug}"`,
      );
      return null;
    }

    const json = await response.json();
    if (!json?.data) return null;
    return normalizeProduct(json.data as Record<string, unknown>);
  } catch (error) {
    console.error(
      `[serverFetchProductBySlug] Fetch failed for slug "${slug}":`,
      error,
    );
    return null;
  }
}
