import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
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
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductReviewsQuery, useCreateReviewMutation } = reviewApi;
