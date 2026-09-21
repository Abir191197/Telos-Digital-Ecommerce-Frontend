"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/ecommerce.types";
import {
  useGetAdminProductsQuery,
  useGetInventorySummaryQuery,
} from "@/services/api/products/productApi";
import { StockFilterType, SortOptionType } from "./InventoryFilterDock";

export function useAdminInventory() {
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

  // Database-wide KPI numbers
  const totalCount = summaryData?.total ?? backendTotal;
  const inStockCount = summaryData?.inStock ?? 0;
  const criticalLowCount = summaryData?.criticalLow ?? 0;
  const reserveLowCount = summaryData?.reserveLow ?? 0;
  const outOfStockCount = summaryData?.outOfStock ?? 0;

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    stockFilter,
    setStockFilter,
    customThreshold,
    setCustomThreshold,
    sortBy,
    setSortBy,
    selectedIds,
    toastMessage,
    managingProduct,
    isManageModalOpen,
    setIsManageModalOpen,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isSummaryLoading,
    isProductsLoading,
    isFetching,
    products,
    backendTotal,
    totalPages,
    totalCount,
    inStockCount,
    criticalLowCount,
    reserveLowCount,
    outOfStockCount,
    handleToggleSelect,
    handleSelectAll,
    handleOpenManageStock,
    handleRefresh,
    handleExportCSV,
    showToast,
    refetchProducts,
    refetchSummary,
  };
}
