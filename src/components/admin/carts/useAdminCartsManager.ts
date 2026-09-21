"use client";

import { useState, useMemo } from "react";
import { ConfirmationDialogState } from "@/components/common/ConfirmationModal";
import {
  useGetAllCartsQuery,
  useDeleteAdminCartItemMutation,
  useBulkDeleteAdminCartItemsMutation,
  type BackendCartItem,
} from "@/services/api/cart/cartApi";

const ITEMS_PER_PAGE = 12;

export function useAdminCartsManager() {
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

  const { data: cartResponse, isLoading, refetch } = useGetAllCartsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: searchQuery || undefined,
  });

  const [deleteCartItemMutation] = useDeleteAdminCartItemMutation();
  const [bulkDeleteMutation] = useBulkDeleteAdminCartItemsMutation();

  const cartItems: BackendCartItem[] = cartResponse?.data || [];
  const meta = cartResponse?.meta || { page: 1, limit: ITEMS_PER_PAGE, total: cartItems.length, totalPage: 1 };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalItemsCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const uniqueCustomers = new Set(cartItems.map((it) => it.customerId)).size;
    const totalValue = cartItems.reduce((acc, it) => acc + ((it.unitPrice || 0) * (it.quantity || 1)), 0);
    const avgCartSize = uniqueCustomers > 0 ? (totalItemsCount / uniqueCustomers).toFixed(1) : "0";

    return {
      totalItemsCount,
      uniqueCustomers,
      totalValue,
      avgCartSize,
    };
  }, [cartItems]);

  // Selection Logic
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length && cartItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((it) => it.id));
    }
  };

  // Single Delete
  const requestDeleteItem = (item: BackendCartItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Item from Cart?",
      message: `Are you sure you want to delete "${item.product?.name || 'this item'}" from ${item.customer?.name || 'the customer'}'s cart?`,
      confirmLabel: "Delete Item",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteCartItemMutation(item.id).unwrap();
          showToast("Cart item removed successfully.");
          setSelectedIds((prev) => prev.filter((id) => id !== item.id));
          refetch();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to remove cart item.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Bulk Delete
  const requestBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Cart Items?`,
      message: `Are you sure you want to remove ${selectedIds.length} items from customer carts? This action cannot be undone.`,
      confirmLabel: `Delete ${selectedIds.length} Items`,
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await bulkDeleteMutation({ ids: selectedIds }).unwrap();
          showToast(`${res.data?.deletedCount ?? selectedIds.length} cart items deleted successfully.`);
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
    cartItems,
    meta,
    isLoading,
    metrics,
    handleToggleSelect,
    handleSelectAll,
    requestDeleteItem,
    requestBulkDelete,
  };
}
