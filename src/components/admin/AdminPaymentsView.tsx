"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { CreditCard, Search, X, Clock } from "lucide-react";
import { useAdminStore, AdminPaymentTransaction } from "@/stores";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import {
  PaymentKpiStrip,
  PaymentFilterDock,
  PaymentDesktopTable,
  PaymentMobileList,
  PaymentMobileFilterModal,
  PaymentFloatingFilterFab,
  PaymentInspectModal,
} from "./payments";

const PAGE_SIZE = 8;

export function AdminPaymentsView() {
  const { transactions, verifyTransaction } = useAdminStore();
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] =
    useState<AdminPaymentTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Thematic dropdown state for desktop dock
  const [openDropdown, setOpenDropdown] = useState<
    "method" | "status" | "sort" | null
  >(null);

  // Mobile Filter Drawer & Draggable Floating Action Button
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 90,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
  }>({
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
    const newX = Math.max(
      10,
      Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX)
    );
    const newY = Math.max(
      70,
      Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY)
    );
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

  // Close custom dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-thematic-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [openDropdown]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter & Sort logic
  const filteredTxns = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesMethod =
          methodFilter === "all" || t.method === methodFilter;
        const matchesStatus =
          statusFilter === "all" || t.status === statusFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          t.orderNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.trxId?.toLowerCase().includes(q) ||
          t.customerPhone.includes(q);

        return matchesMethod && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "date-asc") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "amount-desc") {
          return b.amount - a.amount;
        }
        if (sortBy === "amount-asc") {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, methodFilter, statusFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredTxns.length / PAGE_SIZE) || 1;
  const paginatedTxns = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTxns.slice(start, start + PAGE_SIZE);
  }, [filteredTxns, currentPage]);

  // Financial KPI calculations
  const totalVerified = useMemo(() => {
    return transactions
      .filter((t) => t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const pendingVerification = useMemo(() => {
    return transactions.filter((t) => t.status === "pending_verification");
  }, [transactions]);

  const pendingAmount = useMemo(() => {
    return pendingVerification.reduce((sum, t) => sum + t.amount, 0);
  }, [pendingVerification]);

  const isFiltered =
    methodFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "date-desc";

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Mobile Dedicated Sticky Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Order #, TrxID, or phone..."
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

      {/* ── Desktop Top Header Banner (Hidden on Mobile) ── */}
      <div className="hidden sm:flex flex-row items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-amber-500" />
            Payment Transaction Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time ledger of customer payments, MFS TrxID verification, and settlement statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-2xl shadow-xs">
            ৳{totalVerified.toLocaleString()} Verified Collections
          </span>
        </div>
      </div>

      {/* ── KPI Cards Strip (Mobile Swipe / Desktop 3-Grid) ── */}
      <PaymentKpiStrip
        totalCount={transactions.length}
        pendingCount={pendingVerification.length}
        pendingAmount={pendingAmount}
        verifiedAmount={totalVerified}
      />

      {/* ── Pending Action Alert Banner ── */}
      {hasMounted && pendingVerification.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <div>
              <p className="font-bold text-foreground">
                {pendingVerification.length} Transaction(s) Pending MFS / COD Confirmation
              </p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Verify merchant SMS or bank statement against submitted TrxIDs before order dispatch.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("pending_verification");
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
          >
            Review Pending
          </button>
        </div>
      )}

      {/* ── Desktop Thematic Filter Dock ── */}
      <PaymentFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Desktop Table View ── */}
      <PaymentDesktopTable
        transactions={paginatedTxns}
        copiedId={copiedId}
        onCopy={handleCopy}
        onSelectTxn={setSelectedTxn}
        onVerify={verifyTransaction}
      />

      {/* ── Mobile Card List View ── */}
      <PaymentMobileList
        transactions={paginatedTxns}
        copiedId={copiedId}
        onCopy={handleCopy}
        onSelectTxn={setSelectedTxn}
        onVerify={verifyTransaction}
      />

      {/* ── Pagination ── */}
      <CategoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalItems={filteredTxns.length}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* ── Mobile Draggable Floating Filter Button ── */}
      <PaymentFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={isFiltered}
      />

      {/* ── Mobile Fullscreen Filters Modal ── */}
      <PaymentMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        methodFilter={methodFilter}
        setMethodFilter={(m) => {
          setMethodFilter(m);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={(sort) => {
          setSortBy(sort);
          setCurrentPage(1);
        }}
        totalResults={filteredTxns.length}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onReset={() => {
          setMethodFilter("all");
          setStatusFilter("all");
          setSortBy("date-desc");
          setCurrentPage(1);
        }}
      />

      {/* ── Quick Inspect Modal ── */}
      <PaymentInspectModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onVerify={verifyTransaction}
      />
    </div>
  );
}
