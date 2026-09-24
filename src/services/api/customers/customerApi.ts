import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface CustomerAddress {
  id: string;
  customerId: string;
  type: "HOME" | "OFFICE" | "BILLING" | "SHIPPING" | "OTHER";
  street: string;
  city: string;
  area?: string | null;
  union?: string | null;
  zone?: "inside-dhaka" | "outside-dhaka" | null;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCustomer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: CustomerStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: CustomerAddress[];
  _count?: {
    reviews: number;
    cartItems: number;
    wishlistItems: number;
  };
}

export interface AdminCustomersSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  suspendedCustomers: number;
  newThisMonth: number;
}

export interface AdminCustomersQueryParams {
  searchTerm?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCustomers: builder.query<
      { meta: { page: number; limit: number; total: number; totalPage: number }; data: BackendCustomer[] },
      AdminCustomersQueryParams | void
    >({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => ({
        meta: response.meta || { page: 1, limit: 10, total: response.data?.length || 0, totalPage: 1 },
        data: response.data || [],
      }),
      providesTags: ["Customer"],
    }),

    searchCustomersForAdmin: builder.query<BackendCustomer[], string>({
      query: (q) => ({
        url: "/customers/admin/search",
        method: "GET",
        params: { q },
      }),
      transformResponse: (response: ApiResponse<BackendCustomer[]>) => response.data || [],
      providesTags: ["Customer"],
    }),
    getAdminCustomersSummary: builder.query<AdminCustomersSummary, void>({
      query: () => "/customers/admin/summary",
      transformResponse: (response: ApiResponse<AdminCustomersSummary>) => response.data,
      providesTags: ["Customer"],
    }),

    updateCustomerStatus: builder.mutation<
      BackendCustomer,
      { id: string; status: CustomerStatus }
    >({
      query: ({ id, status }) => ({
        url: `/customers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ApiResponse<BackendCustomer>) => response.data,
      invalidatesTags: ["Customer"],
    }),

    deleteCustomer: builder.mutation<BackendCustomer, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<BackendCustomer>) => response.data,
      invalidatesTags: ["Customer"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminCustomersQuery,
  useSearchCustomersForAdminQuery,
  useLazySearchCustomersForAdminQuery,
  useGetAdminCustomersSummaryQuery,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
} = customerApi;
