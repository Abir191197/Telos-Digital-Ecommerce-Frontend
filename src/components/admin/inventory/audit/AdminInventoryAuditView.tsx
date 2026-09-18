"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/common";
import { KpiCard } from "../../dashboard/KpiCard";
import {
  useGetAuditLogsQuery,
  useGetAuditSummaryQuery,
  StockAuditLog,
} from "@/services/api/inventory/inventoryApi";
import {
  InventoryAuditDesktopTable,
  InventoryAuditCardItem,
  InventoryAuditFilterDock,
} from "./";

export function AdminInventoryAuditView() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | "INCREASE" | "DECREASE">("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Query parameters for audit logs
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchQuery.trim() || undefined,
      actionType: actionFilter !== "all" ? actionFilter : undefined,
    };
  }, [currentPage, itemsPerPage, searchQuery, actionFilter]);

  // Real data fetching
  const {
    data: auditResponse,
    isLoading,
    isFetching,
    refetch: refetchLogs,
  } = useGetAuditLogsQuery(queryParams);

  const {
    data: summaryData,
    refetch: refetchSummary,
  } = useGetAuditSummaryQuery();

  const logs: StockAuditLog[] = auditResponse?.data || [];
  const backendTotal = auditResponse?.meta?.total ?? logs.length;
  const totalPages = Math.max(1, Math.ceil(backendTotal / itemsPerPage));

  const handleRefresh = () => {
    refetchLogs();
    refetchSummary();
    showToast("Audit records refreshed.");
  };

  // Export CSV helper
  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast("No audit records to export.");
      return;
    }

    const headers = [
      "Timestamp",
      "Product Name",
      "SKU",
      "Action Type",
      "Quantity",
      "Previous Stock",
      "New Stock",
      "Reason",
      "Note",
      "Performed By",
    ];

    const rows = logs.map((l) => [
      `"${l.createdAt}"`,
      `"${(l.product?.name || "").replace(/"/g, '""')}"`,
      `"${l.product?.sku || ""}"`,
      l.actionType,
      l.quantity,
      l.previousStock,
      l.newStock,
      `"${(l.reason || "").replace(/"/g, '""')}"`,
      `"${(l.note || "").replace(/"/g, '""')}"`,
      `"${l.performedBy || "Super Admin"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `teloscart-stock-audit-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Stock audit log CSV downloaded.");
  };

  if (isLoading && logs.length === 0 && !auditResponse) {
    return (
      <PageLoader
        title="Loading Audit Trail..."
        description="Fetching chronological stock modification history and compliance records."
        badgeText="Inventory Audit"
      />
    );
  }

  const totalLogs = summaryData?.totalLogs ?? backendTotal;
  const totalAdded = summaryData?.totalAdded ?? 0;
  const totalRemoved = summaryData?.totalRemoved ?? 0;
  const netChange = summaryData?.netChange ?? 0;

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                Compliance &amp; Warehouse Trail
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
              Stock Inventory Audit Log
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Immutable journal recording who, why, when, and how product stock balances were modified.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <Link
              href="/dashboard/inventory"
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Return to live inventory balances"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Stock Overview</span>
            </Link>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh audit history"
            >
              <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isFetching && "animate-spin text-amber-500")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Export audit records to CSV"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Total Audit Events"
          rawValue={totalLogs}
          change="Immutable records"
          isPositive={true}
          icon={ShieldCheck}
        />
        <KpiCard
          title="Stock Inflow (+)"
          rawValue={totalAdded}
          change="Total units added"
          isPositive={true}
          icon={TrendingUp}
        />
        <KpiCard
          title="Stock Outflow (-)"
          rawValue={totalRemoved}
          change="Total units deducted"
          isPositive={totalRemoved === 0}
          icon={TrendingDown}
        />
        <KpiCard
          title="Net Stock Shift"
          rawValue={Math.abs(netChange)}
          prefix={netChange >= 0 ? "+" : "-"}
          change={netChange >= 0 ? "Positive growth" : "Net inventory dip"}
          isPositive={netChange >= 0}
          icon={Activity}
        />
      </div>

      {/* Filter Dock */}
      <InventoryAuditFilterDock
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        actionFilter={actionFilter}
        setActionFilter={(val) => {
          setActionFilter(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalFilteredCount={backendTotal}
      />

      {/* Desktop Table (NO ACTION BUTTONS per user specification) */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <InventoryAuditDesktopTable logs={logs} />

          {/* Mobile fallback when in table view on small screens */}
          <div className="md:hidden space-y-3">
            {logs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
                <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-bold text-sm text-foreground">No audit entries found</p>
              </div>
            ) : (
              logs.map((log) => (
                <InventoryAuditCardItem key={log.id} log={log} />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {logs.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
              <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-bold text-sm text-foreground">No audit entries found</p>
            </div>
          ) : (
            logs.map((log) => (
              <InventoryAuditCardItem key={log.id} log={log} />
            ))
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {backendTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * itemsPerPage, backendTotal)}
            </span>{" "}
            of <span className="font-bold text-foreground">{backendTotal}</span> audit logs
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-9 px-3 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((pageNum, idx, arr) => {
                  const showEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          currentPage === pageNum
                            ? "bg-amber-500 text-zinc-950 font-black shadow-xs"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-9 px-3 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1 text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
