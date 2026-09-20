"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAdminStore } from "@/stores";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Box,
  DollarSign,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { useGetAllOrdersQuery, useGetOrderStatsQuery, useUpdateOrderStatusMutation, useAssignCourierTrackingMutation } from "@/services/api/orders/orderApi";
import { KpiCard } from "./dashboard/KpiCard";
import {
  OrderCardItem,
  OrderDesktopTable,
  OrderFilterDock,
  OrderQuickInspectModal,
  OrderMobileFilterModal,
  OrderFloatingFilterFab,
  AdminOrdersSkeleton,
} from "./orders";


export function AdminOrdersView() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get("status") || "all";

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const { updateOrderStatus, assignCourierTracking } = useAdminStore();
  const { data: backendOrdersData, isLoading } = useGetAllOrdersQuery({
    searchTerm: searchQuery || undefined,
    status: statusFilter !== "all" ? (statusFilter.toUpperCase() as any) : undefined,
  });
  const { data: statsData } = useGetOrderStatsQuery();
  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();
  const [assignCourierTrackingMutation] = useAssignCourierTrackingMutation();

  const orders = backendOrdersData?.data ?? [];

  // Mobile Draggable Floating Filter State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 90,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 16,
    posY: 90,
  });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: fabPosition.x,
      posY: fabPosition.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = dragStartRef.current.startX - e.clientX;
    const deltaY = dragStartRef.current.startY - e.clientY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }
    const newX = Math.max(10, Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX));
    const newY = Math.max(70, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));
    setFabPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (!hasMovedRef.current) {
      setShowMobileFilters(true);
    }
  };

  useEffect(() => {
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

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: inTransitCount,
    delivered: completedCount,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

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

  if (isLoading && orders.length === 0) {
    return <AdminOrdersSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)]">

      {/* ── Mobile Dedicated Top Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order #, customer, phone, city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60 border border-border/50"
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
      </div>

      {/* ── Header Strip (Hidden on mobile, desktop only) ── */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Workspace Tabs */}
          <div className="flex rounded-xl bg-muted/50 p-1 border border-border/60 text-xs">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-background text-foreground shadow-2xs transition-all"
            >
              <Box className="h-3.5 w-3.5" />
              <span>Orders ({filteredOrders.length})</span>
            </Link>
            <Link
              href="/dashboard/orders?tab=carts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-amber-500" />
              <span>Active Carts</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 Essential Orders KPI Cards (Horizontal Swipe Carousel on mobile, Grid on desktop) ── */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Fulfillment Volume"
            rawValue={totalVolume}
            prefix="৳"
            change="+14.2%"
            isPositive={true}
            icon={DollarSign}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Pending / QC"
            rawValue={pendingCount}
            change={pendingCount > 0 ? "Needs Action" : "All Clear"}
            isPositive={pendingCount === 0}
            icon={Clock}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="In Transit Courier"
            rawValue={inTransitCount}
            change="Real-time Logistics"
            isPositive={true}
            icon={Truck}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Delivered Successfully"
            rawValue={completedCount}
            change="98.5% Rate"
            isPositive={true}
            icon={PackageCheck}
          />
        </div>
      </div>

      {/* ── Status Pills & Desktop Search Controls Dock ── */}
      <OrderFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orderCounts={orderCounts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── View Mode: Cards or Table (Mobile is ALWAYS Dedicated Card View) ── */}
      <div
        className={
          viewMode === "table"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px] sm:hidden"
            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px]"
        }
      >
        {filteredOrders.length === 0 ? (
          <div className="col-span-full admin-card rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[380px]">
            <Box className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-bold text-foreground text-sm">No orders found</p>
            <p className="text-xs mt-0.5">Try clearing your filters or search query.</p>
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <OrderCardItem
              key={order.id}
              order={order}
              getStatusBadge={getStatusBadge}
              onPrintInvoice={setInvoiceModalOrder}
              onQuickInspect={setSelectedOrder}
            />
          ))
        )}

        {/* Integrated Pagination Footer for Card View */}
        {filteredOrders.length > 0 && (
          <div className="col-span-full p-4 rounded-2xl bg-card/60 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs admin-card border-none">
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
                className={
                  currentPage === 1
                    ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                    : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
                }
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-foreground text-background shadow-xs font-black"
                      : "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-muted/40 text-foreground/80 hover:bg-muted"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={
                  currentPage === totalPages
                    ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                    : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
                }
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Table View: Full Desktop Table ── */}
      {viewMode === "table" && (
        <OrderDesktopTable
          orders={paginatedOrders}
          getStatusBadge={getStatusBadge}
          onPrintInvoice={setInvoiceModalOrder}
        />
      )}

      {/* Desktop Table Integrated Pagination Footer */}
      {viewMode === "table" && filteredOrders.length > 0 && (
        <div className="hidden sm:flex mt-auto p-3.5 sm:p-4 bg-card rounded-2xl border border-border/20 flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
              className={
                currentPage === 1
                  ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                  : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
              }
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-foreground text-background shadow-xs font-black"
                    : "h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer bg-muted/40 text-foreground/80 hover:bg-muted"
                }
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={
                currentPage === totalPages
                  ? "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground"
                  : "h-8 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer bg-muted/60 text-foreground hover:bg-muted"
              }
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Order Detail Quick Drawer Modal ── */}
      <OrderQuickInspectModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status) => {
          updateOrderStatus(id, status);
          setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
        }}
        onAssignTracking={handleAssignTracking}
        courierNameInput={courierNameInput}
        setCourierNameInput={setCourierNameInput}
        trackingNumberInput={trackingNumberInput}
        setTrackingNumberInput={setTrackingNumberInput}
        getStatusBadge={getStatusBadge}
      />

      {/* ── Mobile Floating Filter Button ── */}
      <OrderFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={statusFilter !== "all"}
      />

      {/* ── Mobile Fullscreen Filter Modal ── */}
      <OrderMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orders={orders}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Invoice Modal ── */}
      {invoiceModalOrder && (
        <InvoiceModal
          isOpen={Boolean(invoiceModalOrder)}
          order={invoiceModalOrder}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}
    </div>
  );
}
