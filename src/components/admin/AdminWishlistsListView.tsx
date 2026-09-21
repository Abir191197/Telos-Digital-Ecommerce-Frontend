"use client";

import React from "react";
import { Heart } from "lucide-react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ProductFloatingActionPill } from "./products/ProductFloatingActionPill";
import { AdminWishlistsSkeleton } from "./AdminWishlistsSkeleton";
import {
  AdminWishlistTable,
  AdminWishlistCardGrid,
  AdminWishlistsKpiGrid,
  useAdminWishlistsManager,
} from "./wishlists";
import { Search, X, List, LayoutGrid, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminWishlistsListView() {
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    selectedIds,
    setSelectedIds,
    toastMessage,
    confirmDialog,
    setConfirmDialog,
    wishlistItems,
    meta,
    isLoading,
    metrics,
    handleToggleSelect,
    handleSelectAll,
    requestDeleteItem,
    requestBulkDelete,
  } = useAdminWishlistsManager();

  if (isLoading && wishlistItems.length === 0) {
    return <AdminWishlistsSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500/20" />
            Customer Wishlists
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Monitor consumer purchase intent, saved products, and high-interest catalog items.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <AdminWishlistsKpiGrid metrics={metrics} />

      {/* Search & Filter Dock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customer, email, product, or SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full pl-9 pr-9 text-xs rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border/40">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Card Grid */}
      {viewMode === "table" ? (
        <AdminWishlistTable
          items={wishlistItems}
          selectedIds={selectedIds}
          searchQuery={searchQuery}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onDeleteItem={requestDeleteItem}
        />
      ) : (
        <AdminWishlistCardGrid
          items={wishlistItems}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onDeleteItem={requestDeleteItem}
        />
      )}

      {/* Pagination Strip */}
      <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
        <p>
          Showing {wishlistItems.length} of {meta.total} wishlist items
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold">
            {currentPage} / {meta.totalPage || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= (meta.totalPage || 1)}
            onClick={() => setCurrentPage((p) => Math.min(meta.totalPage || 1, p + 1))}
            className="p-2 rounded-xl border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Pill */}
      <ProductFloatingActionPill
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={requestBulkDelete}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
