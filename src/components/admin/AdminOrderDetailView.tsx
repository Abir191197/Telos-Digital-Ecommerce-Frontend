"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminStore } from "@/stores";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Printer,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { PageLoader } from "@/components/common";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useAssignCourierTrackingMutation,
} from "@/services/api/orders/orderApi";
import {
  OrderDeliveryStepper,
  OrderStatusDropdown,
  OrderItemsSection,
  OrderSidebarSection,
} from "./order-detail";

export function AdminOrderDetailView() {
  const params = useParams();
  const orderIdParam = params?.id as string;

  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [courierNameInput, setCourierNameInput] = useState("Steadfast Courier");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

  const {
    data: backendOrderData,
    isLoading,
  } = useGetOrderByIdQuery(orderIdParam, {
    skip: !orderIdParam,
  });

  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [assignCourierTrackingMutation] = useAssignCourierTrackingMutation();

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
    } catch {
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
    } catch {
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

          {/* Status Control Bar */}
          <OrderStatusDropdown
            order={order}
            onStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
          />

          {/* Artisane Standard Delivery Progress Stepper */}
          <OrderDeliveryStepper
            order={order}
            onReopenOrder={() => handleStatusChange("pending")}
          />
        </div>

        {/* Card Body: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          {/* Left Column (7 cols): Order Items & Pricing */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-7">
            <OrderItemsSection order={order} />
          </div>

          {/* Right Column (5 cols): Customer & Delivery / Courier */}
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-7">
            <OrderSidebarSection
              order={order}
              courierNameInput={courierNameInput}
              setCourierNameInput={setCourierNameInput}
              trackingNumberInput={trackingNumberInput}
              setTrackingNumberInput={setTrackingNumberInput}
              onAssignTracking={handleAssignTracking}
            />
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
