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
import { X, Plus, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, SlidersHorizontal } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const catalogFeedRef = React.useRef<HTMLDivElement>(null);

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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, startIndex]);

  // Thematic pagination range generator with ellipsis
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined = undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= validCurrentPage - delta && i <= validCurrentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (typeof i === "number" && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === "number" && i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      if (typeof i === "number") l = i;
    }

    return rangeWithDots;
  }, [totalPages, validCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (catalogFeedRef.current) {
      catalogFeedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    selectedRating !== undefined ||
    inStockOnly ||
    onSaleOnly;

  // Handlers (reset to page 1 on filter changes)
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setSelectedBrands([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedRating(undefined);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
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
                setCurrentPage(1);
              }}
              inStockOnly={inStockOnly}
              onToggleInStock={() => {
                setInStockOnly((v) => !v);
                setCurrentPage(1);
              }}
              onSaleOnly={onSaleOnly}
              onToggleOnSale={() => {
                setOnSaleOnly((v) => !v);
                setCurrentPage(1);
              }}
              onResetAll={handleResetAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        {/* Right Column: Catalog Feed */}
        <div ref={catalogFeedRef} className="lg:col-span-9 space-y-5 scroll-mt-24">
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

          {/* Thematic Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
              <p className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                Showing <strong className="text-foreground">{startIndex + 1}</strong>–
                <strong className="text-foreground">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
                </strong>{" "}
                of <strong className="text-foreground">{filteredProducts.length}</strong> products
              </p>

              <nav aria-label="Catalog Pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className={cn(
                    "inline-flex h-9 sm:h-10 items-center justify-center gap-1 rounded-xl border border-border/70 px-3 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95",
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground border-transparent"
                      : "bg-card text-foreground hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer shadow-2xs"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden xs:inline">Prev</span>
                </button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1">
                  {paginationRange.map((page, idx) => {
                    if (typeof page === "string") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex h-9 w-9 items-center justify-center text-xs font-bold text-muted-foreground select-none"
                        >
                          •••
                        </span>
                      );
                    }

                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer",
                          isCurrent
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30"
                            : "border border-border/60 bg-card text-muted-foreground hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-foreground shadow-2xs"
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className={cn(
                    "inline-flex h-9 sm:h-10 items-center justify-center gap-1 rounded-xl border border-border/70 px-3 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95",
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed bg-muted/40 text-muted-foreground border-transparent"
                      : "bg-card text-foreground hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer shadow-2xs"
                  )}
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
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
                setCurrentPage(1);
              }}
              inStockOnly={inStockOnly}
              onToggleInStock={() => {
                setInStockOnly((v) => !v);
                setCurrentPage(1);
              }}
              onSaleOnly={onSaleOnly}
              onToggleOnSale={() => {
                setOnSaleOnly((v) => !v);
                setCurrentPage(1);
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
