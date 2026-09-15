"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminStore } from "@/stores";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import {
  OrderDetailHeader,
  OrderDetailItemsCard,
  OrderDetailLogisticsCard,
  OrderDetailStatusCard,
  OrderDetailCustomerCard,
  OrderDetailPaymentCard,
} from "./order-detail";

export function AdminOrderDetailView() {
  const params = useParams();
  const orderIdParam = params?.id as string;

  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [courierNameInput, setCourierNameInput] = useState("Steadfast Courier");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [statusSuccessMsg, setStatusSuccessMsg] = useState("");

  const order = orders.find(
    (o) =>
      o.id === orderIdParam ||
      o.orderNumber === orderIdParam ||
      o.orderNumber.toLowerCase() === orderIdParam?.toLowerCase()
  );

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

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
    setStatusSuccessMsg(`Order marked as ${newStatus.toUpperCase()}`);
    setTimeout(() => setStatusSuccessMsg(""), 3000);
  };

  const handleAssignTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierNameInput || !trackingNumberInput) return;
    assignCourierTracking(order.id, courierNameInput, trackingNumberInput);
    setTrackingNumberInput("");
    setStatusSuccessMsg("Courier and tracking code assigned!");
    setTimeout(() => setStatusSuccessMsg(""), 3000);
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Top Hero Telemetry Ribbon */}
      <OrderDetailHeader
        order={order}
        onOpenInvoice={() => setInvoiceModalOpen(true)}
      />

      {/* Success Notification Alert */}
      {statusSuccessMsg && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* Main Full-Width Multi-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Columns (8 cols): Purchased Items Display & Logistics */}
        <div className="lg:col-span-8 space-y-6">
          <OrderDetailItemsCard order={order} />

          <OrderDetailLogisticsCard
            order={order}
            courierNameInput={courierNameInput}
            setCourierNameInput={setCourierNameInput}
            trackingNumberInput={trackingNumberInput}
            setTrackingNumberInput={setTrackingNumberInput}
            onAssignTracking={handleAssignTracking}
          />
        </div>

        {/* Right Columns (4 cols): Quick Status HUD & Customer Dossier */}
        <div className="lg:col-span-4 space-y-6">
          <OrderDetailStatusCard
            order={order}
            onStatusChange={handleStatusChange}
          />

          <OrderDetailCustomerCard order={order} />

          <OrderDetailPaymentCard order={order} />
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
