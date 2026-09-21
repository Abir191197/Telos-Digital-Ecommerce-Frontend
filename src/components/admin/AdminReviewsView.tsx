"use client";

import React from "react";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import { PaymentFloatingFilterFab } from "@/components/admin/payments/PaymentFloatingFilterFab";
import {
  ReviewKpiStrip,
  ReviewFilterDock,
  ReviewDesktopTable,
  ReviewCardGrid,
  ReviewMobileList,
  ReviewMobileFilterModal,
  ReviewDetailModal,
  AdminReviewsSkeleton,
  useAdminReviewsManager,
  PAGE_SIZE,
} from "./reviews";
import { ProductConfirmDialog } from "@/components/admin/products/ProductConfirmDialog";

export function AdminReviewsView() {
  const {
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    hasMounted,
    viewingReview,
    setViewingReview,
    toastMessage,
    isReviewsLoading,
    isFetching,
    totalItems,
    totalPages,
    reviews,
    viewMode,
    setViewMode,
    activeMenuId,
    setActiveMenuId,
    openDropdown,
    setOpenDropdown,
    confirmDialog,
    setConfirmDialog,
    showMobileFilters,
    setShowMobileFilters,
    fabPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    totalCount,
    avgRating,
    hiddenCount,
    flaggedCount,
    handleToggleVisibility,
    handleDeleteClick,
    handleResetFilters,
  } = useAdminReviewsManager();

  if (isReviewsLoading && !hasMounted) {
    return <AdminReviewsSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Customer Reviews
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-3 w-3" />
              Store Trust & Reputation
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit customer ratings, manage storefront product visibility, and investigate flagged feedback.
          </p>
        </div>

        {isFetching && (
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground self-start sm:self-auto bg-muted/40 px-3 py-1.5 rounded-xl">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
            <span>Syncing database...</span>
          </div>
        )}
      </div>

      {/* Top Stats Metric Strip */}
      <ReviewKpiStrip
        totalCount={totalCount}
        avgRating={avgRating}
        hiddenCount={hiddenCount}
        flaggedCount={flaggedCount}
      />

      {/* Search, Filter, Sort & View Mode Dock */}
      <ReviewFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* Main Reviews List: Table, Card Grid, or Mobile View */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">No reviews found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            No customer ratings match the current filters or query criteria.
          </p>
          {(statusFilter !== "all" || ratingFilter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          {viewMode === "table" && (
            <div className="hidden md:block">
              <ReviewDesktopTable
                reviews={reviews}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                onToggleVisibility={handleToggleVisibility}
                onDelete={(id) => {
                  const r = reviews.find((rev) => rev.id === id);
                  handleDeleteClick(id, r?.customerName || "Customer");
                }}
                onViewReview={setViewingReview}
              />
            </div>
          )}

          {/* Desktop Cards Grid View */}
          {viewMode === "card" && (
            <div className="hidden md:block">
              <ReviewCardGrid
                reviews={reviews}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                onToggleVisibility={handleToggleVisibility}
                onDelete={(id) => {
                  const r = reviews.find((rev) => rev.id === id);
                  handleDeleteClick(id, r?.customerName || "Customer");
                }}
                onViewReview={setViewingReview}
              />
            </div>
          )}

          {/* Mobile Dedicated Responsive Card List */}
          <div className="md:hidden">
            <ReviewMobileList
              reviews={reviews}
              onToggleVisibility={handleToggleVisibility}
              onDelete={(id) => {
                const r = reviews.find((rev) => rev.id === id);
                handleDeleteClick(id, r?.customerName || "Customer");
              }}
              onViewReview={setViewingReview}
            />
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-2">
              <CategoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={totalItems}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Review Detail Inspection Modal */}
      <ReviewDetailModal
        review={viewingReview}
        isOpen={Boolean(viewingReview)}
        onClose={() => setViewingReview(null)}
        onToggleVisibility={handleToggleVisibility}
        onDelete={(id) => {
          handleDeleteClick(id, viewingReview?.customerName || "Customer");
        }}
      />

      {/* Confirmation Dialog for Permanent Deletions */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }))}
      />

      {/* Mobile Draggable Floating Filter Button */}
      <PaymentFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={statusFilter !== "all" || ratingFilter !== "all" || searchQuery !== ""}
      />

      {/* Mobile Fullscreen Filter Modal */}
      <ReviewMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        statusFilter={statusFilter}
        setStatusFilter={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
        ratingFilter={ratingFilter}
        setRatingFilter={(rating) => {
          setRatingFilter(rating);
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
        onReset={handleResetFilters}
      />
    </div>
  );
}
