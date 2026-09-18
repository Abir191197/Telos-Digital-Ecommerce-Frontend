"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Product } from "@/types/ecommerce.types";
import {
  Boxes,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Package,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/common";
import { KpiCard } from "../dashboard/KpiCard";
import {
  useGetAdminProductsQuery,
  useGetInventorySummaryQuery,
} from "@/services/api/products/productApi";
import {
  InventoryDesktopTable,
  InventoryCardItem,
  InventoryFilterDock,
  StockFilterType,
  SortOptionType,
  ManageStockModal,
} from "./";

export function AdminInventoryView() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilterType>("all");
  const [customThreshold, setCustomThreshold] = useState("");
  const [sortBy, setSortBy] = useState<SortOptionType>("stock-asc");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Manage Stock Modal state
  const [managingProduct, setManagingProduct] = useState<Product | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Real database-wide inventory summary metrics
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetInventorySummaryQuery();

  // Server-side query parameters mapped directly to backend
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchQuery.trim() || undefined,
    };

    if (stockFilter === "under_5") {
      params.stockFilter = "under_5";
    } else if (stockFilter === "under_10") {
      params.stockFilter = "under_10";
    } else if (stockFilter === "out_of_stock") {
      params.stockFilter = "out_of_stock";
    } else if (stockFilter === "custom" && customThreshold.trim() !== "") {
      const num = Number(customThreshold);
      if (!isNaN(num)) {
        params.maxStock = num;
      }
    }

    if (sortBy === "stock-asc") {
      params.sortBy = "stock";
      params.sortOrder = "asc";
    } else if (sortBy === "stock-desc") {
      params.sortBy = "stock";
      params.sortOrder = "desc";
    } else if (sortBy === "price-asc") {
      params.sortBy = "price";
      params.sortOrder = "asc";
    } else if (sortBy === "price-desc") {
      params.sortBy = "price";
      params.sortOrder = "desc";
    } else if (sortBy === "name") {
      params.sortBy = "name";
      params.sortOrder = "asc";
    }

    return params;
  }, [currentPage, itemsPerPage, searchQuery, stockFilter, customThreshold, sortBy]);

  // Fetch paginated products from Backend
  const {
    data: adminProductsResponse,
    isLoading: isProductsLoading,
    isFetching,
    refetch: refetchProducts,
  } = useGetAdminProductsQuery(queryParams);

  const products: Product[] = adminProductsResponse?.data || [];
  const backendTotal = adminProductsResponse?.meta?.total ?? products.length;
  const totalPages = Math.max(1, Math.ceil(backendTotal / itemsPerPage));

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleOpenManageStock = (product: Product) => {
    setManagingProduct(product);
    setIsManageModalOpen(true);
  };

  const handleRefresh = () => {
    refetchSummary();
    refetchProducts();
    showToast("Inventory balances refreshed from warehouse.");
  };

  // Export CSV helper
  const handleExportCSV = () => {
    if (products.length === 0) {
      showToast("No products available to export.");
      return;
    }

    const headers = ["Product Name", "SKU", "Category", "Price", "Stock Level", "Stock Status"];
    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku || ""}"`,
      `"${p.categoryName || ""}"`,
      p.price,
      p.stock,
      p.stock <= 0 ? "OUT_OF_STOCK" : p.stock <= 5 ? "LOW_STOCK" : "IN_STOCK",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `teloscart-inventory-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Inventory report downloaded successfully.");
  };

  if (isProductsLoading && products.length === 0 && !adminProductsResponse) {
    return (
      <PageLoader
        title="Loading Inventory..."
        description="Fetching real-time stock balances and warehouse inventory counts."
        badgeText="Inventory Management"
      />
    );
  }

  // Database-wide KPI numbers
  const totalCount = summaryData?.total ?? backendTotal;
  const inStockCount = summaryData?.inStock ?? 0;
  const criticalLowCount = summaryData?.criticalLow ?? 0;
  const reserveLowCount = summaryData?.reserveLow ?? 0;
  const outOfStockCount = summaryData?.outOfStock ?? 0;

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
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
                Warehouse &amp; Logistics
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
              Stock &amp; Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Super Admin real-time stock balances, custom threshold watchlist, and low-inventory alarms.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh stock balances"
            >
              <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isFetching && "animate-spin text-amber-500")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/dashboard/inventory/audit"
              className="h-10 px-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="View Stock Audit Trail"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Audit Trail</span>
            </Link>
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Export filtered stock list to CSV"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database-Wide KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Total Products"
          rawValue={totalCount}
          change="Catalog items"
          isPositive={true}
          icon={Boxes}
        />
        <KpiCard
          title="In-Stock Healthy"
          rawValue={inStockCount}
          change="Stock > 10 units"
          isPositive={true}
          icon={CheckCircle2}
        />
        <KpiCard
          title="Low Stock Watch"
          rawValue={reserveLowCount > 0 ? reserveLowCount : criticalLowCount}
          change={reserveLowCount > 0 ? `${reserveLowCount} items ≤ 10` : "Healthy balance"}
          isPositive={reserveLowCount === 0 && criticalLowCount === 0}
          icon={AlertTriangle}
        />
        <KpiCard
          title="Out of Stock"
          rawValue={outOfStockCount}
          change={outOfStockCount > 0 ? "Zero balance" : "All available"}
          isPositive={outOfStockCount === 0}
          icon={AlertOctagon}
        />
      </div>

      {/* Filter Dock */}
      <InventoryFilterDock
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        stockFilter={stockFilter}
        setStockFilter={(val) => {
          setStockFilter(val);
          setCurrentPage(1);
        }}
        customThreshold={customThreshold}
        setCustomThreshold={(val) => {
          setCustomThreshold(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={(val) => {
          setSortBy(val);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalFilteredCount={backendTotal}
      />

      {/* Desktop Table View */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <InventoryDesktopTable
            products={products}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onManageStock={handleOpenManageStock}
          />

          {/* Mobile fallback when in table mode */}
          <div className="md:hidden space-y-3">
            {products.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-bold text-sm text-foreground">No stock records found</p>
              </div>
            ) : (
              products.map((p) => (
                <InventoryCardItem
                  key={p.id}
                  product={p}
                  isSelected={selectedIds.includes(p.id)}
                  onToggleSelect={handleToggleSelect}
                  onManageStock={handleOpenManageStock}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl bg-card border border-border/60 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-bold text-sm text-foreground">No stock records found</p>
            </div>
          ) : (
            products.map((p) => (
              <InventoryCardItem
                key={p.id}
                product={p}
                isSelected={selectedIds.includes(p.id)}
                onToggleSelect={handleToggleSelect}
                onManageStock={handleOpenManageStock}
              />
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
            of <span className="font-bold text-foreground">{backendTotal}</span> items
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

      {/* Manage Stock Modal */}
      <ManageStockModal
        product={managingProduct}
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onStockUpdated={(msg) => {
          showToast(msg);
          refetchProducts();
          refetchSummary();
        }}
      />
    </div>
  );
}
