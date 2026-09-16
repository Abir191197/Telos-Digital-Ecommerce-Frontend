"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiCard } from "./dashboard/KpiCard";
import {
  ConfirmationDialogState,
  ProductConfirmDialog,
  ProductManageModal,
  ProductFormModal,
  ProductMobileFilterModal,
  ProductFloatingFilterFab,
  ProductFloatingActionPill,
  ProductDesktopTable,
  ProductCardItem,
  ProductFilterDock,
  ProductFormValues,
} from "./products";

export function AdminProductsView() {
  const router = useRouter();
  const { products, addProduct, deleteProduct, updateProduct } =
    useAdminStore();

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

  // Modals & Confirmation Popups
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "primary",
    onConfirm: () => {},
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // New product form state
  const [formData, setFormData] = useState<ProductFormValues>({
    title: "",
    brand: "Apple",
    categorySlug: "smartphones",
    shortDesc: "",
    price: "",
    originalPrice: "",
    stock: 10,
    badge: "",
    warranty: "",
    hasVoucher: false,
    voucherType: "percentage",
    voucherValue: "",
    voucherCode: "",
    showVoucherOnCard: false,
    sku: "",
    description: "",
    isFeatured: false,
    isFlashDeal: false,
  });

  const [formImages, setFormImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80",
  ]);

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
    const total = products.length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const activeCategories = new Set(
      products.map((p) => p.categoryName).filter(Boolean)
    ).size;
    return { total, lowStock, outOfStock, activeCategories };
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.categoryName).filter(Boolean))
    );
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat =
          categoryFilter === "all" || p.categoryName === categoryFilter;

        let matchesStock = true;
        if (stockStatusFilter === "in-stock") matchesStock = p.stock > 5;
        if (stockStatusFilter === "low-stock")
          matchesStock = p.stock > 0 && p.stock <= 5;
        if (stockStatusFilter === "out-stock") matchesStock = p.stock <= 0;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q);

        return matchesCat && matchesStock && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock-asc") return a.stock - b.stock;
        if (sortBy === "stock-desc") return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, categoryFilter, stockStatusFilter, searchQuery, sortBy]);

  // Paginated View
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Warning Confirmation for Single Delete
  const requestDeleteProduct = (product: Product) => {
    setActiveMenuId(null);
    setConfirmDialog({
      isOpen: true,
      title: "Delete Product Listing",
      message: `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone and will remove it from all storefront listings.`,
      confirmLabel: "Yes, Delete Product",
      variant: "danger",
      onConfirm: () => {
        deleteProduct(product.id);
        setSelectedIds((prev) => prev.filter((id) => id !== product.id));
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Warning Confirmation for Bulk Delete
  const requestBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: "Delete Selected Products",
      message: `You are about to permanently delete ${selectedIds.length} product(s). This will immediately purge their catalog listings and inventory records.`,
      confirmLabel: `Delete ${selectedIds.length} Items`,
      variant: "danger",
      onConfirm: () => {
        selectedIds.forEach((id) => deleteProduct(id));
        setSelectedIds([]);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleOpenAddModal = () => {
    router.push("/dashboard/products?action=create");
  };

  const handleOpenEditModal = (product: Product) => {
    setActiveMenuId(null);
    router.push(`/dashboard/products?action=edit&id=${product.id}`);
  };

  // Warning Popup on Form Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || Number(formData.price) <= 0) return;

    const categoryName = formData.categorySlug.replace(/-/g, " ");
    const thumbnail = formImages[0] || "";

    if (editingProduct) {
      setConfirmDialog({
        isOpen: true,
        title: "Save Product Updates",
        message: `Confirm updating "${formData.title}"? Price will be set to ৳${Number(
          formData.price
        ).toLocaleString()} with stock set to ${formData.stock} units.`,
        confirmLabel: "Save Changes",
        variant: "primary",
        onConfirm: () => {
          updateProduct(editingProduct.id, {
            name: formData.title,
            categoryName: categoryName,
            categorySlug: formData.categorySlug,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
            stock: Number(formData.stock),
            inStock: Number(formData.stock) > 0,
            brand: formData.brand,
            sku: formData.sku,
            thumbnail: thumbnail,
            images: formImages,
            shortDescription: formData.shortDesc,
            description: formData.description,
            isFeatured: formData.isFeatured,
            isFlashDeal: formData.isFlashDeal,
            specifications: {
              ...(editingProduct.specifications || {}),
              Brand: formData.brand,
              Warranty: formData.warranty || "1 Year Brand Warranty",
            }
          });
          setShowAddModal(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const created: Product = {
        id: `prod-${Date.now()}`,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.title,
        shortDescription: formData.shortDesc || `Authentic ${formData.title} with official brand warranty.`,
        description: formData.description || `Premium authentic ${formData.title} with verified warranty.`,
        categoryId: "cat-general",
        categorySlug: formData.categorySlug,
        categoryName: categoryName,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        discountPercentage: 0,
        currency: "BDT",
        rating: 4.9,
        reviewCount: 1,
        stock: Number(formData.stock),
        inStock: Number(formData.stock) > 0,
        isFeatured: formData.isFeatured,
        isFlashDeal: formData.isFlashDeal,
        isNewArrival: true,
        images: formImages,
        thumbnail: thumbnail,
        brand: formData.brand,
        sku:
          formData.sku ||
          `TELOS-${formData.brand.slice(0, 3).toUpperCase()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`,
        specifications: {
          Brand: formData.brand,
          Warranty: formData.warranty || "1 Year Brand Warranty",
        },
        tags: formData.badge ? [formData.badge.toLowerCase()] : ["official-store", "tech"],
        createdAt: new Date().toISOString(),
      };

      addProduct(created);
      setShowAddModal(false);
    }
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Mobile Dedicated Search Bar & Add Action ── */}
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
          href="/dashboard/products?action=create"
          className="h-10 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          title="Add New Product"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </Link>
      </div>

      {/* ── Top Header Banner (Hidden on mobile, desktop only) ── */}
      <div className="hidden sm:block relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                Catalog &amp; Warehouse
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Manage Products
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live stock balances, catalog health, valuation, and SKU control.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
            <Link
              href="/dashboard/products?action=create"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 Essential Clean KPI Cards (Horizontal Swipe Carousel on mobile, Grid on desktop) ── */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none sm:h-full">
          <KpiCard
            title="Catalog SKUs"
            rawValue={metrics.total}
            change="Total items"
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
            title="Low Stock (≤5)"
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

      {/* ── Desktop Filter, Search & View Toggle Dock ── */}
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

      {/* ── PRODUCTS CONTENT: Mobile & Grid Views ── */}
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
              onOpenEdit={handleOpenEditModal}
              onRequestDelete={requestDeleteProduct}
              onManageMobile={setManagingProduct}
            />
          ))
        )}
      </div>

      {/* ── TABLE VIEW: Full Desktop Table (Rendered if viewMode === 'table') ── */}
      {viewMode === "table" && (
        <ProductDesktopTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onOpenEdit={handleOpenEditModal}
          onRequestDelete={requestDeleteProduct}
        />
      )}

      {/* Desktop Pagination Strip (when in table mode) */}
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

      {/* Mobile Pagination (Always shown on mobile or card view) */}
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

      {/* ── Confirmation Modal ── */}
      <ProductConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* ── Mobile Product Management Sheet/Modal ── */}
      <ProductManageModal
        product={managingProduct}
        onClose={() => setManagingProduct(null)}
        onEdit={handleOpenEditModal}
        onDelete={requestDeleteProduct}
      />

      {/* ── Mobile Floating Bulk Action Pill ── */}
      <ProductFloatingActionPill
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={requestBulkDelete}
      />

      {/* ── Mobile Draggable Floating Filter Button ── */}
      <ProductFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={categoryFilter !== "all" || stockStatusFilter !== "all" || sortBy !== "name"}
      />

      {/* ── Mobile Fullscreen Filters Modal ── */}
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
