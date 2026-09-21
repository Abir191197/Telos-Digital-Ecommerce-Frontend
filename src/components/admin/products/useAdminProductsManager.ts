"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/ecommerce.types";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "@/services/api/products/productApi";
import { ConfirmationDialogState } from "./ProductConfirmDialog";

export function useAdminProductsManager() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc"
  >("name");

  // Selection & Action Dropdowns
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"category" | "stock" | "sort" | null>(null);

  // Confirmation Popups
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "primary",
    onConfirm: () => {},
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Real Backend Data
  const {
    data: adminProductsResponse,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useGetAdminProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || undefined,
  });

  const [deleteProductMutation] = useDeleteProductMutation();

  const products: Product[] = adminProductsResponse?.data || [];
  const backendTotal = adminProductsResponse?.meta?.total || products.length;

  // Mobile Manage Sheet/Modal Product State
  const [managingProduct, setManagingProduct] = useState<Product | null>(null);

  // Mobile Filter Drawer State & Draggable Position
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 90,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
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
    const newX = Math.max(10, Math.min(window.innerWidth - 65, dragStartRef.current.posX + deltaX));
    const newY = Math.max(70, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-action-menu]")) {
        setActiveMenuId(null);
      }
      if (!target.closest("[data-thematic-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    if (activeMenuId || openDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [activeMenuId, openDropdown]);

  // KPI Calculations
  const metrics = useMemo(() => {
    const total = backendTotal;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const activeCategories = new Set(
      products.map((p) => p.categoryName).filter(Boolean)
    ).size;
    return { total, lowStock, outOfStock, activeCategories };
  }, [products, backendTotal]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.categoryName) unique.add(p.categoryName);
    });
    return Array.from(unique);
  }, [products]);

  // Client Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          categoryFilter === "all" ||
          p.categoryName?.toLowerCase() === categoryFilter.toLowerCase() ||
          p.categorySlug === categoryFilter;

        const matchesStock =
          stockStatusFilter === "all" ||
          (stockStatusFilter === "in-stock" && p.stock > 5) ||
          (stockStatusFilter === "low-stock" && p.stock > 0 && p.stock <= 5) ||
          (stockStatusFilter === "out-of-stock" && p.stock <= 0);

        return matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock-asc") return a.stock - b.stock;
        if (sortBy === "stock-desc") return b.stock - a.stock;
        return 0;
      });
  }, [products, categoryFilter, stockStatusFilter, sortBy]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  // Delete Action Handlers
  const requestDeleteProduct = (product: Product) => {
    setActiveMenuId(null);
    setConfirmDialog({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`,
      confirmLabel: "Delete Product",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteProductMutation(product.id).unwrap();
          showToast(`"${product.name}" deleted successfully.`);
          refetchProducts();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to delete product.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const requestBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Products?`,
      message: `Are you sure you want to delete ${selectedIds.length} products? This will archive them immediately.`,
      confirmLabel: `Delete ${selectedIds.length} Items`,
      variant: "danger",
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map((id) => deleteProductMutation(id).unwrap()));
          showToast(`${selectedIds.length} products deleted successfully.`);
          setSelectedIds([]);
          refetchProducts();
        } catch (err: any) {
          showToast(err?.data?.message || "Failed to complete bulk deletion.");
        }
        setConfirmDialog((prev: ConfirmationDialogState) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleOpenEdit = (product: Product) => {
    router.push(`/dashboard/products/${product.slug || product.id}/edit`);
  };

  return {
    products,
    isProductsLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    sortBy,
    setSortBy,
    selectedIds,
    setSelectedIds,
    activeMenuId,
    setActiveMenuId,
    openDropdown,
    setOpenDropdown,
    confirmDialog,
    setConfirmDialog,
    toastMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    metrics,
    categories,
    filteredProducts,
    paginatedProducts,
    managingProduct,
    setManagingProduct,
    showMobileFilters,
    setShowMobileFilters,
    fabPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleToggleSelect,
    handleSelectAll,
    requestDeleteProduct,
    requestBulkDelete,
    handleOpenEdit,
  };
}
