"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/ecommerce.types";
import {
  Search,
  Plus,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  AlertOctagon,
  Layers,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiCard } from "./dashboard/KpiCard";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "@/services/api/products/productApi";
import {
  ConfirmationDialogState,
  ProductConfirmDialog,
  ProductManageModal,
  ProductMobileFilterModal,
  ProductFloatingFilterFab,
  ProductFloatingActionPill,
  ProductDesktopTable,
  ProductCardItem,
  ProductFilterDock,
  AdminProductsSkeleton,
} from "./products";

export function AdminProductsView() {
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

  // Custom Thematic Dropdown States
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

  // Resolved entities
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

  // Close 3-dot menu and custom dropdowns on outside click
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
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
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
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Clean Route Navigation to dedicated editor pages (NO MODALS)
  const handleOpenEdit = (product: Product) => {
    router.push(`/dashboard/products/${product.slug || product.id}/edit`);
  };

  if (isProductsLoading && products.length === 0) {
    return <AdminProductsSkeleton />;
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

      {/* Mobile Dedicated Search Bar & Add Action */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search title, brand, or SKU..."
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
        <Link
          href="/dashboard/products/create"
          className="h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          title="Create New Product"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </Link>
      </div>

      {/* Top Header Banner */}
      <div className="hidden sm:block relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                Catalog &amp; Warehouse
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Manage Products
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live stock balances, catalog health, valuation, and SKU control.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
            <Link
              href="/dashboard/products/create"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Essential KPI Cards */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Total Products"
            rawValue={metrics.total}
            change="Catalog items"
            isPositive={true}
            icon={Boxes}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Active Categories"
            rawValue={metrics.activeCategories}
            change="Catalog aisles"
            isPositive={true}
            icon={Layers}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Low Stock (<=5)"
            rawValue={metrics.lowStock}
            change={metrics.lowStock > 0 ? "Restock needed" : "Healthy levels"}
            isPositive={metrics.lowStock === 0}
            icon={AlertTriangle}
          />
        </div>
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Out of Stock"
            rawValue={metrics.outOfStock}
            change={metrics.outOfStock > 0 ? "Zero balance" : "All available"}
            isPositive={metrics.outOfStock === 0}
            icon={AlertOctagon}
          />
        </div>
      </div>

      {/* Desktop Filter, Search & View Toggle Dock */}
      <ProductFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={setStockStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* Products Content: Grid View */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4",
          viewMode === "table" && "md:hidden"
        )}
      >
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full rounded-2xl sm:rounded-3xl border border-border/70 bg-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-bold text-sm text-foreground">No products found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          paginatedProducts.map((prod) => (
            <ProductCardItem
              key={prod.id}
              product={prod}
              isSelected={selectedIds.includes(prod.id)}
              isMenuOpen={activeMenuId === prod.id}
              onToggleSelect={handleToggleSelect}
              onToggleMenu={(id) => setActiveMenuId(activeMenuId === id ? null : id)}
              onOpenEdit={handleOpenEdit}
              onRequestDelete={requestDeleteProduct}
              onManageMobile={setManagingProduct}
            />
          ))
        )}
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <ProductDesktopTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onOpenEdit={handleOpenEdit}
          onRequestDelete={requestDeleteProduct}
        />
      )}

      {/* Desktop Pagination Strip */}
      {viewMode === "table" && (
        <div className="hidden md:flex p-4 border border-border/40 bg-card rounded-2xl items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{paginatedProducts.length}</strong> of{" "}
            <strong className="text-foreground">{filteredProducts.length}</strong> products
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono font-bold text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      <div
        className={cn(
          "p-4 border border-border/60 bg-card rounded-2xl flex items-center justify-between text-xs text-muted-foreground",
          viewMode === "table" && "md:hidden"
        )}
      >
        <p>
          Page <strong className="text-foreground">{currentPage}</strong> of{" "}
          <strong className="text-foreground">{totalPages}</strong>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed font-semibold"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-lg border border-border/60 text-foreground disabled:opacity-40 hover:bg-muted transition-colors cursor-pointer disabled:cursor-not-allowed font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Mobile Product Management Sheet/Modal */}
      <ProductManageModal
        product={managingProduct}
        onClose={() => setManagingProduct(null)}
        onEdit={handleOpenEdit}
        onDelete={requestDeleteProduct}
      />

      {/* Mobile Floating Bulk Action Pill */}
      <ProductFloatingActionPill
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={requestBulkDelete}
      />

      {/* Mobile Draggable Floating Filter Button */}
      <ProductFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={categoryFilter !== "all" || stockStatusFilter !== "all" || sortBy !== "name"}
      />

      {/* Mobile Fullscreen Filters Modal */}
      <ProductMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={(cat) => {
          setCategoryFilter(cat);
          setCurrentPage(1);
        }}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={(status) => {
          setStockStatusFilter(status);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={filteredProducts.length}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onReset={() => {
          setCategoryFilter("all");
          setStockStatusFilter("all");
          setSortBy("name");
        }}
      />
    </div>
  );
}
