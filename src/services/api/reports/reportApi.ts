import { baseApi } from "@/lib/rtk-query/baseApi";

export type ReportDatePreset =
  | "today"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom"
  | "all_time";

export interface ReportFilterPayload {
  dateRange?: ReportDatePreset;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  isExport?: boolean;
  status?: string;
  paymentMethod?: string;
  categoryId?: string;
  brandId?: string;
  stockStatus?: string;
}

export interface ReportMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ReportApiResponse<S, I> {
  statusCode?: number;
  success: boolean;
  message: string;
  meta?: ReportMeta;
  data: {
    summary: S;
    items: I[];
  };
}

export interface ProfitReportSummary {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  totalOrders: number;
  averageOrderValue: number;
  deliveredOrdersCount: number;
}

export interface ProfitReportItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string | null;
  itemsCount: number;
  orderTotal: number;
  deliveryFee: number;
  discount: number;
  estimatedCost: number;
  grossProfit: number;
  profitMargin: number;
  orderStatus: string;
  paymentStatus: string;
}

export interface StockReportSummary {
  totalProductsCount: number;
  totalUnitsInStock: number;
  totalInventoryCostValue: number;
  totalInventoryRetailValue: number;
  potentialProfit: number;
  outOfStockCount: number;
  lowStockCount: number;
}

export interface StockReportItem {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  brandName?: string | null;
  stock: number;
  lowStockThreshold: number;
  unitCost: number;
  unitPrice: number;
  totalCostValue: number;
  totalRetailValue: number;
  potentialProfit: number;
  stockStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface LowStockReportSummary {
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  totalUnitsDeficit: number;
  estimatedRestockCost: number;
}

export interface LowStockReportItem {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  brandName?: string | null;
  currentStock: number;
  lowStockThreshold: number;
  deficitUnits: number;
  unitCost: number;
  unitPrice: number;
  estimatedRestockInvestment: number;
  urgency: "CRITICAL" | "WARNING" | "ATTENTION";
  updatedAt: string;
}

export interface TransactionReportSummary {
  totalTransactionsCount: number;
  totalAmount: number;
  successfulAmount: number;
  pendingAmount: number;
  breakdownByMethod: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export interface TransactionReportItem {
  id: string;
  trxId: string | null;
  orderId: string;
  orderNumber: string;
  paymentMethod: string;
  mfsNumber?: string | null;
  amount: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string | null;
}

export interface SalesReportSummary {
  totalGrossSales: number;
  totalNetSales: number;
  totalDiscounts: number;
  totalDeliveryFees: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

export interface SalesReportItem {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerCity: string;
  customerPhone?: string | null;
  itemsCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfitReport: builder.mutation<
      ReportApiResponse<ProfitReportSummary, ProfitReportItem>,
      ReportFilterPayload
    >({
      query: (body) => ({
        url: "/reports/profit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),

    getStockReport: builder.mutation<
      ReportApiResponse<StockReportSummary, StockReportItem>,
      ReportFilterPayload
    >({
      query: (body) => ({
        url: "/reports/stock",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),

    getLowStockReport: builder.mutation<
      ReportApiResponse<LowStockReportSummary, LowStockReportItem>,
      ReportFilterPayload
    >({
      query: (body) => ({
        url: "/reports/low-stock",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),

    getTransactionReport: builder.mutation<
      ReportApiResponse<TransactionReportSummary, TransactionReportItem>,
      ReportFilterPayload
    >({
      query: (body) => ({
        url: "/reports/transactions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),

    getSalesReport: builder.mutation<
      ReportApiResponse<SalesReportSummary, SalesReportItem>,
      ReportFilterPayload
    >({
      query: (body) => ({
        url: "/reports/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfitReportMutation,
  useGetStockReportMutation,
  useGetLowStockReportMutation,
  useGetTransactionReportMutation,
  useGetSalesReportMutation,
} = reportApi;
