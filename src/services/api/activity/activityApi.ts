import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { ActivityLog } from "@/data/activity-logs";

export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ActivitySummaryResponse {
  totalCount: number;
  criticalCount: number;
  securityCount: number;
}

export interface BackendActivityListResponse extends ApiResponse<ActivityLog[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query<BackendActivityListResponse, ActivityLogQueryParams | void>({
      query: (params) => ({
        url: "/activity-logs",
        params: params || {},
      }),
      providesTags: ["Activity"],
    }),

    getActivitySummary: builder.query<ApiResponse<ActivitySummaryResponse>, void>({
      query: () => "/activity-logs/summary",
      providesTags: ["Activity"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetActivityLogsQuery,
  useGetActivitySummaryQuery,
} = activityApi;