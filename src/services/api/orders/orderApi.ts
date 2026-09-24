import { baseApi } from "@/lib/rtk-query/baseApi";
import type { ApiResponse } from "@/types/api.types";
import type { Address, Order, OrderItem, OrderListItem, OrderSource, OrderStatus } from "@/types/order.types";

export type AdminOrderSource = Exclude<OrderSource, "WEBSITE">;

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

export interface CreateAdminOrderPayload extends CreateOrderPayload {
  source: AdminOrderSource;
  customerId?: string;
}
export interface ValidateCheckoutStockItem {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}

export interface ValidateCheckoutStockPayload {
  items: ValidateCheckoutStockItem[];
}

export type StockIssueType =
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "INACTIVE"
  | "NOT_FOUND";

export interface StockIssue {
  productId: string;
  variantId?: string | null;
  productName: string;
  requestedQuantity: number;
  availableStock: number;
  issueType: StockIssueType;
  message: string;
}

export interface ValidateCheckoutStockResponse {
  allValid: boolean;
  issues: StockIssue[];
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

export interface AdminOrderListResponse extends ApiResponse<OrderListItem[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

function normalizeShippingAddress(raw: any): Address {
  const shippingAddress = raw.shippingAddress || raw.customerDetails || {};

  return {
    id: shippingAddress.id || `addr-${raw.id}`,
    name: shippingAddress.name || raw.customerName || "Customer",
    phone: shippingAddress.phone || raw.customerPhone || "",
    street: shippingAddress.street || raw.shippingStreet || "",
    area: shippingAddress.area || raw.shippingArea || shippingAddress.city || raw.shippingCity || "",
    union: shippingAddress.union || raw.shippingUnion || "",
    city: shippingAddress.city || raw.shippingCity || "Dhaka",
    zone: (shippingAddress.zone || raw.shippingZone || "inside-dhaka") as Address["zone"],
    postalCode: shippingAddress.postalCode || raw.shippingPostalCode || "",
    isDefault: Boolean(shippingAddress.isDefault),
    label: (shippingAddress.label || "Home") as Address["label"],
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
    deliveryNote: customerDetails.deliveryNote || undefined,
    email: customerDetails.email || raw.customer?.email || undefined,
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
    source: (raw.source || "WEBSITE") as OrderSource,
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
    deliveryNote: raw.customerDetails?.deliveryNote || raw.deliveryNote || undefined,
    createdByAdminId: raw.createdByAdminId || null,
    createdByAdmin: raw.createdByAdmin || null,
  };
}

export function normalizeOrderListItem(raw: any): OrderListItem {
  const status = (raw.status || "pending").toLowerCase() as OrderStatus;
  const paymentStatus = (raw.paymentStatus || "unpaid").toLowerCase() as "paid" | "unpaid";

  return {
    id: raw.id,
    orderNumber: raw.orderNumber || raw.id,
    createdAt: raw.createdAt,
    status,
    source: (raw.source || "WEBSITE") as OrderSource,
    itemCount: Math.max(0, Number(raw.itemCount ?? raw._count?.items) || 0),
    items: [],
    shippingAddress: normalizeShippingAddress(raw),
    paymentMethod: (raw.paymentMethod || "cod").toLowerCase() as OrderListItem["paymentMethod"],
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
    // Pre-flight stock verification (Public, fast, unauthenticated)
    validateCheckoutStock: builder.mutation<
      ApiResponse<ValidateCheckoutStockResponse>,
      ValidateCheckoutStockPayload
    >({
      query: (body) => ({
        url: "/orders/validate-checkout",
        method: "POST",
        body,
      }),
    }),

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
    createAdminOrder: builder.mutation<ApiResponse<Order>, CreateAdminOrderPayload>({
      query: (body) => ({
        url: "/orders/admin",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<any>) => ({
        ...response,
        data: normalizeBackendOrder(response.data),
      }),
      invalidatesTags: ["Order", "Product", "Customer", "Dashboard"],
    }),

    // Admin lists all orders with filters
    getAllOrders: builder.query<
      AdminOrderListResponse,
      {
        searchTerm?: string;
        status?: string;
        paymentStatus?: string;
        customerId?: string;
        source?: OrderSource;
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
          ? response.data.map(normalizeOrderListItem)
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
  useValidateCheckoutStockMutation,
  useCreateOrderMutation,
  useCreateAdminOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelMyOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useAssignCourierTrackingMutation,
  useUpdateOrderPaymentMutation,
} = orderApi;
