"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdminStore } from "@/stores";
import {
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  Phone,
  Calendar,
  Box,
  BadgeCheck,
  ShieldAlert,
  DollarSign,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { KpiCard } from "./dashboard/KpiCard";

export function AdminOrdersView() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  React.useEffect(() => {
    const st = searchParams?.get("status");
    if (st) {
      setStatusFilter(st);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [courierNameInput, setCourierNameInput] = useState("");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");

  // KPI Calculations
  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const inTransitCount = orders.filter((o) => o.status === "shipped").length;
  const completedCount = orders.filter((o) => o.status === "delivered").length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.shippingAddress.name.toLowerCase().includes(query) ||
      order.shippingAddress.phone.includes(query) ||
      order.shippingAddress.city.toLowerCase().includes(query) ||
      order.trackingNumber?.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-1 text-[11px] font-bold">
            <Truck className="h-3.5 w-3.5" />
            In Transit
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 px-2.5 py-1 text-[11px] font-bold">
            <AlertCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-[11px] font-bold">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Processing
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 text-[11px] font-bold">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
    }
  };

  const handleAssignTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !courierNameInput || !trackingNumberInput) return;
    assignCourierTracking(
      selectedOrder.id,
      courierNameInput,
      trackingNumberInput
    );
    setSelectedOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "shipped",
            courierName: courierNameInput,
            trackingNumber: trackingNumberInput,
          }
        : null
    );
    setCourierNameInput("");
    setTrackingNumberInput("");
  };

  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)]">
      {/* ── Header Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {statusFilter === "pending" ? "Pending Orders & QC" : "Orders & Fulfillment"}
            </h1>
            {statusFilter === "pending" ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Clock className="h-3 w-3 animate-pulse" />
                Action Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border border-border/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Feed
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {statusFilter === "pending"
              ? "Orders awaiting merchant approval, QC verification, and courier packaging"
              : "Real-time fulfillment, dispatch logistics, and invoice management"}
          </p>
        </div>

        {/* Top Header info (Hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-card border-none admin-card text-xs font-bold text-foreground flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">
              {statusFilter === "pending" ? "Pending:" : "Count:"}
            </span>
            <span className={cn(statusFilter === "pending" && "text-amber-500 font-black")}>
              {filteredOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4 Essential Orders KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Fulfillment Volume"
          rawValue={totalVolume}
          prefix="৳"
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
        />
        <KpiCard
          title="Pending / QC"
          rawValue={pendingCount}
          change={pendingCount > 0 ? "Needs Action" : "All Clear"}
          isPositive={pendingCount === 0}
          icon={Clock}
        />
        <KpiCard
          title="In Transit Courier"
          rawValue={inTransitCount}
          change="Real-time Logistics"
          isPositive={true}
          icon={Truck}
        />
        <KpiCard
          title="Delivered Successfully"
          rawValue={completedCount}
          change="98.5% Rate"
          isPositive={true}
          icon={PackageCheck}
        />
      </div>

      {/* ── Sticky Filter, Search & View Toggle Dock (Full-width edge-to-edge on mobile, rounded card on desktop) ── */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-4 py-2.5 sm:py-3 bg-background/95 sm:bg-card/90 backdrop-blur-xl border-y sm:border sm:rounded-2xl border-border/50 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 transition-all">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order #, customer name, phone, city, or courier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 sm:h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-foreground/20 focus:outline-none transition-all placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills + View Mode Toggle Container */}
        <div className="flex items-center justify-between gap-2">
          {/* Touch-swipeable Status Pills with subtle right fade hint */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x overscroll-x-contain select-none">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "processing", label: "Processing" },
                { id: "shipped", label: "In Transit" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ].map((pill) => {
                const isSelected = statusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentY = window.scrollY;
                      setStatusFilter(pill.id);
                      requestAnimationFrame(() => {
                        window.scrollTo({ top: currentY, behavior: "instant" });
                      });
                    }}
                    className={cn(
                      "h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 select-none",
                      isSelected
                        ? "bg-foreground text-background shadow-xs font-black"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
            {/* Subtle mobile right fade hint */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background sm:from-card to-transparent sm:hidden" />
          </div>

          <div className="h-4 w-[1px] bg-border/60 shrink-0 hidden sm:block mx-1" />

          {/* View Mode Toggle (Table / Card) - Hidden on Mobile, always dedicated Card view on mobile */}
          <div className="hidden sm:flex items-center justify-end p-1 rounded-xl bg-muted/70 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Card Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── View Mode: Cards or Table (Mobile is ALWAYS Dedicated Card View) ── */}
      {/* 1. DEDICATED CARD VIEW: Always rendered on mobile, or when viewMode === 'card' on desktop */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px]",
          viewMode === "table" && "sm:hidden"
        )}
      >
          {filteredOrders.length === 0 ? (
            <div className="col-span-full admin-card rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[380px]">
              <Box className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="font-bold text-foreground text-sm">No orders found</p>
              <p className="text-xs mt-0.5">Try clearing your filters or search query.</p>
            </div>
          ) : (
            paginatedOrders.map((order) => {
              const statusAccents: Record<OrderStatus, { bar: string; glow: string; text: string }> = {
                delivered: {
                  bar: "bg-emerald-500",
                  glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]",
                  text: "text-emerald-600 dark:text-emerald-400",
                },
                shipped: {
                  bar: "bg-blue-500",
                  glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
                  text: "text-blue-600 dark:text-blue-400",
                },
                processing: {
                  bar: "bg-amber-500",
                  glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]",
                  text: "text-amber-600 dark:text-amber-400",
                },
                pending: {
                  bar: "bg-zinc-400 dark:bg-zinc-600",
                  glow: "shadow-[0_0_20px_rgba(113,113,122,0.1)]",
                  text: "text-muted-foreground",
                },
                cancelled: {
                  bar: "bg-rose-500",
                  glow: "shadow-[0_0_20px_rgba(244,63,94,0.12)]",
                  text: "text-rose-600",
                },
              };
              const accent = statusAccents[order.status] || statusAccents.pending;

              return (
                <div
                  key={order.id}
                  className={cn(
                    "group relative admin-card rounded-2xl bg-card p-4 sm:p-5 border-none flex flex-col justify-between gap-4 cursor-default transition-all duration-300 hover:-translate-y-0.5",
                    accent.glow
                  )}
                >
                  {/* Subtle Status Color Indicator Bar (Top Left Accent) */}
                  <div
                    className={cn(
                      "absolute top-4 left-0 w-1 h-7 rounded-r-full transition-all duration-300 group-hover:h-10",
                      accent.bar
                    )}
                  />

                  {/* Header: Order # + Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 pl-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-black text-sm sm:text-base text-foreground tracking-tight">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10.5px] font-medium text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Customer Card Section */}
                  <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">
                        {order.shippingAddress.name}
                      </p>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                        {order.shippingAddress.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="font-mono">{order.shippingAddress.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {order.shippingAddress.street}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview Strip */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">
                        {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-black text-sm sm:text-base text-foreground">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Row */}
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-muted shadow-xs"
                          title={`${item.productName} (x${item.quantity})`}
                        >
                          <Image
                            src={item.productThumbnail}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 rounded px-1 text-[9px] font-black bg-black/80 text-white leading-tight">
                              ×{item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics & Payment Meta Strip */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/30 text-[11px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Truck className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Courier: </span>
                      <strong className="text-foreground font-semibold truncate max-w-[100px]">
                        {order.courierName || "Unassigned"}
                      </strong>
                    </div>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md font-bold uppercase text-[10px]",
                        order.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                    </span>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 py-2 px-3 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Manage</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvoiceModalOrder(order)}
                      className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Print Invoice"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Cancel order #${order.orderNumber}?`)) {
                            updateOrderStatus(order.id, "cancelled");
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Cancel Order"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Integrated Pagination inside Card Grid View */}
          {filteredOrders.length > 0 && (
            <div className="col-span-full p-4 rounded-2xl bg-card/60 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-muted-foreground font-medium">
                Showing <strong className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="text-foreground font-bold">
                  {Math.min(currentPage * pageSize, filteredOrders.length)}
                </strong>{" "}
                of <strong className="text-foreground font-bold">{filteredOrders.length}</strong> orders
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                      : "bg-muted/60 text-foreground hover:bg-muted"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      currentPage === page
                        ? "bg-foreground text-background shadow-xs font-black"
                        : "bg-muted/40 text-foreground/80 hover:bg-muted"
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                      : "bg-muted/60 text-foreground hover:bg-muted"
                  )}
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. TABLE VIEW: Only rendered when user chooses 'table' on tablet/desktop (sm+) */}
        {viewMode === "table" && (
          <div className="hidden sm:flex admin-card rounded-2xl bg-card border-none overflow-hidden flex-col">
            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City / Area</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Logistics</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Order Number + Time */}
                      <td className="py-3.5 px-4 font-medium">
                        <span className="font-mono font-black text-foreground">
                          #{order.orderNumber}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">
                          {order.shippingAddress.name}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {order.shippingAddress.phone}
                        </p>
                      </td>

                      {/* City & Address */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground">
                          {order.shippingAddress.city}
                        </span>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={order.shippingAddress.street}>
                          {order.shippingAddress.street}
                        </p>
                      </td>

                      {/* Items + Thumbnails */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className="relative h-7 w-7 rounded-md overflow-hidden bg-muted shrink-0"
                              title={item.productName}
                            >
                              <Image
                                src={item.productThumbnail}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[10px] font-bold text-muted-foreground">
                              +{order.items.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price + Payment */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-black text-foreground">
                          ৳{order.total.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">
                          {order.paymentMethod}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>

                      {/* Courier Logistics */}
                      <td className="py-3.5 px-4">
                        {order.courierName ? (
                          <div>
                            <span className="font-bold text-foreground text-[11px]">
                              {order.courierName}
                            </span>
                            <p className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]" title={order.trackingNumber}>
                              {order.trackingNumber}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/60 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                            title="View order details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInvoiceModalOrder(order)}
                            className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                            title="Print invoice"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Table Integrated Pagination Footer ── */}
          {filteredOrders.length > 0 && (
            <div className="mt-auto p-3.5 sm:p-4 bg-muted/20 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-muted-foreground font-medium">
                Showing <strong className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="text-foreground font-bold">
                  {Math.min(currentPage * pageSize, filteredOrders.length)}
                </strong>{" "}
                of <strong className="text-foreground font-bold">{filteredOrders.length}</strong> orders
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                      : "bg-muted/60 text-foreground hover:bg-muted"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      currentPage === page
                        ? "bg-foreground text-background shadow-xs font-black"
                        : "bg-muted/40 text-foreground/80 hover:bg-muted"
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer",
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                      : "bg-muted/60 text-foreground hover:bg-muted"
                  )}
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Order Detail Drawer Modal (Clean, No Border, Intense Backdrop) ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.5)] border-none space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-between border-b border-border/40 pb-3 pr-8">
              <div>
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Change Status Stepper */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Update Order Status:
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newSt = e.target.value as OrderStatus;
                  updateOrderStatus(selectedOrder.id, newSt);
                  setSelectedOrder({ ...selectedOrder, status: newSt });
                }}
                className="h-10 w-full rounded-xl bg-muted/50 px-3 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="pending">Pending Verification</option>
                <option value="processing">Processing & QC Inspection</option>
                <option value="shipped">Handed to Courier (In Transit)</option>
                <option value="delivered">Delivered Successfully</option>
                <option value="cancelled">Cancelled & Refunded</option>
              </select>
            </div>

            {/* Courier Dispatch Assignment */}
            <form
              onSubmit={handleAssignTracking}
              className="p-4 rounded-2xl bg-muted/30 space-y-2.5"
            >
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-amber-500" />
                <span>Assign Courier Shipment</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Steadfast Courier / Pathao"
                  value={courierNameInput}
                  onChange={(e) => setCourierNameInput(e.target.value)}
                  className="h-9 rounded-xl bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Tracking code (e.g. STE-99420)"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="h-9 rounded-xl bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer"
              >
                Save Courier & Dispatch Parcel
              </button>
            </form>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-border/40 rounded-2xl p-3 bg-muted/20">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.productThumbnail}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="text-[10px] text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      ৳{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Address */}
            <div className="p-3.5 rounded-2xl bg-muted/20 text-xs space-y-1">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                Shipping Destination:
              </span>
              <p className="font-semibold text-foreground">
                {selectedOrder.shippingAddress.name} ({selectedOrder.shippingAddress.phone})
              </p>
              <p className="text-muted-foreground">
                {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.area},{" "}
                {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          isOpen={Boolean(invoiceModalOrder)}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
