import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Product } from "@/types/ecommerce.types";

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
    rating: item.rating || 5.0,
    reviewCount: item.reviewCount || 0,
    stock: Number(item.stock) || 0,
    inStock: (Number(item.stock) || 0) > 0,
    isFeatured: Boolean(item.isFeatured),
    isFlashDeal: Boolean(item.isFlashDeal),
    isNewArrival: Boolean(item.isNewArrival ?? true),
    badge: item.storefrontBadgeText || item.badge || undefined,
    images,
    thumbnail,
    brand: item.brand?.name || (typeof item.brand === "string" ? item.brand : "Brand"),
    sku: item.sku || "",
    specifications: item.specifications || {},
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
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
