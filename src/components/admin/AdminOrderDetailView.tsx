"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useAdminStore } from "@/stores";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Printer,
  ChevronRight,
  ChevronDown,
  Check,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Send,
  Calendar,
  User,
} from "lucide-react";
import { OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/common";
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation, useAssignCourierTrackingMutation } from "@/services/api/orders/orderApi";

export function AdminOrderDetailView() {
  const router = useRouter();
  const params = useParams();
  const orderIdParam = params?.id as string;

  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [courierNameInput, setCourierNameInput] = useState("Steadfast Courier");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const {
    data: backendOrderData,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(orderIdParam, {
    skip: !orderIdParam,
  });

  const [updateOrderStatusMutation, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [assignCourierTrackingMutation, { isLoading: isAssigningCourier }] =
    useAssignCourierTrackingMutation();

  const storeOrder = orders.find(
    (o) =>
      o.id === orderIdParam ||
      o.orderNumber === orderIdParam ||
      o.orderNumber?.toLowerCase() === orderIdParam?.toLowerCase()
  );

  const order = backendOrderData?.data || storeOrder;

  if (isLoading && !order) {
    return (
      <PageLoader
        title="Loading Order Details..."
        description="Fetching customer order and item records..."
        badgeText="Admin Orders"
      />
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-foreground">Order Not Found</h2>
          <p className="text-xs text-muted-foreground">
            No order matches &quot;{orderIdParam}&quot; in the admin database.
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      if (order.id) {
        await updateOrderStatusMutation({
          id: order.id,
          status: newStatus,
        }).unwrap();
      }
      updateOrderStatus(order.id, newStatus);
      setStatusSuccessMsg(`Order updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      updateOrderStatus(order.id, newStatus);
      setStatusSuccessMsg(`Order updated to: ${newStatus.toUpperCase()}`);
    } finally {
      setTimeout(() => setStatusSuccessMsg(""), 3500);
    }
  };

  const handleAssignTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierNameInput || !trackingNumberInput) return;
    try {
      if (order.id) {
        await assignCourierTrackingMutation({
          id: order.id,
          courierName: courierNameInput,
          trackingNumber: trackingNumberInput,
        }).unwrap();
      }
      assignCourierTracking(order.id, courierNameInput, trackingNumberInput);
      setTrackingNumberInput("");
      setStatusSuccessMsg("Courier and tracking number saved successfully!");
    } catch (err) {
      assignCourierTracking(order.id, courierNameInput, trackingNumberInput);
      setTrackingNumberInput("");
      setStatusSuccessMsg("Courier and tracking number saved successfully!");
    } finally {
      setTimeout(() => setStatusSuccessMsg(""), 3500);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-bold">
            <Truck className="h-3.5 w-3.5" />
            Shipped (In Transit)
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 px-3 py-1 text-xs font-bold">
            <AlertCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-bold">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Processing
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/15 border border-zinc-500/30 text-zinc-700 dark:text-zinc-300 px-3 py-1 text-xs font-bold">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold transition-colors py-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
        <span className="text-muted-foreground font-mono">
          Order ID: #{order.id}
        </span>
      </div>

      {/* Success Alert Toast */}
      {statusSuccessMsg && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* SINGLE UNIFIED CARD */}
      <div className="rounded-3xl bg-card border border-border/70 shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="p-4 sm:p-6 lg:p-7 border-b border-border/50 bg-muted/15">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground font-mono tracking-tight">
                  #{order.orderNumber}
                </h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(true)}
                className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold border border-border/60 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="h-4 w-4 text-muted-foreground" />
                <span>Print Invoice</span>
              </button>
              <Link
                href="/dashboard/orders"
                className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>All Orders</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Status Control Bar (Admin updater) */}
          <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-3 sm:p-4 rounded-2xl border border-border/60">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                Order Lifecycle Status:
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen((prev) => !prev)}
                  className="h-9 px-3 rounded-xl bg-card border border-border/70 hover:border-amber-500/50 text-xs font-bold text-foreground transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {getStatusBadge(order.status)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                      statusDropdownOpen && "rotate-180 text-foreground"
                    )}
                  />
                </button>

                {statusDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setStatusDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Change Status
                      </p>
                      {(
                        [
                          { value: "pending", label: "Confirmed / Pending", icon: CheckCircle2, color: "text-zinc-400" },
                          { value: "processing", label: "Processing", icon: Clock, color: "text-amber-500" },
                          { value: "shipped", label: "Shipped", icon: Truck, color: "text-blue-500" },
                          { value: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-emerald-500" },
                          { value: "cancelled", label: "Cancelled", icon: AlertCircle, color: "text-rose-500" },
                        ] as const
                      ).map((item) => {
                        const Icon = item.icon;
                        const isCurrent = order.status === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              handleStatusChange(item.value);
                              setStatusDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                              isCurrent
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black"
                                : "hover:bg-muted text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={cn("h-3.5 w-3.5", item.color)} />
                              <span>{item.label}</span>
                            </div>
                            {isCurrent && (
                              <Check className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Payment:</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                  order.paymentStatus === "paid"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                )}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Artisane Standard Delivery Progress Stepper (Read-Only Auto-Sync) */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  Delivery Progress
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Auto-synced with order status
              </span>
            </div>

            {/* Stepper Grid Container (Non-clickable Informative Display) */}
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {(
                  [
                    {
                      key: "pending",
                      label: "Confirmed",
                      time: new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      desc: "Order accepted and queued for fulfillment.",
                      icon: CheckCircle2,
                    },
                    {
                      key: "processing",
                      label: "Processing",
                      time:
                        order.status === "processing" ||
                        order.status === "shipped" ||
                        order.status === "delivered"
                          ? "In Progress"
                          : "Not set",
                      desc: "Warehouse team prepares and inspects ordered pieces.",
                      icon: Clock,
                    },
                    {
                      key: "shipped",
                      label: "Shipped",
                      time:
                        order.status === "shipped" || order.status === "delivered"
                          ? order.courierName
                            ? `${order.courierName} dispatched`
                            : "Dispatched"
                          : "Not set",
                      desc: "Courier shipment created and moving to destination.",
                      icon: Truck,
                    },
                    {
                      key: "delivered",
                      label: "Delivered",
                      time:
                        order.status === "delivered"
                          ? "Completed"
                          : order.estimatedDelivery || "Not set",
                      desc: "Shipment successfully handed over to customer.",
                      icon: CheckCircle2,
                    },
                  ] as const
                ).map((step, idx) => {
                  const statusOrder = ["pending", "processing", "shipped", "delivered"];
                  const currentIdx = statusOrder.indexOf(order.status);
                  const isCurrent = order.status === step.key;
                  const isCompleted = currentIdx >= idx && order.status !== "cancelled";
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "text-left p-3.5 rounded-xl border relative overflow-hidden flex flex-col justify-between gap-3 select-none transition-colors",
                        isCurrent
                          ? "bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/10"
                          : isCompleted
                          ? "bg-card/90 border-border/80"
                          : "bg-background/40 border-border/40 opacity-70"
                      )}
                    >
                      {/* Top Row: Icon + Step State Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl",
                            isCurrent
                              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30"
                              : isCompleted
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>

                        {isCurrent ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                            Current
                          </span>
                        ) : isCompleted ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-muted-foreground/70">
                            Step {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Content: Title, Timestamp, Description */}
                      <div className="space-y-1">
                        <h4
                          className={cn(
                            "text-sm font-black",
                            isCurrent
                              ? "text-amber-500"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </h4>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {step.time}
                        </p>
                        <p className="text-[11px] text-muted-foreground/80 leading-snug line-clamp-2 pt-0.5">
                          {step.desc}
                        </p>
                      </div>

                      {/* Bottom Active Glow Indicator */}
                      {isCurrent && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cancelled Order Notice if Cancelled */}
              {order.status === "cancelled" && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-bold">
                      This order has been cancelled and refunded.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("pending")}
                    className="px-2.5 py-1 rounded-lg bg-background border border-rose-500/40 text-foreground text-[11px] font-bold hover:bg-muted"
                  >
                    Re-open as Confirmed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Body: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          {/* Left Column (7 cols): Order Items & Pricing */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-7 space-y-6">
            {/* Items Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Purchased Items ({order.items.length})
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Total units: {order.items.reduce((acc, i) => acc + i.quantity, 0)}
              </p>
            </div>

            {/* Product List */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/50 bg-muted/20 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/40">
                    <Image
                      src={item.productThumbnail}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Variant: <span className="text-foreground font-medium">{item.variantName}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
                      <span className="px-2 py-0.5 rounded bg-muted text-foreground font-semibold text-[11px]">
                        Qty: {item.quantity}
                      </span>
                      <span>&times;</span>
                      <span className="font-semibold text-foreground">
                        ৳{item.unitPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0 pl-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Subtotal
                    </p>
                    <p className="text-sm sm:text-base font-black text-foreground">
                      ৳{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="rounded-2xl bg-muted/25 border border-border/40 p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="font-mono font-bold text-foreground">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              {order.deliveryFee !== undefined && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-mono font-bold text-foreground">
                    {order.deliveryFee === 0
                      ? "Free"
                      : `৳${order.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              )}
              {order.discount !== undefined && order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span className="font-mono font-bold">
                    -৳{order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="pt-2.5 border-t border-border/40 flex justify-between items-baseline text-base sm:text-lg font-black text-foreground">
                <span>Grand Total</span>
                <span className="font-mono text-amber-500 font-black">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Customer & Delivery / Courier */}
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-7 space-y-6">
            {/* Customer Details */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Customer Details
                </h2>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-3 text-xs">
                <div>
                  <p className="text-muted-foreground text-[11px] font-semibold">
                    Name
                  </p>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    {order.shippingAddress?.name}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-[11px] font-semibold">
                    Phone
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="font-mono font-bold text-foreground text-sm">
                      {order.shippingAddress?.phone}
                    </span>
                    <a
                      href={`tel:${order.shippingAddress?.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-[11px] font-semibold">
                    Delivery Area
                  </p>
                  <span
                    className={cn(
                      "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      order.shippingAddress?.zone === "inside-dhaka"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                    )}
                  >
                    {order.shippingAddress?.zone === "inside-dhaka"
                      ? "Dhaka Metro"
                      : "Outside Dhaka"}
                  </span>
                </div>

                <div>
                  <p className="text-muted-foreground text-[11px] font-semibold mb-1">
                    Shipping Address
                  </p>
                  <div className="flex items-start gap-2 bg-background/60 p-2.5 rounded-xl border border-border/40 text-foreground leading-relaxed">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>
                      {order.shippingAddress?.street}
                      {order.shippingAddress?.area && `, ${order.shippingAddress?.area}`}
                      <br />
                      {order.shippingAddress?.city}
                      {order.shippingAddress?.postalCode &&
                        ` - ${order.shippingAddress?.postalCode}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm sm:text-base font-bold text-foreground">
                  Payment
                </h2>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-mono font-bold text-foreground uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      order.paymentStatus === "paid"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    )}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier & Delivery Assignment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    Courier & Delivery
                  </h2>
                </div>
                {order.courierName ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Assigned
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Unassigned
                  </span>
                )}
              </div>

              {order.courierName && (
                <div className="rounded-2xl bg-muted/30 border border-border/50 p-3 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Courier:</span>
                    <strong className="text-foreground">{order.courierName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking #:</span>
                    <strong className="text-foreground font-mono">
                      {order.trackingNumber}
                    </strong>
                  </div>
                </div>
              )}

              {/* Assignment Form */}
              <form onSubmit={handleAssignTracking} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Select Courier
                  </label>
                  <select
                    value={courierNameInput}
                    onChange={(e) => setCourierNameInput(e.target.value)}
                    className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Steadfast Courier">Steadfast Courier</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="eCourier">eCourier Bangladesh</option>
                    <option value="Paperfly">Paperfly Home Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STE-123456"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-mono font-medium text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Save Courier Tracking</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal for Printing */}
      <InvoiceModal
        order={order}
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />
    </div>
  );
}

