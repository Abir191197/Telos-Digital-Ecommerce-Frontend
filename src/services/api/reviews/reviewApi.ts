import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { ProductReview } from "@/types/ecommerce.types";

export type CreateReviewPayload = {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
};

export type ProductReviewsResponse = {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<number, number>;
  data: ProductReview[];
};

export type BackendAdminReview = {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  isVisible: boolean;
  status: "PUBLISHED" | "HIDDEN" | "FLAGGED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    thumbnail: string | null;
    price: string | number;
    rating: number;
    reviewCount: number;
  };
  customer: {
    id: string;
    customerId: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
  };
};

export type AdminReviewsSummary = {
  totalCount: number;
  avgRating: number;
  hiddenCount: number;
  flaggedCount: number;
  publishedCount: number;
};

export type AdminReviewsQueryParams = {
  searchTerm?: string;
  status?: string;
  rating?: string | number;
  isVisible?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ProductReviewsResponse, string>({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (response: ApiResponse<ProductReviewsResponse>) => response.data,
      providesTags: ["Product"],
    }),

    createReview: builder.mutation<ProductReview, CreateReviewPayload>({
      query: (payload) => ({
        url: "/reviews",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: ApiResponse<ProductReview>) => response.data,
      invalidatesTags: ["Product", "Review"],
    }),

    getAdminReviews: builder.query<
      { meta: { page: number; limit: number; total: number; totalPage: number }; data: BackendAdminReview[] },
      AdminReviewsQueryParams | void
    >({
      query: (params) => ({
        url: "/reviews/admin",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => ({
        meta: response.meta,
        data: response.data,
      }),
      providesTags: ["Review"],
    }),

    getAdminReviewsSummary: builder.query<AdminReviewsSummary, void>({
      query: () => "/reviews/admin/summary",
      transformResponse: (response: ApiResponse<AdminReviewsSummary>) => response.data,
      providesTags: ["Review"],
    }),

    toggleReviewVisibility: builder.mutation<
      BackendAdminReview,
      { id: string; status?: "PUBLISHED" | "HIDDEN" | "FLAGGED"; isVisible?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/reviews/admin/${id}/visibility`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<BackendAdminReview>) => response.data,
      invalidatesTags: ["Review", "Product"],
    }),

    deleteReview: builder.mutation<BackendAdminReview, string>({
      query: (id) => ({
        url: `/reviews/admin/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<BackendAdminReview>) => response.data,
      invalidatesTags: ["Review", "Product"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetAdminReviewsQuery,
  useGetAdminReviewsSummaryQuery,
  useToggleReviewVisibilityMutation,
  useDeleteReviewMutation,
} = reviewApi;
