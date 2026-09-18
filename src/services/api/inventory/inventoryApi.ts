import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";

export type StockAdjustmentPayload = {
  productId: string;
  actionType: "INCREASE" | "DECREASE";
  quantity: number;
  reason: string;
  note?: string;
};

export type StockAuditLog = {
  id: string;
  productId: string;
  actionType: "INCREASE" | "DECREASE";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  note?: string | null;
  performedBy?: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    slug: string;
    thumbnail?: string | null;
    price: number;
    category?: { name: string } | null;
  };
};

export type AuditLogQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  productId?: string;
  actionType?: "INCREASE" | "DECREASE";
  reason?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type AuditSummaryData = {
  totalLogs: number;
  totalAdded: number;
  totalRemoved: number;
  netChange: number;
};

type BackendMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type BackendAuditListResponse = ApiResponse<StockAuditLog[]> & {
  meta?: BackendMeta;
};

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adjustStock: builder.mutation<
      ApiResponse<{ product: any; auditLog: StockAuditLog }>,
      StockAdjustmentPayload
    >({
      query: (payload) => ({
        url: "/inventory/adjust",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Product"],
    }),

    getAuditLogs: builder.query<BackendAuditListResponse, AuditLogQueryParams | void>({
      query: (params) => ({
        url: "/inventory/audit-logs",
        params: params || {},
      }),
      providesTags: ["Product"],
    }),

    getAuditSummary: builder.query<AuditSummaryData, void>({
      query: () => "/inventory/audit-summary",
      transformResponse: (response: ApiResponse<AuditSummaryData>) => response.data,
      providesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdjustStockMutation,
  useGetAuditLogsQuery,
  useGetAuditSummaryQuery,
} = inventoryApi;
