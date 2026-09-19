import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Address, Order, OrderItem, OrderStatus } from "@/types/order.types";

export interface CreateOrderPayload {
  items: {
    productId?: string;
    variantId?: string;
    productName: string;
    productThumbnail?: string | null;
    productSku?: string | null;
    variantName?: string | null;
    unitPrice: number;
    quantity: number;
  }[];
  customerDetails: {
    name: string;
    phone: string;
    email?: string | null;
    street: string;
    area?: string | null;
    union?: string | null;
    city: string;
    zone: "inside-dhaka" | "outside-dhaka";
    postalCode?: string | null;
    label?: string | null;
    deliveryNote?: string | null;
  };
  transaction?: {
    paymentMethod: string;
    trxId?: string | null;
    mfsNumber?: string | null;
    amount?: number;
  };
  deliveryFee?: number;
  discount?: number;
  couponCode?: string | null;
}

export interface OrderStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingDispatchCount: number;
  totalRevenue: number;
}

export interface BackendOrderListResponse extends ApiResponse<Order[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export function normalizeBackendOrder(raw: any): Order {
  if (!raw) return raw;

  const status = (raw.status || "pending").toLowerCase() as OrderStatus;
  const paymentStatus = (raw.paymentStatus || "unpaid").toLowerCase() as "paid" | "unpaid";

  const customerDetails = raw.customerDetails || raw.shippingAddress || {};
  const shippingAddress: Address = {
    id: customerDetails.id || "addr-" + raw.id,
    name: customerDetails.name || raw.customer?.name || "Customer",
    phone: customerDetails.phone || raw.customer?.phone || "",
    street: customerDetails.street || "",
    area: customerDetails.area || customerDetails.city || "",
    union: customerDetails.union || "",
    city: customerDetails.city || "Dhaka",
    zone: (customerDetails.zone || "inside-dhaka") as "inside-dhaka" | "outside-dhaka",
    postalCode: customerDetails.postalCode || "",
    isDefault: Boolean(customerDetails.isDefault),
    label: (customerDetails.label || "Home") as "Home" | "Office" | "Other",
  };

  const items: OrderItem[] = Array.isArray(raw.items)
    ? raw.items.map((item: any) => ({
        id: item.id,
        productId: item.productId || item.product?.id || "",
        productName: item.productName || item.product?.name || "Product",
        productThumbnail: item.productThumbnail || item.product?.thumbnail || "",
        variantName: item.variantName || item.variant?.name || undefined,
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
        subtotal:
          Number(item.subtotal) ||
          (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
      }))
    : [];

  const firstTrx =
    Array.isArray(raw.transactions) && raw.transactions.length > 0
      ? raw.transactions[0]
      : null;
  const paymentMethod = (
    firstTrx?.paymentMethod ||
    raw.paymentMethod ||
    "cod"
  ).toLowerCase() as any;

  return {
    id: raw.id,
    orderNumber: raw.orderNumber || raw.id,
    createdAt: raw.createdAt,
    status,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    subtotal: Number(raw.subtotal) || 0,
    deliveryFee: Number(raw.deliveryFee) || 0,
    discount: Number(raw.discount) || 0,
    total: Number(raw.total) || 0,
    trackingNumber: raw.trackingNumber || undefined,
    courierName: raw.courierName || undefined,
    estimatedDelivery: raw.estimatedDelivery || undefined,
  };
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer / Guest creates order
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Cart", "Product", "Dashboard"],
    }),

    // Customer gets own orders
    getMyOrders: builder.query<
      BackendOrderListResponse,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/orders/my",
        params: params || {},
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: Array.isArray(response.data)
          ? response.data.map(normalizeBackendOrder)
          : [],
      }),
      providesTags: ["Order"],
    }),

    // Customer gets single order details
    getMyOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/my/${id}`,
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      providesTags: ["Order"],
    }),

    // Customer cancels order
    cancelMyOrder: builder.mutation<ApiResponse<Order>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/my/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Product", "Dashboard"],
    }),

    // Admin lists all orders with filters
    getAllOrders: builder.query<
      BackendOrderListResponse,
      {
        searchTerm?: string;
        status?: string;
        paymentStatus?: string;
        customerId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      } | void
    >({
      query: (params) => ({
        url: "/orders",
        params: params || {},
      }),
      transformResponse: (response: any) => ({
        ...response,
        data: Array.isArray(response.data)
          ? response.data.map(normalizeBackendOrder)
          : [],
      }),
      providesTags: ["Order"],
    }),

    // Admin gets single order by ID or orderNumber (e.g. TC-94281)
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      providesTags: ["Order"],
    }),

    // Admin gets order KPIs & stats
    getOrderStats: builder.query<ApiResponse<OrderStatsResponse>, void>({
      query: () => "/orders/stats",
      providesTags: ["Order"],
    }),

    // Admin updates order status
    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { id: string; status: string; cancelReason?: string }
    >({
      query: ({ id, status, cancelReason }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: {
          status: status.toUpperCase(),
          cancelReason,
        },
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Product", "Dashboard"],
    }),

    // Admin assigns courier and tracking number
    assignCourierTracking: builder.mutation<
      ApiResponse<Order>,
      { id: string; courierName: string; trackingNumber: string; estimatedDelivery?: string }
    >({
      query: ({ id, courierName, trackingNumber, estimatedDelivery }) => ({
        url: `/orders/${id}/courier`,
        method: "PATCH",
        body: { courierName, trackingNumber, estimatedDelivery },
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Dashboard"],
    }),

    // Admin updates order payment
    updateOrderPayment: builder.mutation<
      ApiResponse<Order>,
      { id: string; paymentStatus?: string; transactionStatus?: string; trxId?: string; note?: string }
    >({
      query: ({ id, paymentStatus, transactionStatus, trxId, note }) => ({
        url: `/orders/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus, transactionStatus, trxId, note },
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelMyOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useAssignCourierTrackingMutation,
  useUpdateOrderPaymentMutation,
} = orderApi;
