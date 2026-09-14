"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAdminStore } from "@/stores";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Send,
  CheckSquare,
  ShieldCheck,
  Building,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";

export function AdminOrderDetailView() {
  const params = useParams();
  const router = useRouter();
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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-bold shadow-xs">
            <Truck className="h-3.5 w-3.5" />
            In Transit (Shipped)
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-600 px-3 py-1 text-xs font-bold shadow-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-bold shadow-xs">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Processing & QC
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/20 border border-zinc-500/30 text-zinc-700 dark:text-zinc-300 px-3 py-1 text-xs font-bold shadow-xs">
            <Clock className="h-3.5 w-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Top Hero Telemetry Ribbon (Full Width & Mobile Optimized) ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/30 p-4 sm:p-7 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/10 via-blue-500/10 to-transparent blur-3xl" />
        
        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5">
          {/* Left Title & Status */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all active:scale-95 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-amber-500 uppercase">
                  Consignment #{order.id}
                </span>
                {getStatusBadge(order.status)}
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight font-mono mt-1 truncate">
                #{order.orderNumber}
              </h1>
              <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 flex items-center gap-1.5 flex-wrap">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80 shrink-0" />
                <span>
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto justify-between sm:justify-start pt-2 xl:pt-0 border-t xl:border-t-0 border-border/30">
            {/* Print Invoice */}
            <button
              type="button"
              onClick={() => setInvoiceModalOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-card border border-border/60 hover:bg-muted/60 text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>

            <Link
              href="/dashboard/orders"
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>All Orders</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick KPI Strip inside Header */}
        <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Amount
            </p>
            <p className="text-lg sm:text-xl font-mono font-black text-amber-500">
              ৳{order.total.toLocaleString()}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment
            </p>
            <p className="text-xs sm:text-sm font-bold uppercase text-foreground">
              {order.paymentMethod} &bull; {order.paymentStatus}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Customer
            </p>
            <p className="text-xs sm:text-sm font-bold text-foreground truncate">
              {order.shippingAddress.name}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Destination
            </p>
            <p className="text-xs sm:text-sm font-bold text-foreground truncate">
              {order.shippingAddress.city} ({order.shippingAddress.zone === "inside-dhaka" ? "Dhaka Metro" : "Outside"})
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {statusSuccessMsg && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {/* ── Main Full-Width Multi-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Columns (8 cols): Cinematic Items Display & Logistics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Section */}
          <div className="rounded-3xl bg-card p-5 sm:p-7 admin-card border border-border/60 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-foreground">
                    Purchased Merchandise
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} items &bull; Total{" "}
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                  </p>
                </div>
              </div>
            </div>

            {/* Movie-Style High-Detail Product List */}
            <div className="grid grid-cols-1 gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/20 p-4 hover:border-amber-500/40 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-muted shadow-md group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-foreground text-sm sm:text-base leading-snug">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground">
                          Variant: <strong className="text-foreground">{item.variantName}</strong>
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1 font-mono text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold">
                          Qty: {item.quantity}
                        </span>
                        <span>&times;</span>
                        <span className="font-semibold text-foreground">
                          ৳{item.unitPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40 font-mono">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Subtotal
                    </p>
                    <p className="font-black text-lg sm:text-xl text-foreground">
                      ৳{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Ledger & Breakdown */}
            <div className="pt-4 border-t border-border/40 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({order.items.length} items)</span>
                <span className="font-mono font-bold text-foreground">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              {order.deliveryFee !== undefined && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping & Handling</span>
                  <span className="font-mono font-bold text-foreground">
                    {order.deliveryFee === 0 ? "Free Shipping" : `৳${order.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              )}
              {order.discount !== undefined && order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Promotional Discount</span>
                  <span className="font-mono font-bold">-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-black text-foreground pt-3 border-t border-border/40">
                <span>Grand Total</span>
                <span className="font-mono text-amber-500 font-black">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Courier Assignment */}
          <div className="rounded-3xl bg-card p-5 sm:p-7 admin-card border border-border/60 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-foreground">
                    Logistics & Courier Assignment
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Consignment tracking and delivery carrier dispatch
                  </p>
                </div>
              </div>
              {order.courierName ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Dispatched
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                  Awaiting Courier
                </span>
              )}
            </div>

            {order.courierName ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Courier Partner</span>
                  <strong className="text-foreground font-bold text-sm mt-0.5 block">
                    {order.courierName}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tracking / Consignment</span>
                  <strong className="text-foreground font-mono font-black text-sm mt-0.5 block">
                    {order.trackingNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Est. Delivery</span>
                  <span className="text-foreground font-semibold text-sm mt-0.5 block">
                    {order.estimatedDelivery || "1-3 Business Days"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No courier has been assigned yet. Assign Steadfast, Pathao, or RedX with consignment code.
              </p>
            )}

            {/* Quick Courier Assignment Form */}
            <form onSubmit={handleAssignTracking} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Courier Partner
                  </label>
                  <select
                    value={courierNameInput}
                    onChange={(e) => setCourierNameInput(e.target.value)}
                    className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Steadfast Courier">Steadfast Courier (API)</option>
                    <option value="Pathao Courier">Pathao Courier</option>
                    <option value="RedX Logistics">RedX Logistics</option>
                    <option value="eCourier">eCourier Bangladesh</option>
                    <option value="Paperfly">Paperfly Home Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">
                    Consignment / Tracking #
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STE-94281"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Save & Assign Courier</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Columns (4 cols): Quick Status HUD & Customer Dossier */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Lifecycle Status Controller */}
          <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <CheckSquare className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-black text-foreground">
                Lifecycle Status
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">Select Status:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="h-11 w-full rounded-2xl bg-muted/50 border border-border/60 px-3.5 text-xs font-bold text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="pending">Pending Verification</option>
                <option value="processing">Processing & QC Inspection</option>
                <option value="shipped">Handed to Courier (In Transit)</option>
                <option value="delivered">Delivered Successfully</option>
                <option value="cancelled">Cancelled & Refunded</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleStatusChange("processing")}
                disabled={order.status === "processing"}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  order.status === "processing"
                    ? "bg-amber-500/20 text-amber-600 opacity-60 cursor-not-allowed"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                Mark Processing
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange("shipped")}
                disabled={order.status === "shipped"}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  order.status === "shipped"
                    ? "bg-blue-500/20 text-blue-600 opacity-60 cursor-not-allowed"
                    : "bg-muted/70 text-foreground hover:bg-muted"
                )}
              >
                Mark Shipped
              </button>
            </div>
          </div>

          {/* Customer Shipping Profile Card */}
          <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <User className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-black text-foreground">
                Customer Dossier
              </h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-muted-foreground text-[11px] font-semibold">Customer Name</p>
                <p className="font-extrabold text-foreground text-sm mt-0.5">
                  {order.shippingAddress.name}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-[11px] font-semibold">Phone Contact</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {order.shippingAddress.phone}
                  </span>
                  <a
                    href={`tel:${order.shippingAddress.phone}`}
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-[11px] font-semibold">Delivery Zone</p>
                <span
                  className={cn(
                    "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    order.shippingAddress.zone === "inside-dhaka"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                  )}
                >
                  {order.shippingAddress.zone === "inside-dhaka" ? "Dhaka Metro" : "Outside Dhaka"}
                </span>
              </div>

              <div>
                <p className="text-muted-foreground text-[11px] font-semibold">Delivery Address</p>
                <p className="text-foreground font-medium mt-1 leading-relaxed bg-muted/30 p-3 rounded-2xl border border-border/40">
                  {order.shippingAddress.street}
                  {order.shippingAddress.area && `, ${order.shippingAddress.area}`}
                  <br />
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method & Security Card */}
          <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-3.5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <h2 className="text-sm font-black text-foreground">
                Payment Verification
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <strong className="text-foreground uppercase font-mono font-bold">
                  {order.paymentMethod}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
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
