import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Order } from "@/types/order.types";

export interface DashboardKpis {
  grossRevenue: number;
  grossRevenueChange: string;
  grossRevenuePositive: boolean;
  completedOrders: number;
  completedOrdersChange: string;
  completedOrdersPositive: boolean;
  avgOrderValue: number;
  avgOrderValueChange: string;
  avgOrderValuePositive: boolean;
  pendingOrders: number;
  pendingOrdersChange: string;
  pendingOrdersPositive: boolean;
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
  secondary: number;
}

export interface RevenueAnalyticsResponse {
  viewMode: "daily" | "monthly";
  pace: string;
  totalSales: number;
  data: RevenueDataPoint[];
}

export interface PaymentChannelItem {
  name: string;
  method: string;
  volume: string;
  rawVolume: number;
  pct: number;
  color: string;
  barColor: string;
}

export interface PaymentChannelsResponse {
  cashlessPercentage: number;
  channels: PaymentChannelItem[];
}

export interface StockAlertItem {
  id: string;
  name: string;
  thumbnail: string;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  price: number;
}

export interface StockAlertsResponse {
  lowStockCount: number;
  criticalCount: number;
  totalCatalogCount: number;
  items: StockAlertItem[];
}

export interface ActionCenterResponse {
  unverifiedPayments: number;
  pendingDispatch: number;
  lowStockCount: number;
  pendingReviews: number;
}

export interface TopProductItem {
  id: string;
  name: string;
  thumbnail: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  category: string;
}

export interface RecentActivityItem {
  id: string;
  actorName: string;
  actorAvatar: string | null;
  action: string;
  entity: string;
  category: string;
  severity: string;
  details: string;
  timestamp: string;
}

export interface DashboardFilterParams {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardKpis: builder.query<ApiResponse<DashboardKpis>, void>({
      query: () => "/dashboard/kpis",
      providesTags: ["Dashboard"],
    }),

    getRevenueAnalytics: builder.query<
      ApiResponse<RevenueAnalyticsResponse>,
      "daily" | "monthly" | void
    >({
      query: (viewMode = "daily") =>
        `/dashboard/revenue-analytics?viewMode=${viewMode}`,
      providesTags: ["Dashboard"],
    }),

    getPaymentChannels: builder.query<
      ApiResponse<PaymentChannelsResponse>,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "/dashboard/payment-channels",
        params: params || {},
      }),
      providesTags: ["Dashboard", "Payment"],
    }),

    getStockAlerts: builder.query<ApiResponse<StockAlertsResponse>, void>({
      query: () => "/dashboard/stock-alerts",
      providesTags: ["Dashboard", "Product"],
    }),

    getActionCenter: builder.query<ApiResponse<ActionCenterResponse>, void>({
      query: () => "/dashboard/action-center",
      providesTags: ["Dashboard", "Order", "Payment", "Product"],
    }),

    getTopProducts: builder.query<
      ApiResponse<TopProductItem[]>,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "/dashboard/top-products",
        params: params || {},
      }),
      providesTags: ["Dashboard", "Product", "Order"],
    }),

    getRecentOrders: builder.query<
      ApiResponse<Order[]>,
      DashboardFilterParams | void
    >({
      query: (params) => ({
        url: "/dashboard/recent-orders",
        params: params || {},
      }),
      providesTags: ["Dashboard", "Order"],
    }),

    getRecentActivities: builder.query<ApiResponse<RecentActivityItem[]>, void>({
      query: () => "/dashboard/recent-activities",
      providesTags: ["Dashboard", "Activity"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardKpisQuery,
  useGetRevenueAnalyticsQuery,
  useGetPaymentChannelsQuery,
  useGetStockAlertsQuery,
  useGetActionCenterQuery,
  useGetTopProductsQuery,
  useGetRecentOrdersQuery,
  useGetRecentActivitiesQuery,
} = dashboardApi;
