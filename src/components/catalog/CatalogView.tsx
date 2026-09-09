"use client";

import React, { useState, useMemo } from "react";
import { Product, Category } from "@/types/ecommerce.types";
import { GridViewMode } from "@/types/catalog.types";
import { ProductCard } from "@/components/common";
import { SupportAndHelpstrip } from "@/components/shared";
import { FilterSidebar } from "./FilterSidebar";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { CatalogHeader } from "./CatalogHeader";
import { EmptyCatalogState } from "./CatalogStateViews";
import { X, Plus, ChevronDown, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogViewProps {
  initialProducts: Product[];
  category?: Category;
  title?: string;
  subtitle?: string;
}

const ITEMS_PER_PAGE = 12;

export function CatalogView({
  initialProducts,
  category,
  title,
  subtitle,
}: CatalogViewProps) {
  // Filter state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating-desc" | "newest">("featured");
  const [viewMode, setViewMode] = useState<GridViewMode>("grid-4");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Compute available brands & overall price bounds
  const availableBrands = useMemo(() => {
    const map = new Map<string, number>();
    initialProducts.forEach((p) => {
      map.set(p.brand, (map.get(p.brand) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [initialProducts]);

  const priceBounds = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 100000 };
    const prices = initialProducts.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [initialProducts]);

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Brands
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // 2. Price bounds
    if (minPrice !== undefined) {
      list = list.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // 3. Rating
    if (selectedRating !== undefined) {
      list = list.filter((p) => p.rating >= selectedRating);
    }

    // 4. In Stock
    if (inStockOnly) {
      list = list.filter((p) => p.inStock && p.stock > 0);
    }

    // 5. On Sale
    if (onSaleOnly) {
      list = list.filter((p) => (p.discountPercentage || 0) > 0 || p.badge === "Sale");
    }

    // 6. Sorting
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "newest":
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [
    initialProducts,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    selectedRating !== undefined ||
    inStockOnly ||
    onSaleOnly;

  // Handlers
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleResetAll = () => {
    setSelectedBrands([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedRating(undefined);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="container px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* ── Page Header / Intro ── */}
      <div className="space-y-1.5 pb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          {title || (category ? category.name : "All Products")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle ||
            (category
              ? category.description
              : "Discover official Bangladesh warranty devices, smartphones, computing workstations, audio, and authentic lifestyle tech.")}
        </p>
      </div>

      {/* ── Main Catalog Two-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Faceted Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <FilterSidebar
              availableBrands={availableBrands}
              selectedBrands={selectedBrands}
              onToggleBrand={handleToggleBrand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceBounds={priceBounds}
              onPriceChange={handlePriceChange}
              selectedRating={selectedRating}
              onSelectRating={(r) => {
                setSelectedRating(r);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              inStockOnly={inStockOnly}
              onToggleInStock={() => {
                setInStockOnly((v) => !v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onSaleOnly={onSaleOnly}
              onToggleOnSale={() => {
                setOnSaleOnly((v) => !v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onResetAll={handleResetAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        {/* Right Column: Catalog Feed */}
        <div className="lg:col-span-9 space-y-5">
          {/* Header Controls (Count, Sort, Grid toggles) */}
          <CatalogHeader
            totalCount={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={(s) => setSortBy(s)}
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode)}
            onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Dismissible Filter Chips Bar */}
          <ActiveFiltersBar
            selectedBrands={selectedBrands}
            onRemoveBrand={handleToggleBrand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onClearPrice={() => handlePriceChange(undefined, undefined)}
            selectedRating={selectedRating}
            onClearRating={() => setSelectedRating(undefined)}
            inStockOnly={inStockOnly}
            onClearInStock={() => setInStockOnly(false)}
            onSaleOnly={onSaleOnly}
            onClearOnSale={() => setOnSaleOnly(false)}
            onClearAll={handleResetAll}
            totalFilteredCount={filteredProducts.length}
          />

          {/* Product Cards Feed or Empty State */}
          {filteredProducts.length === 0 ? (
            <EmptyCatalogState onResetFilters={handleResetAll} />
          ) : (
            <div
              className={cn(
                "grid gap-3 sm:gap-5",
                viewMode === "grid-3"
                  ? "grid-cols-2 md:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Load More Progress Bar */}
          {hasMore && (
            <div className="mt-8 flex flex-col items-center justify-center text-center space-y-3 pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Showing <strong className="text-foreground">{displayedProducts.length}</strong> of{" "}
                <strong className="text-foreground">{filteredProducts.length}</strong> items
              </p>

              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 rounded-xl bg-card border border-border/90 hover:border-amber-500/70 hover:bg-amber-500/5 px-6 py-3 text-xs sm:text-sm font-bold text-foreground shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-amber-500" />
                <span>Load More Products ({filteredProducts.length - displayedProducts.length} left)</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer Slide-over (z-50) ── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-background p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  Refine Catalog
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FilterSidebar
              availableBrands={availableBrands}
              selectedBrands={selectedBrands}
              onToggleBrand={handleToggleBrand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceBounds={priceBounds}
              onPriceChange={handlePriceChange}
              selectedRating={selectedRating}
              onSelectRating={(r) => {
                setSelectedRating(r);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              inStockOnly={inStockOnly}
              onToggleInStock={() => {
                setInStockOnly((v) => !v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onSaleOnly={onSaleOnly}
              onToggleOnSale={() => {
                setOnSaleOnly((v) => !v);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onResetAll={handleResetAll}
              hasActiveFilters={hasActiveFilters}
            />

            <div className="mt-8 pt-4 border-t border-border/70">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 text-xs font-bold shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProducts.length} results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Support & Guarantee Strip at Bottom ── */}
      <section className="pt-6">
        <SupportAndHelpstrip />
      </section>
    </div>
  );
}
