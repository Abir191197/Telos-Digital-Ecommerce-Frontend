"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  X,
  RotateCcw,
  Box,
} from "lucide-react";
import Link from "next/link";
import { INITIAL_CUSTOMER_CARTS, AdminCustomerCart } from "@/data/customer-carts";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import { PaymentFloatingFilterFab } from "@/components/admin/payments/PaymentFloatingFilterFab";
import {
  CartKpiStrip,
  CartFilterDock,
  CartDesktopTable,
  CartCardGrid,
  CartMobileList,
  CartInspectDrawer,
} from "./carts";

const PAGE_SIZE = 8;

export function AdminCustomerCartsView() {
  const [carts] = useState<AdminCustomerCart[]>(INITIAL_CUSTOMER_CARTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [inspectingCart, setInspectingCart] = useState<AdminCustomerCart | null>(null);

  // Desktop dropdown state
  const [openDropdown, setOpenDropdown] = useState<"status" | "sort" | null>(null);

  // Close thematic dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-thematic-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter & Search computation
  const filteredCarts = useMemo(() => {
    return carts
      .filter((cart) => {
        const matchesStatus =
          statusFilter === "all" || cart.status === statusFilter;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          cart.customerName.toLowerCase().includes(q) ||
          cart.customerEmail.toLowerCase().includes(q) ||
          (cart.customerPhone && cart.customerPhone.includes(q)) ||
          cart.city.toLowerCase().includes(q) ||
          cart.items.some((i) => i.productName.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "amount-desc") return b.subtotal - a.subtotal;
        if (sortBy === "amount-asc") return a.subtotal - b.subtotal;
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return sortBy === "date-desc" ? timeB - timeA : timeA - timeB;
      });
  }, [carts, statusFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredCarts.length / PAGE_SIZE) || 1;
  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCarts.slice(start, start + PAGE_SIZE);
  }, [filteredCarts, currentPage]);

  // KPI Metrics
  const activeCount = useMemo(() => carts.filter((c) => c.status === "active").length, [carts]);
  const abandonedList = useMemo(() => carts.filter((c) => c.status === "abandoned"), [carts]);
  const abandonedValue = useMemo(() => abandonedList.reduce((sum, c) => sum + c.subtotal, 0), [abandonedList]);
  const highValueCount = useMemo(() => carts.filter((c) => c.subtotal >= 50000).length, [carts]);

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Mobile Dedicated Sticky Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search active shopper carts..."
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

      {/* ── Desktop Top Header Banner ── */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Customer Active Carts &amp; Bag Audit
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sessions
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time tracking of buyer cart selections, abandoned bag values, and recovery nudges.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Workspace Tabs */}
          <div className="flex rounded-xl bg-muted/50 p-1 border border-border/60 text-xs">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              <Box className="h-3.5 w-3.5" />
              <span>Orders</span>
            </Link>
            <Link
              href="/dashboard/orders?tab=carts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-background text-foreground shadow-2xs transition-all"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-amber-500" />
              <span>Active Carts ({carts.length})</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Summary Strip ── */}
      <CartKpiStrip
        totalActiveCarts={activeCount}
        abandonedValue={abandonedValue}
        abandonedCount={abandonedList.length}
        highValueCount={highValueCount}
      />

      {/* ── Desktop Thematic Filter Dock ── */}
      <CartFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Main Log Streams ── */}
      <div className="space-y-4">
        {/* Mobile View: Cards */}
        <CartMobileList carts={paginatedCarts} onInspect={setInspectingCart} />

        {/* Desktop View: Table vs Cards */}
        {viewMode === "table" ? (
          <CartDesktopTable carts={paginatedCarts} onInspect={setInspectingCart} />
        ) : (
          <div className="hidden md:block">
            <CartCardGrid carts={paginatedCarts} onInspect={setInspectingCart} />
          </div>
        )}

        {/* Shared Pagination Footer */}
        {filteredCarts.length > 0 && (
          <CategoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={filteredCarts.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* ── Inspect Drawer ── */}
      <CartInspectDrawer
        cart={inspectingCart}
        onClose={() => setInspectingCart(null)}
      />
    </div>
  );
}
