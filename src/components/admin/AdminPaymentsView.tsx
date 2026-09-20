"use client";

import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Clock, Loader2 } from "lucide-react";
import { AdminPaymentTransaction } from "@/stores";
import {
  PaymentKpiStrip,
  PaymentFilterDock,
  PaymentDesktopTable,
  PaymentMobileList,
  PaymentMobileFilterModal,
  PaymentFloatingFilterFab,
  PaymentInspectModal,
  PaymentPagination,
  PaymentConfirmModal,
  AdminPaymentsSkeleton,
} from "./payments";

import {
  useGetAllPaymentsQuery,
  useVerifyPaymentMutation,
} from "@/services/api/payments/paymentApi";

const PAGE_SIZE = 8;

export function AdminPaymentsView() {
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

  // Confirmation Modal state for Approve / Reject actions
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    action: "verified" | "rejected" | null;
    transaction: AdminPaymentTransaction | null;
  }>({
    isOpen: false,
    action: null,
    transaction: null,
  });
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  // Dropdown states for custom UI controls
  const [openDropdown, setOpenDropdown] = useState<
    "method" | "status" | "sort" | null
  >(null);

  // Mobile drawer filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Draggable FAB state for mobile
  const [fabPosition, setFabPosition] = useState({ x: 20, y: 100 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Backend RTK Query integration
  const { data: paymentsResponse, isLoading } = useGetAllPaymentsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    searchTerm: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    method: methodFilter !== "all" ? methodFilter : undefined,
    sortBy: sortBy.startsWith("amount") ? "amount" : "createdAt",
    sortOrder: sortBy.endsWith("asc") ? "asc" : "desc",
  });

  const [verifyPaymentMutation] = useVerifyPaymentMutation();

  const transactions =
    (paymentsResponse?.data?.transactions as unknown as AdminPaymentTransaction[]) || [];
  const stats = paymentsResponse?.data?.stats;
  const meta = (paymentsResponse as any)?.meta || {
    total: 0,
    totalPage: 1,
    page: 1,
    limit: PAGE_SIZE,
  };

  const totalItems = meta?.total ?? transactions.length;
  const totalPages = Math.max(
    1,
    meta?.totalPage ?? Math.ceil(totalItems / PAGE_SIZE) ?? 1
  );

  // Ensure currentPage doesn't exceed totalPages when filters change
  useEffect(() => {
    if (totalPages >= 1 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Prompt confirmation modal when user initiates an Approve or Reject action
  const handleRequestVerify = (id: string, status: "verified" | "rejected") => {
    const txn =
      transactions.find((t) => t.id === id) ||
      (selectedTxn?.id === id ? selectedTxn : null);
    if (txn) {
      setConfirmModalState({
        isOpen: true,
        action: status,
        transaction: txn,
      });
    }
  };

  // Perform verified / rejected mutation after confirmation
  const handleConfirmVerify = async (
    id: string,
    status: "verified" | "rejected",
    note?: string
  ) => {
    try {
      setIsSubmittingVerify(true);
      await verifyPaymentMutation({ id, status, note }).unwrap();
      if (selectedTxn?.id === id) {
        setSelectedTxn((prev) => (prev ? { ...prev, status } : null));
      }
      setConfirmModalState({
        isOpen: false,
        action: null,
        transaction: null,
      });
    } catch (err) {
      console.error("Payment verification failed:", err);
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  // Draggable FAB pointer listeners
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

  // KPIs from backend stats
  const totalVerified = stats?.verifiedVolume || 0;
  const pendingCount = stats?.pendingCount || 0;
  const pendingAmount = stats?.pendingVolume || 0;

  const isFiltered =
    methodFilter !== "all" ||
    statusFilter !== "all" ||
    searchQuery.trim().length > 0;

  if (isLoading && transactions.length === 0) {
    return <AdminPaymentsSkeleton />;
  }

  return (
    <div className="space-y-6">

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Verify Payments & Transactions
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Live Ledger
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit customer payments, verify MFS transaction IDs, and reconcile settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
              <Clock className="h-4 w-4" />
              <span>{pendingCount} Pending Verification</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <PaymentKpiStrip
        totalCount={totalItems}
        pendingCount={pendingCount}
        pendingAmount={pendingAmount}
        verifiedAmount={totalVerified}
      />

      {/* Pending Action Alert Banner */}
      {hasMounted && pendingCount > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <div>
              <p className="font-bold text-foreground">
                {pendingCount} Transaction(s) Pending MFS / COD Confirmation
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

      {/* Top Filter Dock (Desktop & Tablet) */}
      <PaymentFilterDock
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
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
        setSortBy={(s) => {
          setSortBy(s);
          setCurrentPage(1);
        }}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* Data Table with Loading State */}
      {isLoading ? (
        <div className="rounded-3xl bg-card p-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <p className="text-xs font-semibold">Loading payment transactions...</p>
        </div>
      ) : (
        <>
          <PaymentDesktopTable
            transactions={transactions}
            copiedId={copiedId}
            onCopy={handleCopy}
            onSelectTxn={setSelectedTxn}
            onVerify={handleRequestVerify}
          />

          <PaymentMobileList
            transactions={transactions}
            copiedId={copiedId}
            onCopy={handleCopy}
            onSelectTxn={setSelectedTxn}
            onVerify={handleRequestVerify}
          />
        </>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalItems > 0 && (
        <PaymentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <PaymentInspectModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onVerify={handleRequestVerify}
        />
      )}

      {/* Payment Confirmation Modal for Approve / Reject */}
      <PaymentConfirmModal
        isOpen={confirmModalState.isOpen}
        action={confirmModalState.action}
        transaction={confirmModalState.transaction}
        isLoading={isSubmittingVerify}
        onClose={() =>
          setConfirmModalState({
            isOpen: false,
            action: null,
            transaction: null,
          })
        }
        onConfirm={handleConfirmVerify}
      />

      {/* Mobile Floating Action Button & Fullscreen Filter Modal */}
      <PaymentFloatingFilterFab
        isFiltered={isFiltered}
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

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
        totalResults={totalItems}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onReset={() => {
          setMethodFilter("all");
          setStatusFilter("all");
          setSortBy("date-desc");
          setSearchQuery("");
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
