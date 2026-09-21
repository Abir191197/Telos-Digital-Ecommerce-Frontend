"use client";

import { useState, useMemo } from "react";
import { ConfirmationDialogState } from "@/components/common/ConfirmationModal";
import {
  useGetAllWishlistsQuery,
  useDeleteAdminWishlistItemMutation,
  useBulkDeleteAdminWishlistItemsMutation,
  type BackendWishlistItem,
} from "@/services/api/wishlist/wishlistApi";

const ITEMS_PER_PAGE = 12;

export function useAdminWishlistsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "primary",
    onConfirm: () => {},
  });

  const { data: wishlistResponse, isLoading, refetch } = useGetAllWishlistsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: searchQuery || undefined,
  });

  const [deleteWishlistMutation] = useDeleteAdminWishlistItemMutation();
  const [bulkDeleteMutation] = useBulkDeleteAdminWishlistItemsMutation();

  const wishlistItems: BackendWishlistItem[] = wishlistResponse?.data || [];
  const meta = wishlistResponse?.meta || { page: 1, limit: ITEMS_PER_PAGE, total: wishlistItems.length, totalPage: 1 };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalItemsCount = wishlistItems.length;
    const uniqueCustomers = new Set(wishlistItems.map((it) => it.customerId)).size;
    const avgWishlistSize = uniqueCustomers > 0 ? Number((totalItemsCount / uniqueCustomers).toFixed(1)) : 0;
    const inStockItems = wishlistItems.filter((it) => (it.product?.stock || 0) > 0).length;
    const inStockRate = totalItemsCount > 0 ? Math.round((inStockItems / totalItemsCount) * 100) : 100;

    return {
      totalItemsCount,
      uniqueCustomers,
      avgWishlistSize,
      inStockRate,
    };
  }, [wishlistItems]);

  // Selection Logic
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === wishlistItems.length && wishlistItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(wishlistItems.map((it) => it.id));
    }
  };

  // Single Delete
  const requestDeleteItem = (item: BackendWishlistItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove from Customer Wishlist?",
      message: `Are you sure you want to delete "${item.product?.name || 'this item'}" from ${item.customer?.name || 'the customer'}'s wishlist?`,
      confirmLabel: "Delete Item",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteWishlistMutation(item.id).unwrap();
          showToast("Wishlist item removed successfully.");
          setSelectedIds((prev) => prev.filter((id) => id !== item.id));
          refetch();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to remove wishlist item.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk Delete
  const requestBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Wishlist Items?`,
      message: `Are you sure you want to remove ${selectedIds.length} items from customer wishlists?`,
      confirmLabel: `Delete ${selectedIds.length} Items`,
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await bulkDeleteMutation({ ids: selectedIds }).unwrap();
          showToast(`${res.data?.deletedCount ?? selectedIds.length} wishlist items deleted successfully.`);
          setSelectedIds([]);
          refetch();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to complete bulk deletion.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return {
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
  };
}
