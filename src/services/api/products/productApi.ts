import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Product, ProductVariant, ProductReview } from "@/types/ecommerce.types";

export type ProductVariantPayload = {
  id?: string;
  sku?: string;
  color?: string;
  size?: string;
  weight?: string;
  price?: number; // Variant Selling Price
  costPrice?: number; // Variant Purchase Price
  originalPrice?: number;
  stock?: number;
  image?: string;
};

export type ProductFormPayload = {
  name: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;

  // Storefront Badge
  showStorefrontBadge?: boolean;
  storefrontBadgeText?: string;

  // Voucher / Promo
  hasVoucher?: boolean;
  voucherDiscountType?: "PERCENTAGE" | "FLAT";
  voucherDiscountValue?: number;
  voucherCouponCode?: string;
  showVoucherBadge?: boolean;

  // Content & SEO
  shortDescription?: string;
  description?: string;
  specifications?: Record<string, any>;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Variants & Visibility
  hasVariants?: boolean;
  variants?: ProductVariantPayload[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  isActive?: boolean;

  // Media URLs & Files
  thumbnailUrl?: string;
  imageUrls?: string[];
  thumbnail?: File | null;
  images?: File[];
  removeThumbnail?: boolean;
  removeImageIds?: string[];
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  hasVoucher?: boolean;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  stockStatus?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  stockFilter?: string;
  minStock?: number;
  maxStock?: number;
};

type BackendMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type BackendListResponse<T> = ApiResponse<T[]> & {
  meta?: BackendMeta;
};

export const normalizeProduct = (item: any): Product => {
  if (!item) return item;
  const price = Number(item.price) || 0;
  const originalPrice = item.originalPrice ? Number(item.originalPrice) : undefined;
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const rawImages = item.images && Array.isArray(item.images) && item.images.length > 0
    ? item.images.map((img: any) => (typeof img === "string" ? img : img.url))
    : [];

  const thumbnail =
    item.thumbnail ||
    rawImages[0] ||
    "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80";

  const images = rawImages.length > 0 ? rawImages : [thumbnail];

  const parentStock = Number(item.stock) || 0;

  // Normalize variants
  const variants: ProductVariant[] = Array.isArray(item.variants)
    ? item.variants.map((v: any) => {
        const vPrice = v.price !== null && v.price !== undefined ? Number(v.price) : price;
        const vOriginalPrice = v.originalPrice !== null && v.originalPrice !== undefined ? Number(v.originalPrice) : originalPrice;
        const vCostPrice = v.costPrice !== null && v.costPrice !== undefined ? Number(v.costPrice) : undefined;
        // Fall back to parent product stock if variant stock not set or 0 while parent has inventory
        const rawVStock = v.stock !== null && v.stock !== undefined ? Number(v.stock) : null;
        const vStock = rawVStock !== null && !isNaN(rawVStock) && rawVStock > 0 
          ? rawVStock 
          : (parentStock > 0 ? parentStock : (Number(v.stock) || 0));
        const labels = [v.color, v.size, v.weight].filter(Boolean);
        const name = v.name || (labels.length > 0 ? labels.join(" / ") : "Standard Edition");

        return {
          id: v.id,
          productId: v.productId || item.id,
          sku: v.sku || item.sku || "",
          name,
          color: v.color || null,
          size: v.size || null,
          weight: v.weight || null,
          price: vPrice,
          originalPrice: vOriginalPrice,
          costPrice: vCostPrice,
          stock: vStock,
          inStock: vStock > 0,
          image: v.image || null,
          imageKey: v.imageKey || null,
          isDeleted: Boolean(v.isDeleted),
          createdAt: v.createdAt ? String(v.createdAt) : undefined,
          updatedAt: v.updatedAt ? String(v.updatedAt) : undefined,
        };
      })
    : [];

  // Normalize reviews
  const reviews: ProductReview[] = Array.isArray(item.reviews)
    ? item.reviews.map((r: any) => ({
        id: r.id,
        productId: r.productId || item.id,
        customerId: r.customerId,
        rating: Number(r.rating) || 5,
        title: r.title || null,
        comment: r.comment || null,
        isVerifiedPurchase: Boolean(r.isVerifiedPurchase),
        createdAt: r.createdAt ? String(r.createdAt) : new Date().toISOString(),
        updatedAt: r.updatedAt ? String(r.updatedAt) : undefined,
        customer: r.customer
          ? {
              id: r.customer.id,
              name: r.customer.name || "Verified Customer",
              avatar: r.customer.avatar || null,
            }
          : undefined,
      }))
    : [];

  const hasVariants = Boolean(item.hasVariants || variants.length > 0);

  return {
    ...item,
    id: item.id,
    slug: item.slug || item.id,
    name: item.name || "",
    shortDescription: item.shortDescription || "",
    description: item.description || "",
    categoryId: item.categoryId || item.category?.id || "",
    categorySlug: item.category?.slug || item.categorySlug || "general",
    categoryName: item.category?.name || item.categoryName || "General",
    subCategoryId: item.subCategoryId || item.subCategory?.id || undefined,
    subCategoryName: item.subCategory?.name || item.subCategoryName || undefined,
    subCategorySlug: item.subCategory?.slug || undefined,
    brandId: item.brandId || item.brand?.id || undefined,
    costPrice: item.costPrice !== null && item.costPrice !== undefined ? Number(item.costPrice) : undefined,
    price,
    originalPrice,
    discountPercentage,
    currency: "BDT",
    rating: Number(item.rating) || 5.0,
    reviewCount: Number(item.reviewCount) || reviews.length,
    stock: Number(item.stock) || 0,
    inStock: (Number(item.stock) || 0) > 0,
    stockStatus: item.stockStatus,
    lowStockThreshold: item.lowStockThreshold ? Number(item.lowStockThreshold) : 5,
    isFeatured: Boolean(item.isFeatured),
    isFlashDeal: Boolean(item.isFlashDeal),
    isNewArrival: Boolean(item.isNewArrival ?? true),
    hasVariants,
    hasVoucher: Boolean(item.hasVoucher),
    voucherDiscountType: item.voucherDiscountType,
    voucherDiscountValue: item.voucherDiscountValue ? Number(item.voucherDiscountValue) : null,
    voucherCouponCode: item.voucherCouponCode,
    showVoucherBadge: Boolean(item.showVoucherBadge),
    showStorefrontBadge: Boolean(item.showStorefrontBadge),
    storefrontBadgeText: item.storefrontBadgeText || null,
    badge: item.storefrontBadgeText || item.badge || undefined,
    images,
    thumbnail,
    thumbnailKey: item.thumbnailKey || null,
    brand: item.brand?.name || (typeof item.brand === "string" ? item.brand : "Brand"),
    brandSlug: item.brand?.slug,
    brandImage: item.brand?.image,
    sku: item.sku || "",
    specifications: item.specifications || {},
    warranty: item.warranty || null,
    variants,
    reviews,
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
    updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
  };
};

const appendOptional = (
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined,
) => {
  if (value === undefined || value === null || value === "") return;
  formData.append(key, String(value));
};

export const buildProductFormData = (payload: ProductFormPayload): FormData => {
  const formData = new FormData();

  appendOptional(formData, "name", payload.name);
  appendOptional(formData, "price", payload.price);
  appendOptional(formData, "originalPrice", payload.originalPrice);
  appendOptional(formData, "costPrice", payload.costPrice);
  appendOptional(formData, "stock", payload.stock);
  appendOptional(formData, "lowStockThreshold", payload.lowStockThreshold);
  appendOptional(formData, "categoryId", payload.categoryId);
  appendOptional(formData, "subCategoryId", payload.subCategoryId);
  appendOptional(formData, "brandId", payload.brandId);

  appendOptional(formData, "showStorefrontBadge", payload.showStorefrontBadge);
  appendOptional(formData, "storefrontBadgeText", payload.storefrontBadgeText);

  appendOptional(formData, "hasVoucher", payload.hasVoucher);
  appendOptional(formData, "voucherDiscountType", payload.voucherDiscountType);
  appendOptional(formData, "voucherDiscountValue", payload.voucherDiscountValue);
  appendOptional(formData, "voucherCouponCode", payload.voucherCouponCode);
  appendOptional(formData, "showVoucherBadge", payload.showVoucherBadge);

  appendOptional(formData, "shortDescription", payload.shortDescription);
  appendOptional(formData, "description", payload.description);
  appendOptional(formData, "warranty", payload.warranty);
  appendOptional(formData, "metaTitle", payload.metaTitle);
  appendOptional(formData, "metaDescription", payload.metaDescription);
  appendOptional(formData, "metaKeywords", payload.metaKeywords);

  appendOptional(formData, "hasVariants", payload.hasVariants);
  appendOptional(formData, "isFeatured", payload.isFeatured);
  appendOptional(formData, "isFlashDeal", payload.isFlashDeal);
  appendOptional(formData, "isActive", payload.isActive ?? true);
  appendOptional(formData, "removeThumbnail", payload.removeThumbnail);
  appendOptional(formData, "thumbnailUrl", payload.thumbnailUrl);
  if (payload.imageUrls && payload.imageUrls.length > 0) {
    formData.append("imageUrls", JSON.stringify(payload.imageUrls));
  }

  if (payload.specifications) {
    formData.append("specifications", JSON.stringify(payload.specifications));
  }

  if (payload.variants && payload.variants.length > 0) {
    formData.append("variants", JSON.stringify(payload.variants));
  }

  if (payload.removeImageIds && payload.removeImageIds.length > 0) {
    formData.append("removeImageIds", JSON.stringify(payload.removeImageIds));
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<BackendListResponse<Product>, ProductQueryParams | void>({
      query: (params) => ({
        url: "/products",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const rawList = Array.isArray(response?.data) ? response.data : [];
        return {
          ...response,
          data: rawList.map(normalizeProduct),
        };
      },
      providesTags: ["Product"],
    }),

    getAdminProducts: builder.query<BackendListResponse<Product>, ProductQueryParams | void>({
      query: (params) => ({
        url: "/products/admin",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const rawList = Array.isArray(response?.data) ? response.data : [];
        return {
          ...response,
          data: rawList.map(normalizeProduct),
        };
      },
      providesTags: ["Product"],
    }),

    getInventorySummary: builder.query<{
      total: number;
      outOfStock: number;
      criticalLow: number;
      reserveLow: number;
      inStock: number;
    }, void>({
      query: () => "/products/admin/inventory-summary",
      transformResponse: (response: ApiResponse<any>) => response.data,
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/slug/${slug}`,
      transformResponse: (response: ApiResponse<any>) => normalizeProduct(response.data),
      providesTags: ["Product"],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<any>) => normalizeProduct(response.data),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<Product, FormData | ProductFormPayload>({
      query: (payload) => ({
        url: "/products",
        method: "POST",
        body: payload instanceof FormData ? payload : buildProductFormData(payload),
      }),
      transformResponse: (response: ApiResponse<any>) => normalizeProduct(response.data),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, { id: string; payload: FormData | ProductFormPayload }>({
      query: ({ id, payload }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: payload instanceof FormData ? payload : buildProductFormData(payload),
      }),
      transformResponse: (response: ApiResponse<any>) => normalizeProduct(response.data),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<any>) => normalizeProduct(response.data),
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetAdminProductsQuery,
  useGetInventorySummaryQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
