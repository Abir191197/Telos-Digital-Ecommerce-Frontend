"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdminStore } from "@/stores";
import { Product } from "@/types/ecommerce.types";
import {
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Package,
  Boxes,
  DollarSign,
  Edit3,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  CheckSquare,
  Square,
  AlertOctagon,
  ExternalLink,
  Layers,
  Filter,
  SlidersHorizontal,
  Move,
  Check,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiCard } from "./dashboard/KpiCard";

interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "warning" | "primary";
  onConfirm: () => void;
}

export function AdminProductsView() {
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
  const [formData, setFormData] = useState({
    name: "",
    categoryName: "Smartphones & Tablets",
    price: 0,
    originalPrice: 0,
    stock: 10,
    brand: "Apple",
    sku: "",
    thumbnail:
      "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80",
  });

  // Mobile Manage Sheet/Modal Product State
  const [managingProduct, setManagingProduct] = useState<Product | null>(null);

  // Mobile Filter Drawer State & Draggable Position
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16, // distance from right
    y: 90, // distance from bottom
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
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryName: categories[0] || "Smartphones & Tablets",
      price: 0,
      originalPrice: 0,
      stock: 10,
      brand: "Apple",
      sku: "",
      thumbnail:
        "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setActiveMenuId(null);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryName: product.categoryName,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stock: product.stock,
      brand: product.brand,
      sku: product.sku || "",
      thumbnail: product.thumbnail,
    });
    setShowAddModal(true);
  };

  // Warning Popup on Form Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) return;

    if (editingProduct) {
      setConfirmDialog({
        isOpen: true,
        title: "Save Product Updates",
        message: `Confirm updating "${formData.name}"? Price will be set to ৳${Number(
          formData.price
        ).toLocaleString()} with stock set to ${formData.stock} units.`,
        confirmLabel: "Save Changes",
        variant: "primary",
        onConfirm: () => {
          updateProduct(editingProduct.id, {
            name: formData.name,
            categoryName: formData.categoryName,
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice || formData.price),
            stock: Number(formData.stock),
            inStock: Number(formData.stock) > 0,
            brand: formData.brand,
            sku: formData.sku,
            thumbnail: formData.thumbnail,
          });
          setShowAddModal(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const created: Product = {
        id: `prod-${Date.now()}`,
        slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        shortDescription: `Authentic ${formData.name} with official brand warranty.`,
        description: `Premium authentic ${formData.name} with verified warranty.`,
        categoryId: "cat-general",
        categorySlug: "general-tech",
        categoryName: formData.categoryName,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        discountPercentage: 0,
        currency: "BDT",
        rating: 4.9,
        reviewCount: 1,
        stock: Number(formData.stock),
        inStock: Number(formData.stock) > 0,
        isFeatured: false,
        isFlashDeal: false,
        isNewArrival: true,
        images: [formData.thumbnail],
        thumbnail: formData.thumbnail,
        brand: formData.brand,
        sku:
          formData.sku ||
          `TELOS-${formData.brand.slice(0, 3).toUpperCase()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`,
        specifications: {
          Brand: formData.brand,
          Warranty: "1 Year Brand Warranty",
        },
        tags: ["official-store", "tech"],
        createdAt: new Date().toISOString(),
      };

      addProduct(created);
      setShowAddModal(false);
    }
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Mobile Dedicated Search Bar (Immediately below navbar on page landing) ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
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
      </div>

      {/* ── Top Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                Catalog &amp; Warehouse
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
              Products Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Live stock balances, catalog health, valuation, and SKU control.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
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

      {/* ── Desktop Filter, Search & View Toggle Dock (Hidden on mobile) ── */}
      <div className="hidden md:flex sticky top-16 z-20 px-4 py-3 bg-card/90 backdrop-blur-xl border rounded-2xl border-border/50 shadow-xs items-center justify-between gap-3 transition-all">
        {/* Desktop Search */}
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
            className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60"
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

        {/* Desktop Custom Thematic Dropdown Cards & View Mode Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Thematic Category Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              aria-label="Filter products by category"
              className={cn(
                "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
                openDropdown === "category"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                  : categoryFilter !== "all"
                  ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
              )}
            >
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Cat:</span>
              <span className="max-w-[110px] truncate">
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  openDropdown === "category" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "category" && (
              <div className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Filter By Category
                </div>
                <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter("all");
                      setCurrentPage(1);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      categoryFilter === "all"
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>All Categories</span>
                    {categoryFilter === "all" && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCurrentPage(1);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        categoryFilter === cat
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      {categoryFilter === cat && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thematic Stock Health Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
              aria-label="Filter products by stock status"
              className={cn(
                "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
                openDropdown === "stock"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                  : stockStatusFilter !== "all"
                  ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
              )}
            >
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Stock:</span>
              <span className="max-w-[90px] truncate">
                {stockStatusFilter === "all"
                  ? "All Stock"
                  : stockStatusFilter === "in-stock"
                  ? "In Stock"
                  : stockStatusFilter === "low-stock"
                  ? "Low Stock"
                  : "Out of Stock"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  openDropdown === "stock" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "stock" && (
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Stock Health
                </div>
                <div className="py-1 space-y-0.5">
                  {[
                    { id: "all", label: "All Stock", badge: "All" },
                    { id: "in-stock", label: "In Stock (>5)", badge: "> 5" },
                    { id: "low-stock", label: "Low Stock (1-5)", badge: "1 - 5" },
                    { id: "out-stock", label: "Out of Stock (0)", badge: "0" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStockStatusFilter(s.id);
                        setCurrentPage(1);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        stockStatusFilter === s.id
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <span>{s.label}</span>
                      {stockStatusFilter === s.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thematic Sort Order Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              aria-label="Sort products order"
              className={cn(
                "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
                openDropdown === "sort"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                  : sortBy !== "name"
                  ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
              )}
            >
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Sort:</span>
              <span className="max-w-[100px] truncate">
                {sortBy === "name"
                  ? "Name (A-Z)"
                  : sortBy === "price-asc"
                  ? "Price: Low-High"
                  : sortBy === "price-desc"
                  ? "Price: High-Low"
                  : sortBy === "stock-desc"
                  ? "Stock: High-Low"
                  : "Stock: Low-High"}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  openDropdown === "sort" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "sort" && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Sort Catalog
                </div>
                <div className="py-1 space-y-0.5">
                  {[
                    { id: "name", label: "Name (A - Z)" },
                    { id: "price-asc", label: "Price: Low to High" },
                    { id: "price-desc", label: "Price: High to Low" },
                    { id: "stock-desc", label: "Stock: High to Low" },
                    { id: "stock-asc", label: "Stock: Low to High" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSortBy(st.id as any);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        sortBy === st.id
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <span>{st.label}</span>
                      {sortBy === st.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-muted/70 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer text-xs",
                viewMode === "card"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Card Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={requestBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD VIEW: Always rendered on Mobile; on Desktop only when viewMode === 'card' ── */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4",
          viewMode === "table" && "md:hidden"
        )}
      >
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full p-10 text-center bg-card rounded-2xl sm:rounded-3xl border border-border/60">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm text-foreground">No products found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          paginatedProducts.map((prod) => {
            const isMenuOpen = activeMenuId === prod.id;
            const isSelected = selectedIds.includes(prod.id);

            return (
              <div
                key={prod.id}
                className={cn(
                  "group relative rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-3 sm:p-4.5 transition-all duration-200 hover:border-amber-500/40 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 flex flex-col justify-between gap-3",
                  isSelected && "ring-2 ring-amber-500 border-amber-500/80 bg-amber-500/[0.02]"
                )}
              >
                {/* ── MOBILE VIEW: Sleek Compact Horizontal Product Card Layout (Sublime ergonomics) ── */}
                <div className="flex md:hidden gap-3.5 items-center">
                  {/* Left: Checkbox + Square Thumbnail with Stock Tag */}
                  <div className="relative shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(prod.id)}
                      className="text-muted-foreground hover:text-amber-500 p-1 -ml-1 cursor-pointer transition-colors active:scale-90"
                      aria-label="Select product"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted/40 border border-border/70 shadow-xs">
                      <Image
                        src={prod.thumbnail}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                      {prod.stock <= 0 ? (
                        <span className="absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-black uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-xs">
                          Out
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="absolute inset-x-0 bottom-0 py-0.5 text-center text-[9px] font-black uppercase tracking-wider bg-amber-500/90 text-zinc-950 backdrop-blur-xs">
                          {prod.stock} Left
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Right: Info, Price & Micro Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">
                        {prod.brand}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/80">
                        {prod.sku || "NO-SKU"}
                      </span>
                    </div>

                    <h4 className="font-bold text-foreground text-xs leading-snug line-clamp-2">
                      {prod.name}
                    </h4>

                    {/* Price and Stock Badge directly under it */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-black text-sm text-foreground">
                          ৳{prod.price.toLocaleString()}
                        </span>
                        {Boolean(prod.originalPrice && prod.originalPrice > prod.price) && (
                          <span className="font-mono text-[10px] line-through text-muted-foreground">
                            ৳{(prod.originalPrice ?? 0).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Stock badge under price */}
                      <div>
                        {prod.stock > 5 ? (
                          <span className="inline-flex items-center text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {prod.stock} in stock
                          </span>
                        ) : prod.stock > 0 ? (
                          <span className="inline-flex items-center text-[10px] font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                            Low stock: {prod.stock}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold font-mono text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                            Sold Out (0 units)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── DESKTOP VIEW: High-End Visual Card Format ── */}
                <div className="hidden md:flex flex-col space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(prod.id)}
                      className="text-muted-foreground hover:text-amber-500 cursor-pointer p-0.5 -ml-0.5 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
                      <Image
                        src={prod.thumbnail}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wide uppercase bg-background/90 text-foreground backdrop-blur-md shadow-xs border border-border/50">
                          {prod.brand}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Only Three-Dot Menu */}
                    <div className="relative" data-action-menu>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : prod.id);
                        }}
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-9 z-30 w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            onClick={() => setActiveMenuId(null)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View in Store</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prod)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                            <span>Edit Details</span>
                          </button>
                          <div className="my-1 border-t border-border/60" />
                          <button
                            type="button"
                            onClick={() => requestDeleteProduct(prod)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            <span>Delete Product</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{prod.categoryName}</span>
                      <span>SKU: {prod.sku || "N/A"}</span>
                    </div>
                    <h3 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 mt-1">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Desktop Card Price & Stock Bar */}
                  <div className="pt-2.5 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">
                        Price
                      </span>
                      <span className="font-mono font-black text-sm text-foreground">
                        ৳{prod.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block font-medium">
                        Stock
                      </span>
                      {prod.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2 py-0.5 text-[10px] font-bold">
                          0 units
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2 py-0.5 text-[10px] font-bold font-mono">
                          {prod.stock} units
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold font-mono">
                          {prod.stock} units
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Mobile Action Bar: Quick Manage Button + Direct View Link ── */}
                <div className="flex md:hidden items-center gap-2 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setManagingProduct(prod)}
                    className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-border/60 active:scale-98"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
                    <span>Manage Product</span>
                  </button>

                  <Link
                    href={`/products/${prod.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    title="View on store"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── TABLE VIEW: Full Desktop Table (Rendered if viewMode === 'table') ── */}
      {viewMode === "table" && (
        <div className="hidden md:block rounded-2xl sm:rounded-3xl border border-border/60 bg-card overflow-visible shadow-xs">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {selectedIds.length > 0 &&
                      selectedIds.length === paginatedProducts.length ? (
                        <CheckSquare className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-sm">No products found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((prod) => {
                    const isMenuOpen = activeMenuId === prod.id;
                    return (
                      <tr
                        key={prod.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors",
                          selectedIds.includes(prod.id) && "bg-amber-500/[0.03]"
                        )}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(prod.id)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {selectedIds.includes(prod.id) ? (
                              <CheckSquare className="h-4 w-4 text-amber-500" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* Product Thumbnail & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30">
                              <Image
                                src={prod.thumbnail}
                                alt={prod.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs xl:max-w-sm">
                              <p className="font-extrabold text-foreground truncate">
                                {prod.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {prod.brand} &bull;{" "}
                                <span className="font-mono">
                                  {prod.sku || "NO-SKU"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">
                            {prod.categoryName}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 text-right font-mono font-black text-foreground text-sm">
                          ৳{prod.price.toLocaleString()}
                        </td>

                        {/* Stock Column (VALUE ONLY - NO ACTION BUTTON) */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={cn(
                              "font-mono font-bold text-xs px-2.5 py-1 rounded-lg inline-block",
                              prod.stock <= 0
                                ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                                : prod.stock <= 5
                                ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                : "text-foreground bg-muted/50"
                            )}
                          >
                            {prod.stock} units
                          </span>
                        </td>

                        {/* Stock Health Badge */}
                        <td className="py-3 px-4">
                          {prod.stock <= 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              Out of Stock
                            </span>
                          ) : prod.stock <= 5 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              In Stock
                            </span>
                          )}
                        </td>

                        {/* Three-Dot Action Column */}
                        <td className="py-3 px-4 text-right relative" data-action-menu>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : prod.id);
                            }}
                            className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Product Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-4 top-11 z-30 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left">
                              <Link
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                onClick={() => setActiveMenuId(null)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>View in Store</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(prod)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>Edit Details</span>
                              </button>
                              <div className="my-1 border-t border-border/60" />
                              <button
                                type="button"
                                onClick={() => requestDeleteProduct(prod)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Product</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Desktop Pagination Strip */}
          <div className="p-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
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

      {/* ── Warning & Confirmation Modal Popup ── */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "p-3 rounded-2xl shrink-0",
                  confirmDialog.variant === "danger"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                )}
              >
                {confirmDialog.variant === "danger" ? (
                  <AlertOctagon className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-foreground tracking-tight">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer",
                  confirmDialog.variant === "danger"
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20"
                    : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
                )}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Product Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-border/80 bg-background p-5 sm:p-6 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {editingProduct ? "Edit Product Listing" : "Add Product to Inventory"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure catalog metadata, pricing tier, and inventory count.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy S25 Ultra 12GB/512GB"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung / Apple"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="120000"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    placeholder="130000"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-bold text-foreground block mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) })
                    }
                    className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Product SKU
                </label>
                <input
                  type="text"
                  placeholder="e.g. TELOS-SAM-9021"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border border-border/70 bg-muted/30 px-3.5 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/70 font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {editingProduct ? "Review & Save" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Mobile Product Management Modal (Opened by "Manage Product" Button on Mobile: z-[9999] covers all navs) ── */}
      {managingProduct && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xl space-y-4 relative animate-in slide-in-from-bottom-6 duration-200">
            {/* Header / Grab Handle */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Mobile Manager
                </span>
              </div>
              <button
                type="button"
                onClick={() => setManagingProduct(null)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product Summary Header */}
            <div className="flex items-start gap-3.5">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-muted/40 border border-border/60 shrink-0">
                <Image
                  src={managingProduct.thumbnail}
                  alt={managingProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {managingProduct.categoryName}
                </span>
                <h4 className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 mt-0.5">
                  {managingProduct.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Brand: <strong className="text-foreground">{managingProduct.brand}</strong> &bull; SKU:{" "}
                  <span className="font-mono">{managingProduct.sku || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Key Metrics / Snapshot */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">
                  Selling Price
                </span>
                <p className="font-mono font-black text-base text-foreground mt-0.5">
                  ৳{managingProduct.price.toLocaleString()}
                </p>
                {managingProduct.originalPrice && managingProduct.originalPrice > managingProduct.price && (
                  <p className="text-[10px] text-muted-foreground line-through">
                    ৳{managingProduct.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">
                  Stock Balance
                </span>
                <div className="mt-0.5">
                  {managingProduct.stock <= 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 px-2.5 py-0.5 text-xs font-bold">
                      0 units (Out of stock)
                    </span>
                  ) : managingProduct.stock <= 5 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 px-2.5 py-0.5 text-xs font-bold font-mono">
                      {managingProduct.stock} units (Low)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold font-mono">
                      {managingProduct.stock} units (Healthy)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/products/${managingProduct.slug}`}
                target="_blank"
                onClick={() => setManagingProduct(null)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="h-4 w-4 text-amber-500" />
                  <span>Preview in Storefront</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">↗</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  const prod = managingProduct;
                  setManagingProduct(null);
                  handleOpenEditModal(prod);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="h-4 w-4 text-blue-500" />
                  <span>Edit Product Details & Stock</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const prod = managingProduct;
                  setManagingProduct(null);
                  requestDeleteProduct(prod);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="h-4 w-4 text-rose-500" />
                  <span>Delete Product Permanently</span>
                </div>
                <span className="text-[10px] font-mono">✕</span>
              </button>
            </div>

            {/* Bottom Dismiss */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setManagingProduct(null)}
                className="w-full py-2.5 rounded-xl border border-border/70 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Floating Bulk Action Bar (Docked above bottom nav: bottom-20 z-40) ── */}
      {selectedIds.length > 0 && (
        <div className="md:hidden fixed bottom-20 inset-x-3.5 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center justify-between pl-3 pr-2 py-2 rounded-full bg-zinc-950/75 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] border-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-400 shrink-0">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-black text-white leading-tight">
                  {selectedIds.length} Selected
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">Bulk Action</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3.5 py-2 rounded-full text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={requestBulkDelete}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-600/30 border-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Draggable Floating Filter Button (Icon-Only Circle) ── */}
      <div
        style={{
          right: `${fabPosition.x}px`,
          bottom: `${fabPosition.y}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="md:hidden fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing"
      >
        <button
          type="button"
          aria-label="Open Filters"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-2xl border-2 border-background/20 active:scale-90 transition-transform pointer-events-none"
        >
          <Filter className="h-5 w-5 text-amber-500 fill-amber-500/30" />
          {(categoryFilter !== "all" || stockStatusFilter !== "all" || sortBy !== "name") && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
          )}
        </button>
      </div>

      {/* ── Mobile Filters Modal (Full Screen Layer: z-[9999], covers all top/bottom navs) ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
          <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground tracking-tight">Filters &amp; Sorting</h3>
                  <p className="text-[11px] text-muted-foreground">Adjust catalog view criteria</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modern Thematic Dropdown Cards (Matching luxury theme, no native OS selects) */}
            <div className="space-y-4 text-xs">
              {/* 1. Category Dropdown Card */}
              <div className="relative" data-thematic-dropdown>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                  className={cn(
                    "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                    openDropdown === "category"
                      ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                      : categoryFilter !== "all"
                      ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                      : "border-border/70 text-foreground hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Cat
                    </span>
                    <span className="text-xs font-bold truncate">
                      {categoryFilter === "all" ? "All Categories" : categoryFilter}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                      openDropdown === "category" && "rotate-180 text-amber-500"
                    )}
                  />
                </button>

                {openDropdown === "category" && (
                  <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-56 overflow-y-auto space-y-0.5 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter("all");
                          setCurrentPage(1);
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                          categoryFilter === "all"
                            ? "bg-amber-500/15 text-amber-500 font-bold"
                            : "text-foreground hover:bg-muted/70"
                        )}
                      >
                        <span>All Categories</span>
                        {categoryFilter === "all" && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(cat);
                            setCurrentPage(1);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                            categoryFilter === cat
                              ? "bg-amber-500/15 text-amber-500 font-bold"
                              : "text-foreground hover:bg-muted/70"
                          )}
                        >
                          <span className="truncate pr-2">{cat}</span>
                          {categoryFilter === cat && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Stock Health Dropdown Card */}
              <div className="relative" data-thematic-dropdown>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Stock Health
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
                  className={cn(
                    "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                    openDropdown === "stock"
                      ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                      : stockStatusFilter !== "all"
                      ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                      : "border-border/70 text-foreground hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Stock
                    </span>
                    <span className="text-xs font-bold truncate">
                      {stockStatusFilter === "all"
                        ? "All Stock"
                        : stockStatusFilter === "in-stock"
                        ? "In Stock (>5 units)"
                        : stockStatusFilter === "low-stock"
                        ? "Low Stock (1-5 units)"
                        : "Out of Stock (0 units)"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                      openDropdown === "stock" && "rotate-180 text-amber-500"
                    )}
                  />
                </button>

                {openDropdown === "stock" && (
                  <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="space-y-0.5 py-1">
                      {[
                        { id: "all", label: "All Stock", sub: "Show everything in catalog" },
                        { id: "in-stock", label: "In Stock (>5)", sub: "Ample quantity available" },
                        { id: "low-stock", label: "Low Stock (1-5)", sub: "Running low, reorder soon" },
                        { id: "out-stock", label: "Out of Stock (0)", sub: "Zero inventory remaining" },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setStockStatusFilter(s.id);
                            setCurrentPage(1);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                            stockStatusFilter === s.id
                              ? "bg-amber-500/15 text-amber-500 font-bold"
                              : "text-foreground hover:bg-muted/70"
                          )}
                        >
                          <div>
                            <p className="font-bold text-xs">{s.label}</p>
                            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                          </div>
                          {stockStatusFilter === s.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Sort Order Dropdown Card */}
              <div className="relative" data-thematic-dropdown>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Sort Catalog
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                  className={cn(
                    "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                    openDropdown === "sort"
                      ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                      : sortBy !== "name"
                      ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                      : "border-border/70 text-foreground hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Sort
                    </span>
                    <span className="text-xs font-bold truncate">
                      {sortBy === "name"
                        ? "Name: Alphabetical (A - Z)"
                        : sortBy === "price-asc"
                        ? "Price: Low to High"
                        : sortBy === "price-desc"
                        ? "Price: High to Low"
                        : sortBy === "stock-desc"
                        ? "Stock: High to Low"
                        : "Stock: Low to High"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                      openDropdown === "sort" && "rotate-180 text-amber-500"
                    )}
                  />
                </button>

                {openDropdown === "sort" && (
                  <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="space-y-0.5 py-1">
                      {[
                        { id: "name", label: "Alphabetical (A - Z)", sub: "Sort by product title" },
                        { id: "price-asc", label: "Price: Low to High", sub: "Cheapest first" },
                        { id: "price-desc", label: "Price: High to Low", sub: "Most expensive first" },
                        { id: "stock-desc", label: "Stock: High to Low", sub: "Highest stock first" },
                        { id: "stock-asc", label: "Stock: Low to High", sub: "Lowest stock first" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSortBy(st.id as any);
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                            sortBy === st.id
                              ? "bg-amber-500/15 text-amber-500 font-bold"
                              : "text-foreground hover:bg-muted/70"
                          )}
                        >
                          <div>
                            <p className="font-bold text-xs">{st.label}</p>
                            <p className="text-[10px] text-muted-foreground">{st.sub}</p>
                          </div>
                          {sortBy === st.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2.5 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setStockStatusFilter("all");
                  setSortBy("name");
                }}
                className="py-3 px-4 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-98"
              >
                Apply ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
