"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Star,
  Search,
  X,
  MessageSquare,
  ShieldCheck,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { AdminReview } from "@/stores";
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
} from "./reviews";
import {
  ProductConfirmDialog,
  type ConfirmationDialogState,
} from "@/components/admin/products/ProductConfirmDialog";
import {
  useGetAdminReviewsQuery,
  useGetAdminReviewsSummaryQuery,
  useToggleReviewVisibilityMutation,
  useDeleteReviewMutation,
  AdminReviewsQueryParams,
} from "@/services/api/reviews/reviewApi";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export function AdminReviewsView() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "rating-desc" | "rating-asc"
  >("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);

  // Selected review for the Detail Modal
  const [viewingReview, setViewingReview] = useState<AdminReview | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Build real query params for backend
  const queryParams: AdminReviewsQueryParams = useMemo(() => {
    const params: AdminReviewsQueryParams = {
      page: currentPage,
      limit: PAGE_SIZE,
      searchTerm: searchQuery.trim() || undefined,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    if (ratingFilter !== "all") {
      params.rating = Number(ratingFilter);
    }

    if (sortBy === "rating-desc") {
      params.sortBy = "rating";
      params.sortOrder = "desc";
    } else if (sortBy === "rating-asc") {
      params.sortBy = "rating";
      params.sortOrder = "asc";
    } else if (sortBy === "date-asc") {
      params.sortBy = "createdAt";
      params.sortOrder = "asc";
    } else {
      params.sortBy = "createdAt";
      params.sortOrder = "desc";
    }

    return params;
  }, [currentPage, searchQuery, statusFilter, ratingFilter, sortBy]);

  // RTK Query hooks connecting to real PostgreSQL database
  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    isFetching,
  } = useGetAdminReviewsQuery(queryParams);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
  } = useGetAdminReviewsSummaryQuery();

  const [toggleVisibilityMutation] = useToggleReviewVisibilityMutation();
  const [deleteReviewMutation] = useDeleteReviewMutation();

  const backendReviews = reviewsResponse?.data || [];
  const totalItems = reviewsResponse?.meta?.total ?? 0;
  const totalPages = Math.max(1, reviewsResponse?.meta?.totalPage ?? 1);

  // Map backend structure to the UI components' expected AdminReview interface
  const reviews: AdminReview[] = useMemo(() => {
    return backendReviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productName: r.product?.name || "Product",
      productSlug: r.product?.slug || "",
      productThumbnail: r.product?.thumbnail || "",
      customerName: r.customer?.name || "Customer",
      customerEmail: r.customer?.email || "",
      customerPhone: r.customer?.phone || null,
      rating: r.rating,
      title: r.title || undefined,
      comment: r.comment || "",
      date: r.createdAt,
      verifiedPurchase: r.isVerifiedPurchase,
      status: (r.status?.toLowerCase() || (r.isVisible ? "published" : "hidden")) as
        | "published"
        | "hidden"
        | "flagged",
    }));
  }, [backendReviews]);

  // Keep viewingReview updated if its status changed in live queries
  useEffect(() => {
    if (viewingReview) {
      const updated = reviews.find((r) => r.id === viewingReview.id);
      if (updated) {
        setViewingReview(updated);
      }
    }
  }, [reviews]);

  // Desktop view mode toggle (Table vs Cards)
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Three-dot action dropdown menu active ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Thematic dropdown state for desktop dock
  const [openDropdown, setOpenDropdown] = useState<
    "status" | "rating" | "sort" | null
  >(null);

  // Confirmation modal state for review deletion
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Delete Review",
    variant: "danger",
    onConfirm: () => {},
  });

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

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  // Close custom dropdowns & 3-dot action menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-thematic-dropdown]")) {
        setOpenDropdown(null);
      }
      if (!target.closest("[data-action-menu]")) {
        setActiveMenuId(null);
      }
    };
    if (openDropdown || activeMenuId) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [openDropdown, activeMenuId]);

  // KPI Calculations directly from PostgreSQL database summary
  const totalCount = summaryData?.totalCount ?? totalItems;
  const avgRating = summaryData?.avgRating ?? 5.0;
  const hiddenCount = summaryData?.hiddenCount ?? 0;
  const flaggedCount = summaryData?.flaggedCount ?? 0;

  const isFiltered =
    statusFilter !== "all" || ratingFilter !== "all" || sortBy !== "date-desc";

  // Action Handlers
  const handleToggleVisibility = async (
    reviewId: string,
    targetStatus?: "published" | "hidden" | "flagged"
  ) => {
    try {
      const normalizedStatus = targetStatus
        ? (targetStatus.toUpperCase() as "PUBLISHED" | "HIDDEN" | "FLAGGED")
        : undefined;
      await toggleVisibilityMutation({
        id: reviewId,
        status: normalizedStatus,
      }).unwrap();

      showToast("Review visibility updated successfully.");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update review visibility.");
    }
  };

  const handleDeletePrompt = (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    setConfirmDialog({
      isOpen: true,
      title: "Delete Review Permanently",
      message: `Are you sure you want to delete the review by "${
        target?.customerName || "customer"
      }" on "${target?.productName}"? This action cannot be reversed.`,
      confirmLabel: "Delete Review",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteReviewMutation(reviewId).unwrap();
          if (viewingReview?.id === reviewId) {
            setViewingReview(null);
          }
          showToast("Review deleted successfully.");
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to delete review.");
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  if (isReviewsLoading && reviews.length === 0) {
    return <AdminReviewsSkeleton />;
  }

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Mobile Dedicated Sticky Search Bar */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer, product, or review text..."
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

      {/* Desktop Top Header Banner (Hidden on Mobile) */}
      <div className="hidden sm:flex flex-row items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
            Customer Review Monitoring
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Moderate verified customer feedback, hide spam or inappropriate ratings, and audit flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-2xl shadow-xs flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {avgRating.toFixed(1)} Overall Store Rating
          </span>
        </div>
      </div>

      {/* KPI Cards Strip (Mobile Swipe / Desktop 4-Grid) */}
      <ReviewKpiStrip
        totalCount={totalCount}
        avgRating={avgRating}
        hiddenCount={hiddenCount}
        flaggedCount={flaggedCount}
      />

      {/* Thematic Desktop Filter Dock (rounded-3xl) */}
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

      {/* Loading Overlay State indicator */}
      {isFetching && (
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground py-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Synchronizing reviews with database...</span>
        </div>
      )}

      {/* Desktop Table or Card Grid View */}
      <div className="hidden md:block">
        {viewMode === "table" ? (
          <ReviewDesktopTable
            reviews={reviews}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDeletePrompt}
            onViewReview={(rev) => setViewingReview(rev)}
          />
        ) : (
          <ReviewCardGrid
            reviews={reviews}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDeletePrompt}
            onViewReview={(rev) => setViewingReview(rev)}
          />
        )}
      </div>

      {/* Mobile Card List View */}
      <ReviewMobileList
        reviews={reviews}
        onToggleVisibility={handleToggleVisibility}
        onDelete={handleDeletePrompt}
        onViewReview={(rev) => setViewingReview(rev)}
      />

      {/* Pagination */}
      <CategoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Mobile Draggable Floating Filter Button */}
      <PaymentFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={isFiltered}
      />

      {/* Mobile Fullscreen Filters Modal */}
      <ReviewMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        statusFilter={statusFilter}
        setStatusFilter={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        ratingFilter={ratingFilter}
        setRatingFilter={(r) => {
          setRatingFilter(r);
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
          setStatusFilter("all");
          setRatingFilter("all");
          setSortBy("date-desc");
          setCurrentPage(1);
        }}
      />

      {/* Small Detail Modal for Viewing Full Review */}
      <ReviewDetailModal
        review={viewingReview}
        isOpen={Boolean(viewingReview)}
        onClose={() => setViewingReview(null)}
        onToggleVisibility={handleToggleVisibility}
        onDelete={handleDeletePrompt}
      />

      {/* Confirmation Dialog for Destructive Actions */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
