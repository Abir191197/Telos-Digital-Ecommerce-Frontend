"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { AdminReview } from "@/stores";
import {
  useGetAdminReviewsQuery,
  useGetAdminReviewsSummaryQuery,
  useToggleReviewVisibilityMutation,
  useDeleteReviewMutation,
  AdminReviewsQueryParams,
} from "@/services/api/reviews/reviewApi";
import { type ConfirmationDialogState } from "@/components/admin/products/ProductConfirmDialog";

export const PAGE_SIZE = 8;

export function useAdminReviewsManager() {
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
  }, [reviews, viewingReview]);

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

  // Real Database Action: Toggle Visibility
  const handleToggleVisibility = async (id: string) => {
    const target = reviews.find((r) => r.id === id);
    const isCurrentlyHidden = target?.status === "hidden";
    try {
      await toggleVisibilityMutation({
        id,
        isVisible: isCurrentlyHidden,
      }).unwrap();
      showToast(
        isCurrentlyHidden
          ? "Review is now published and visible to customers."
          : "Review hidden from the storefront."
      );
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update review visibility.");
    }
    setActiveMenuId(null);
  };

  // Real Database Action: Delete Review
  const handleDeleteClick = (id: string, customerName: string) => {
    setActiveMenuId(null);
    setConfirmDialog({
      isOpen: true,
      title: "Permanently Delete Review?",
      message: `Are you sure you want to delete the review by "${customerName}"? This action cannot be undone.`,
      confirmLabel: "Delete Review",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteReviewMutation(id).unwrap();
          showToast("Review permanently removed.");
          if (viewingReview?.id === id) {
            setViewingReview(null);
          }
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to delete review.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setRatingFilter("all");
    setSortBy("date-desc");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return {
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
    isSummaryLoading,
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
  };
}
