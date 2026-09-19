"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Box,
  BadgeAlert,
  ArrowRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { useGetAllOrdersQuery, useAssignCourierTrackingMutation, useUpdateOrderStatusMutation } from "@/services/api/orders/orderApi";
import { KpiCard } from "./dashboard/KpiCard";
import {
  DispatchCardItem,
  DispatchDesktopTable,
  DispatchCourierModal,
  DispatchHandoverModal,
  DispatchDetailsDrawer,
  DispatchMobileFilterModal,
  DispatchFloatingFilterFab,
  DispatchFilterDock,
} from "./dispatch";

export function AdminPendingDispatchView() {
    const { updateOrderStatus, assignCourierTracking } = useAdminStore();
  const { data: backendOrdersData } = useGetAllOrdersQuery();
  const [assignCourierTrackingMutation] = useAssignCourierTrackingMutation();
  const [updateOrderStatusMutation] = useUpdateOrderStatusMutation();

  const orders = backendOrdersData?.data ?? [];

  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [courierFilter, setCourierFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Courier Assign Modal State
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState("Steadfast Courier");
  const [trackingCode, setTrackingCode] = useState("");

  // Handover Warning Confirmation Modal State
  const [handoverWarningOrder, setHandoverWarningOrder] = useState<Order | null>(null);

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

  // All pending & processing orders
  const pendingQueue = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  );

  // Logistics KPI Computations
  const awaitingPackingCount = pendingQueue.filter((o) => o.status === "pending").length;
  const qcReadyCount = pendingQueue.filter((o) => o.status === "processing").length;
  const unassignedCourierCount = pendingQueue.filter((o) => !o.courierName).length;
  const urgentCount = pendingQueue.filter((o) => {
    const ageHours = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60);
    return ageHours > 12;
  }).length;

  // Filtered Queue
  const filteredQueue = pendingQueue.filter((order) => {
    if (zoneFilter === "inside-dhaka" && order.shippingAddress.zone !== "inside-dhaka") return false;
    if (zoneFilter === "outside-dhaka" && order.shippingAddress.zone !== "outside-dhaka") return false;

    if (courierFilter === "unassigned" && order.courierName) return false;
    if (courierFilter === "assigned" && !order.courierName) return false;
    if (courierFilter === "steadfast" && !order.courierName?.toLowerCase().includes("steadfast")) return false;
    if (courierFilter === "pathao" && !order.courierName?.toLowerCase().includes("pathao")) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.shippingAddress.name.toLowerCase().includes(q) ||
      order.shippingAddress.phone.includes(q) ||
      order.shippingAddress.city.toLowerCase().includes(q) ||
      order.trackingNumber?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredQueue.length / pageSize) || 1;
  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder || !courierName || !trackingCode) return;

    assignCourierTracking(dispatchingOrder.id, courierName, trackingCode);
    updateOrderStatus(dispatchingOrder.id, "shipped");

    setDispatchingOrder(null);
    setCourierName("Steadfast Courier");
    setTrackingCode("");
  };

  const handleOpenDispatchModal = (order: Order) => {
    setDispatchingOrder(order);
    setTrackingCode(`STE-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)]">
      {/* ── Mobile Dedicated Top Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order #, customer name, phone, city..."
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
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Pending Dispatch Queue
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Clock className="h-3 w-3 animate-pulse" />
              <span>{pendingQueue.length} To Ship</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fulfillment workbench: verify customer phone, pack orders, and hand over parcels to couriers
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/orders"
            className="px-3 py-1.5 rounded-xl bg-card admin-card text-xs font-bold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <span>All Orders</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* ── 4 Dedicated Logistics & Dispatch KPIs (Horizontal Swipe Carousel on mobile, Grid on desktop) ── */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Awaiting QC Check"
            rawValue={awaitingPackingCount}
            change="Pending verification"
            isPositive={awaitingPackingCount === 0}
            icon={Box}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Ready For Courier"
            rawValue={qcReadyCount}
            change="Packed & tagged"
            isPositive={true}
            icon={Package}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Unassigned Courier"
            rawValue={unassignedCourierCount}
            change={unassignedCourierCount > 0 ? "Rider needed" : "All assigned"}
            isPositive={unassignedCourierCount === 0}
            icon={Truck}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="SLA Breach / Urgent"
            rawValue={urgentCount}
            change={urgentCount > 0 ? "Action >12h" : "On schedule"}
            isPositive={urgentCount === 0}
            icon={BadgeAlert}
          />
        </div>
      </div>

      {/* ── Sticky Dispatch Filter & Search Dock ── */}
      <DispatchFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        courierFilter={courierFilter}
        setCourierFilter={setCourierFilter}
        zoneFilter={zoneFilter}
        setZoneFilter={setZoneFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Operational Dispatch Grid (Action-First Cards) - Rendered on mobile or when viewMode is card ── */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 min-h-[70vh] sm:min-h-[440px]",
          viewMode === "table" && "sm:hidden"
        )}
      >
        {filteredQueue.length === 0 ? (
          <div className="col-span-full admin-card rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[380px]">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-emerald-500 opacity-80" />
            <p className="font-bold text-foreground text-sm">Dispatch Queue All Clear!</p>
            <p className="text-xs mt-0.5">No pending orders matching your filter require fulfillment.</p>
          </div>
        ) : (
          paginatedQueue.map((order) => (
            <DispatchCardItem
              key={order.id}
              order={order}
              onDispatchCourier={handleOpenDispatchModal}
              onHandoverRider={setHandoverWarningOrder}
              onPrintInvoice={setInvoiceModalOrder}
              onInspect={setSelectedOrder}
            />
          ))
        )}

        {/* Integrated Pagination Footer for Card View */}
        {filteredQueue.length > 0 && (
          <div className="col-span-full p-4 rounded-2xl bg-card/60 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs admin-card border-none">
            <p className="text-muted-foreground font-medium">
              Showing <strong className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="text-foreground font-bold">
                {Math.min(currentPage * pageSize, filteredQueue.length)}
              </strong>{" "}
              of <strong className="text-foreground font-bold">{filteredQueue.length}</strong> pending dispatches
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

      {/* ── Operational Dispatch Table View (Desktop & Tablet Fast Batch Workflow) ── */}
      {viewMode === "table" && (
        <DispatchDesktopTable
          orders={paginatedQueue}
          onDispatchCourier={handleOpenDispatchModal}
          onHandoverRider={setHandoverWarningOrder}
          onPrintInvoice={setInvoiceModalOrder}
          onInspect={setSelectedOrder}
        />
      )}

      {/* Table Integrated Pagination Footer */}
      {viewMode === "table" && filteredQueue.length > 0 && (
        <div className="hidden sm:flex mt-auto p-3.5 sm:p-4 bg-card rounded-2xl border border-border/20 flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-muted-foreground font-medium">
            Showing <strong className="text-foreground font-bold">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-foreground font-bold">
              {Math.min(currentPage * pageSize, filteredQueue.length)}
            </strong>{" "}
            of <strong className="text-foreground font-bold">{filteredQueue.length}</strong> orders
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

      {/* ── Quick Courier Dispatch Modal Dialog ── */}
      <DispatchCourierModal
        order={dispatchingOrder}
        courierName={courierName}
        setCourierName={setCourierName}
        trackingCode={trackingCode}
        setTrackingCode={setTrackingCode}
        onClose={() => setDispatchingOrder(null)}
        onSubmit={handleDispatchSubmit}
      />

      {/* ── Handover to Rider Warning Confirmation Modal ── */}
      <DispatchHandoverModal
        order={handoverWarningOrder}
        onClose={() => setHandoverWarningOrder(null)}
        onConfirm={(order) => {
          updateOrderStatus(order.id, "shipped");
          setHandoverWarningOrder(null);
        }}
      />

      {/* ── Order Details Inspection Drawer ── */}
      <DispatchDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* ── Mobile Draggable Floating Filter Button ── */}
      <DispatchFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={courierFilter !== "all" || zoneFilter !== "all"}
      />

      {/* ── Mobile Fullscreen Filter Modal ── */}
      <DispatchMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        courierFilter={courierFilter}
        setCourierFilter={setCourierFilter}
        zoneFilter={zoneFilter}
        setZoneFilter={setZoneFilter}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Thermal/A4 Invoice & Waybill Print Modal ── */}
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
