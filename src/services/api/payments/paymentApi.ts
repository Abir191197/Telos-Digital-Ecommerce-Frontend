import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";

export interface PaymentFilterQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  method?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BackendPaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amount: number;
  method: "bkash" | "nagad" | "card" | "cod";
  trxId: string | null;
  mfsNumber: string | null;
  date: string;
  status: "verified" | "pending_verification" | "rejected" | "settled";
  note?: string | null;
}

export interface PaymentStats {
  totalVolume: number;
  verifiedVolume: number;
  pendingVolume: number;
  rejectedVolume: number;
  totalCount: number;
  pendingCount: number;
}

export interface PaymentsResponseData {
  stats: PaymentStats;
  transactions: BackendPaymentTransaction[];
}

export interface VerifyPaymentPayload {
  id: string;
  status: "verified" | "rejected" | "pending" | "settled";
  note?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query<
      ApiResponse<PaymentsResponseData>,
      PaymentFilterQueryParams | void
    >({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Payment"],
    }),

    verifyPayment: builder.mutation<
      ApiResponse<BackendPaymentTransaction>,
      VerifyPaymentPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/payments/${id}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Payment", "Order", "Report"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPaymentsQuery,
  useVerifyPaymentMutation,
} = paymentApi;
