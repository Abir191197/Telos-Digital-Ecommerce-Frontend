import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { BackendListResponse } from "@/services/api/cart/cartApi";

export interface BackendWishlistItem {
  id: string;
  customerId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    customerId?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice?: number | null;
    costPrice?: number | null;
    stock: number;
    stockStatus: string;
    thumbnail?: string | null;
    rating?: number;
    reviewCount?: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    brand?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface MyWishlistResponse {
  items: BackendWishlistItem[];
  totalItems: number;
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWishlist: builder.query<ApiResponse<MyWishlistResponse>, void>({
      query: () => "/wishlist/my",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<
      ApiResponse<MyWishlistResponse>,
      { productId: string }
    >({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeWishlistItem: builder.mutation<ApiResponse<MyWishlistResponse>, string>({
      query: (idOrProductId) => ({
        url: `/wishlist/${idOrProductId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation<ApiResponse<MyWishlistResponse>, void>({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getAllWishlists: builder.query<
      BackendListResponse<BackendWishlistItem>,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({
        url: "/wishlist/all",
        params: params || {},
      }),
      providesTags: ["Wishlist"],
    }),

    deleteAdminWishlistItem: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/wishlist/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    bulkDeleteAdminWishlistItems: builder.mutation<
      ApiResponse<{ deletedCount: number }>,
      { ids: string[] }
    >({
      query: (body) => ({
        url: "/wishlist/admin/bulk-delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
  useClearWishlistMutation,
  useGetAllWishlistsQuery,
  useDeleteAdminWishlistItemMutation,
  useBulkDeleteAdminWishlistItemsMutation,
} = wishlistApi;
