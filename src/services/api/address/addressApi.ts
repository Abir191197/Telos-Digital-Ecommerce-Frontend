// Address API Endpoints
// Injected into the single baseApi instance.

import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Address } from "@/types/order.types";

export interface BackendAddress {
  id: string;
  customerId: string;
  name?: string | null;
  phone?: string | null;
  title?: string | null;
  type: "SHIPPING" | "BILLING";
  isDefault: boolean;
  street: string;
  city: string;
  area?: string | null;
  union?: string | null;
  zone?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  name: string;
  phone: string;
  title?: string;
  type?: "SHIPPING" | "BILLING";
  isDefault?: boolean;
  street: string;
  city: string;
  area?: string;
  union?: string;
  zone?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

export const mapBackendAddressToFrontend = (addr: BackendAddress): Address => ({
  id: addr.id,
  name: addr.name || "Customer",
  phone: addr.phone || "",
  street: addr.street,
  area: addr.area || addr.city,
  union: addr.union || undefined,
  city: addr.city,
  zone:
    addr.zone === "inside-dhaka" || addr.city.toLowerCase().includes("dhaka")
      ? "inside-dhaka"
      : "outside-dhaka",
  postalCode: addr.postalCode || "",
  isDefault: addr.isDefault,
  label:
    addr.title === "Office"
      ? "Office"
      : addr.title === "Home" || !addr.title
      ? "Home"
      : "Other",
});

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => "/customers/addresses",
      transformResponse: (response: ApiResponse<BackendAddress[]>) => {
        if (!response.data || !Array.isArray(response.data)) return [];
        return response.data.map(mapBackendAddressToFrontend);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Address" as const, id })),
              { type: "Address" as const, id: "LIST" },
            ]
          : [{ type: "Address" as const, id: "LIST" }],
    }),

    createAddress: builder.mutation<Address, CreateAddressRequest>({
      query: (body) => ({
        url: "/customers/addresses",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<BackendAddress>) =>
        mapBackendAddressToFrontend(response.data),
      invalidatesTags: [{ type: "Address", id: "LIST" }, "User"],
    }),

    updateAddress: builder.mutation<
      Address,
      { id: string; body: UpdateAddressRequest }
    >({
      query: ({ id, body }) => ({
        url: `/customers/addresses/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<BackendAddress>) =>
        mapBackendAddressToFrontend(response.data),
      invalidatesTags: (result, error, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
        "User",
      ],
    }),

    setDefaultAddress: builder.mutation<Address, string>({
      query: (id) => ({
        url: `/customers/addresses/${id}/default`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<BackendAddress>) =>
        mapBackendAddressToFrontend(response.data),
      invalidatesTags: [{ type: "Address", id: "LIST" }, "User"],
    }),

    deleteAddress: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/customers/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
        "User",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
