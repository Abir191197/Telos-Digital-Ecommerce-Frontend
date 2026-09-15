"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Package,
  Phone,
  Calendar,
  Box,
  BadgeAlert,
  ArrowRight,
  Sparkles,
  CheckSquare,
  ShieldCheck,
  Send,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";
import { InvoiceModal } from "@/components/account";
import { KpiCard } from "./dashboard/KpiCard";

export function AdminPendingDispatchView() {
  const { orders, updateOrderStatus, assignCourierTracking } = useAdminStore();

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
  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 16,
    posY: 90,
  });
  const hasMovedRef = React.useRef(false);

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
    return ageHours > 12; // Over 12 hours old
  }).length;

  // Filtered Queue
  const filteredQueue = pendingQueue.filter((order) => {
    // Zone Filter
    if (zoneFilter === "inside-dhaka" && order.shippingAddress.zone !== "inside-dhaka") return false;
    if (zoneFilter === "outside-dhaka" && order.shippingAddress.zone !== "outside-dhaka") return false;

    // Courier Filter
    if (courierFilter === "unassigned" && order.courierName) return false;
    if (courierFilter === "assigned" && !order.courierName) return false;
    if (courierFilter === "steadfast" && !order.courierName?.toLowerCase().includes("steadfast")) return false;
    if (courierFilter === "pathao" && !order.courierName?.toLowerCase().includes("pathao")) return false;

    // Search
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

  return (
    <div className="space-y-5 sm:space-y-6 min-h-[calc(100dvh-4rem)]">
      {/* ── Mobile Dedicated Top Search Bar (Pinned immediately below navbar on page landing) ── */}
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

      {/* ── Header Strip: Dedicated Dispatch Operational Hub (Hidden on mobile, desktop only) ── */}
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

      {/* ── Sticky Dispatch Filter & Search Dock (Full-width edge-to-edge on mobile, rounded card on desktop) ── */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-4 py-2.5 sm:py-3 bg-background/95 sm:bg-card/90 backdrop-blur-xl border-y sm:border sm:rounded-2xl border-border/50 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.4)] space-y-2 transition-all">
        {/* Row 1: Search Bar (Desktop only, mobile has top pinned bar) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order #, customer name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 sm:h-10 w-full rounded-xl bg-muted/30 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-foreground/20 focus:outline-none transition-all placeholder:text-muted-foreground/60"
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

        {/* Row 2: Unified Single Scroll Strip with Soft Edge Fade */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Scrollable Filters Container with Right Fade */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x overscroll-x-contain select-none">
              {/* Courier Filters */}
              {[
                { id: "all", label: "All Couriers" },
                { id: "unassigned", label: "Unassigned" },
                { id: "steadfast", label: "Steadfast" },
                { id: "pathao", label: "Pathao" },
              ].map((pill) => {
                const isSelected = courierFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentY = window.scrollY;
                      setCourierFilter(pill.id);
                      setCurrentPage(1);
                      requestAnimationFrame(() => {
                        window.scrollTo({ top: currentY, behavior: "instant" });
                      });
                    }}
                    className={cn(
                      "h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95",
                      isSelected
                        ? "bg-foreground text-background shadow-xs font-black"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-border/80 shrink-0 mx-0.5" />

              {/* Delivery Zone Filters */}
              {[
                { id: "all", label: "All Zones" },
                { id: "inside-dhaka", label: "Dhaka Metro" },
                { id: "outside-dhaka", label: "Outside Dhaka" },
              ].map((zone) => {
                const isSelected = zoneFilter === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentY = window.scrollY;
                      setZoneFilter(zone.id);
                      setCurrentPage(1);
                      requestAnimationFrame(() => {
                        window.scrollTo({ top: currentY, behavior: "instant" });
                      });
                    }}
                    className={cn(
                      "h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95",
                      isSelected
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black border border-amber-500/30"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    {zone.label}
                  </button>
                );
              })}
            </div>

            {/* Subtle right edge gradient fade hint */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card to-transparent sm:hidden" />
          </div>

          {/* Desktop/Tablet View Mode Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-muted/60 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px]",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px]",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Card View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Operational Dispatch Grid (Action-First Cards) - Always rendered on mobile ── */}
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
          paginatedQueue.map((order) => {
            const isUnassigned = !order.courierName;

            return (
              <div
                key={order.id}
                className={cn(
                  "group relative admin-card rounded-2xl bg-card p-4 sm:p-5 border-none flex flex-col justify-between gap-4 cursor-default transition-all duration-300 hover:-translate-y-0.5",
                  isUnassigned
                    ? "shadow-[0_0_24px_rgba(245,158,11,0.12)]"
                    : "shadow-[0_0_24px_rgba(59,130,246,0.1)]"
                )}
              >
                {/* Status Bar Left Accent */}
                <div
                  className={cn(
                    "absolute top-4 left-0 w-1.5 h-8 rounded-r-full transition-all duration-300 group-hover:h-12",
                    isUnassigned ? "bg-amber-500" : "bg-blue-500"
                  )}
                />

                {/* Card Header: Order # + Zone Tag */}
                <div className="pl-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-black text-sm sm:text-base text-foreground tracking-tight">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                        order.shippingAddress.zone === "inside-dhaka"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      {order.shippingAddress.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                    </span>
                  </div>
                </div>

                {/* Customer Address & Verified Phone */}
                <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">
                      {order.shippingAddress.name}
                    </p>
                    <span className="text-[10px] font-bold text-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded">
                      {order.shippingAddress.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-mono font-semibold">
                      <Phone className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Call Customer
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{order.shippingAddress.street}</span>
                  </div>
                </div>

                {/* Parcel Packing List Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Box className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Packing ({order.items.reduce((s, i) => s + i.quantity, 0)} units)</span>
                    </span>
                    <span className="font-mono font-black text-sm text-foreground">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Thumbnail Row with Quantity Pills */}
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
                        <span className="absolute bottom-0.5 right-0.5 rounded px-1 text-[9px] font-black bg-black/85 text-white leading-tight">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courier Logistics Status Strip */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/30 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {order.courierName ? (
                      <div>
                        <span className="font-bold text-foreground">{order.courierName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-1">
                          ({order.trackingNumber})
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" />
                        Awaiting Rider
                      </span>
                    )}
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

                {/* Direct Fulfillment Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {isUnassigned ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDispatchingOrder(order);
                        setTrackingCode(`STE-${Math.floor(10000 + Math.random() * 90000)}`);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Courier</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setHandoverWarningOrder(order)}
                      className="flex-1 py-2 px-3 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare className="h-3.5 w-3.5" />
                      <span>Mark Handed to Rider</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setInvoiceModalOrder(order)}
                    className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Print Dispatch Label / Invoice"
                  >
                    <Printer className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Inspect Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Integrated Pagination Footer */}
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
        <div className="hidden sm:flex admin-card rounded-2xl bg-card border-none overflow-hidden flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
                  <th className="py-3 px-4">Order & Time</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Zone & Destination</th>
                  <th className="py-3 px-4">Packing Items</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Logistics Status</th>
                  <th className="py-3 px-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No pending dispatch orders found.
                    </td>
                  </tr>
                ) : (
                  paginatedQueue.map((order) => {
                    const isUnassigned = !order.courierName;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Order & Time */}
                        <td className="py-3.5 px-4 font-medium">
                          <span className="font-mono font-black text-foreground">
                            #{order.orderNumber}
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </td>

                        {/* Customer & Phone */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground">{order.shippingAddress.name}</p>
                          <a
                            href={`tel:${order.shippingAddress.phone}`}
                            className="font-mono text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            {order.shippingAddress.phone}
                          </a>
                        </td>

                        {/* Zone & Destination */}
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase mb-0.5",
                              order.shippingAddress.zone === "inside-dhaka"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            {order.shippingAddress.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                          </span>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={order.shippingAddress.street}>
                            {order.shippingAddress.city} • {order.shippingAddress.street}
                          </p>
                        </td>

                        {/* Packing Items with Thumbnails */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {order.items.slice(0, 2).map((item) => (
                              <div
                                key={item.id}
                                className="relative h-7 w-7 rounded-md overflow-hidden bg-muted shrink-0"
                                title={`${item.productName} (x${item.quantity})`}
                              >
                                <Image
                                  src={item.productThumbnail}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            <span className="text-[11px] font-bold text-foreground">
                              {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-mono font-black text-foreground">
                            ৳{order.total.toLocaleString()}
                          </span>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            {order.paymentMethod}
                          </p>
                        </td>

                        {/* Logistics Status */}
                        <td className="py-3.5 px-4">
                          {order.courierName ? (
                            <div>
                              <span className="font-bold text-foreground text-[11px]">{order.courierName}</span>
                              <p className="font-mono text-[10px] text-muted-foreground">{order.trackingNumber}</p>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                              <AlertCircle className="h-3 w-3" />
                              Needs Courier
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isUnassigned ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setDispatchingOrder(order);
                                  setTrackingCode(`STE-${Math.floor(10000 + Math.random() * 90000)}`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="h-3 w-3" />
                                <span>Dispatch</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setHandoverWarningOrder(order)}
                                className="px-2.5 py-1.5 rounded-lg bg-foreground text-background font-bold text-xs shadow-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                              >
                                <CheckSquare className="h-3 w-3" />
                                <span>Hand Over</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setInvoiceModalOrder(order)}
                              className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                              title="Print Dispatch Label"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Integrated Pagination Footer */}
          {filteredQueue.length > 0 && (
            <div className="mt-auto p-3.5 sm:p-4 bg-muted/20 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
        </div>
      )}

      {/* ── Quick Courier Dispatch Modal Dialog (z-[9999] covers all headers & bottom navs) ── */}
      {dispatchingOrder && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl border-none space-y-4 relative animate-in slide-in-from-bottom-6 duration-200">
            <button
              type="button"
              onClick={() => setDispatchingOrder(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">
                  Dispatch #{dispatchingOrder.orderNumber}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Assign Bangladesh courier tracking code
                </p>
              </div>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="h-10 w-full rounded-xl bg-muted/40 px-3 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="Steadfast Courier">Steadfast Courier (API Integrated)</option>
                  <option value="Pathao Courier">Pathao Courier (Express)</option>
                  <option value="RedX Logistics">RedX Logistics</option>
                  <option value="eCourier">eCourier Bangladesh</option>
                  <option value="Paperfly">Paperfly Home Delivery</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  Tracking Code / Consignment ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STE-94821"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="h-10 w-full rounded-xl bg-muted/40 px-3 text-xs font-mono font-bold text-foreground focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/30 text-xs space-y-1">
                <p className="text-muted-foreground font-medium">
                  Destination: <strong className="text-foreground">{dispatchingOrder.shippingAddress.street}, {dispatchingOrder.shippingAddress.city}</strong>
                </p>
                <p className="text-muted-foreground font-medium">
                  Customer Phone: <strong className="text-foreground font-mono">{dispatchingOrder.shippingAddress.phone}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDispatchingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-muted/60 text-foreground text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Handover to Rider Warning Confirmation Modal (z-[9999] covers all headers & bottom navs) ── */}
      {handoverWarningOrder && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl border-none space-y-4 relative text-center animate-in slide-in-from-bottom-6 duration-200">
            {/* Warning Icon Badge */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
              <Truck className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-foreground">
                Confirm Handover to Rider?
              </h3>
              <p className="text-xs text-muted-foreground">
                Order <strong className="font-mono text-foreground">#{handoverWarningOrder.orderNumber}</strong> will move from Pending to <strong className="text-blue-500">In Transit</strong>. Customer will receive shipment notification.
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-3 text-left text-xs space-y-1">
              <p className="text-muted-foreground">
                Courier: <strong className="text-foreground">{handoverWarningOrder.courierName || "Standard"}</strong>
              </p>
              <p className="text-muted-foreground font-mono">
                Tracking: <strong className="text-foreground">{handoverWarningOrder.trackingNumber || "Assigned"}</strong>
              </p>
              <p className="text-muted-foreground">
                Customer: <strong className="text-foreground">{handoverWarningOrder.shippingAddress.name}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHandoverWarningOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(handoverWarningOrder.id, "shipped");
                  setHandoverWarningOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 text-xs font-bold shadow-xs transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Yes, Hand Over</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
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
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Packing List Items ({selectedOrder.items.length})
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

            {/* Destination */}
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
                {selectedOrder.shippingAddress.city}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Draggable Floating Filter Button (Icon-Only Circle) ── */}
      <div
        style={{
          right: `${fabPosition.x}px`,
          bottom: `${fabPosition.y}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="md:hidden fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing"
      >
        <button
          type="button"
          aria-label="Open Dispatch Filters"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-2xl border-2 border-background/20 active:scale-90 transition-transform pointer-events-none"
        >
          <Filter className="h-5 w-5 text-amber-500 fill-amber-500/30" />
          {(courierFilter !== "all" || zoneFilter !== "all") && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
          )}
        </button>
      </div>

      {/* ── Mobile Fullscreen Filter Modal (z-[9999] covers all headers & bottom nav) ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
          <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                  <Filter className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground tracking-tight">Dispatch Queue Filters</h3>
                  <p className="text-[11px] text-muted-foreground">Filter by assigned courier &amp; zone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Courier Filter Options */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-foreground block mb-1">Courier Logistics Partner</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All Couriers" },
                  { id: "unassigned", label: "Unassigned Rider" },
                  { id: "steadfast", label: "Steadfast Courier" },
                  { id: "pathao", label: "Pathao Express" },
                ].map((c) => {
                  const isSelected = courierFilter === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCourierFilter(c.id);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all cursor-pointer font-bold text-xs",
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone Filter Options */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-foreground block mb-1">Delivery Geographic Zone</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All Zones" },
                  { id: "inside-dhaka", label: "Inside Dhaka" },
                  { id: "outside-dhaka", label: "Outside Dhaka" },
                ].map((z) => {
                  const isSelected = zoneFilter === z.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        setZoneFilter(z.id);
                        setCurrentPage(1);
                      }}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all cursor-pointer font-bold text-xs",
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {z.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Reset & Dismiss */}
            <div className="pt-2 flex items-center gap-2.5 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  setCourierFilter("all");
                  setZoneFilter("all");
                  setCurrentPage(1);
                  setShowMobileFilters(false);
                }}
                className="py-3 px-4 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-98"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
