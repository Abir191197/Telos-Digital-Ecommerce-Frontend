import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";

export interface BackendCartItem {
  id: string;
  customerId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  subtotal: number;
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
  variant?: {
    id: string;
    sku: string;
    color?: string | null;
    size?: string | null;
    weight?: string | null;
    price?: number | null;
    costPrice?: number | null;
    stock: number;
    image?: string | null;
  } | null;
}

export interface MyCartResponse {
  items: BackendCartItem[];
  totalItems: number;
  subtotal: number;
}

export interface BackendMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface BackendListResponse<T> extends ApiResponse<T[]> {
  meta?: BackendMeta;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query<ApiResponse<MyCartResponse>, void>({
      query: () => "/cart/my",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      ApiResponse<MyCartResponse>,
      { productId: string; quantity?: number; variantId?: string }
    >({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      ApiResponse<MyCartResponse>,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<ApiResponse<MyCartResponse>, string>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<ApiResponse<MyCartResponse>, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getAllCarts: builder.query<
      BackendListResponse<BackendCartItem>,
      { page?: number; limit?: number; searchTerm?: string } | void
    >({
      query: (params) => ({
        url: "/cart/all",
        params: params || {},
      }),
      providesTags: ["Cart"],
    }),

    deleteAdminCartItem: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/cart/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    bulkDeleteAdminCartItems: builder.mutation<
      ApiResponse<{ deletedCount: number }>,
      { ids: string[] }
    >({
      query: (body) => ({
        url: "/cart/admin/bulk-delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useGetAllCartsQuery,
  useDeleteAdminCartItemMutation,
  useBulkDeleteAdminCartItemsMutation,
} = cartApi;
