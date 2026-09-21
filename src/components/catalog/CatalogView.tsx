"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/types/ecommerce.types";
import { GridViewMode } from "@/types/catalog.types";
import { SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { FilterSidebar } from "./FilterSidebar";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { CatalogHeader } from "./CatalogHeader";
import { CatalogIntroHeader } from "./CatalogIntroHeader";
import { CatalogProductGrid } from "./CatalogProductGrid";
import { CatalogGridSkeleton } from "./CatalogStateViews";
import { CatalogMobileDrawer } from "./CatalogMobileDrawer";
import { useGetProductsQuery } from "@/services/api/products/productApi";

interface CatalogViewProps {
  initialProducts?: Product[];
  category?: Category;
  title?: string;
  subtitle?: string;
  showSupportStrip?: boolean;
  showHeader?: boolean;
}

const INITIAL_BATCH_SIZE = 12;
const BATCH_INCREMENT = 8;

export function CatalogView({
  initialProducts = [],
  category,
  title,
  subtitle,
  showSupportStrip = true,
  showHeader = true,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const queryParam = searchParams.get("q") || searchParams.get("search") || "";

  const { data: serverProductsData, isLoading } = useGetProductsQuery({
    limit: 100,
    categoryId: category?.id,
  });

  const allProducts = useMemo(() => {
    if (serverProductsData?.data && serverProductsData.data.length > 0) {
      return serverProductsData.data;
    }
    return initialProducts;
  }, [serverProductsData, initialProducts]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>(() => queryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    if (brandParam && brandParam !== "all") {
      return [brandParam];
    }
    return [];
  });
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating-desc" | "newest">("featured");
  const [viewMode, setViewMode] = useState<GridViewMode>("grid-4");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const catalogFeedRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll State (matching FlashDealsView & CategoryGridSection pattern)
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Sync if URL query param (?q=) changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [queryParam]);

  // Sync if URL brand param changes
  useEffect(() => {
    if (brandParam && brandParam !== "all") {
      setSelectedBrands([brandParam]);
      setVisibleCount(INITIAL_BATCH_SIZE);
    } else if (brandParam === "all") {
      setSelectedBrands([]);
      setVisibleCount(INITIAL_BATCH_SIZE);
    }
  }, [brandParam]);

  // Compute available brands & overall price bounds
  const availableBrands = useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((p) => {
      map.set(p.brand, (map.get(p.brand) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 100000 };
    const prices = allProducts.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [allProducts]);

  // Filter and Sort Engine — strictly depends on allProducts from API
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // 0. Keyword search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }

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
    allProducts,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  // Infinite Scroll Slice
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  // IntersectionObserver for Infinite Pagination
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + BATCH_INCREMENT, filteredProducts.length)
            );
            setIsLoadingMore(false);
          }, 450);
        }
      },
      { rootMargin: "150px" }
    );

    const el = loadMoreTriggerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoadingMore, filteredProducts.length]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedBrands.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    selectedRating !== undefined ||
    inStockOnly ||
    onSaleOnly;

  // Filter state handlers (resets visibleCount for infinite pagination)
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedRating(undefined);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="container px-3 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Page Header / Intro */}
        <CatalogIntroHeader
          showHeader={showHeader}
          title={title}
          subtitle={subtitle}
          category={category}
        />

        {/* Main Catalog Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Faceted Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-[150px] self-start rounded-3xl bg-card border-0 shadow-[14px_18px_36px_-8px_rgba(0,0,0,0.08),24px_28px_50px_-12px_rgba(0,0,0,0.05)] dark:shadow-[14px_20px_42px_-8px_rgba(0,0,0,0.7),24px_30px_55px_-12px_rgba(0,0,0,0.55)]">
            <div className="p-5 max-h-[calc(100vh-175px)] overflow-y-auto overscroll-contain scrollbar-none">
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
                  setVisibleCount(INITIAL_BATCH_SIZE);
                }}
                inStockOnly={inStockOnly}
                onToggleInStock={() => {
                  setInStockOnly((v) => !v);
                  setVisibleCount(INITIAL_BATCH_SIZE);
                }}
                onSaleOnly={onSaleOnly}
                onToggleOnSale={() => {
                  setOnSaleOnly((v) => !v);
                  setVisibleCount(INITIAL_BATCH_SIZE);
                }}
                onResetAll={handleResetAll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

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
              searchQuery={searchQuery}
              onClearSearch={() => handleSearchChange("")}
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

            {/* Product Cards Feed or Loading Skeleton or Empty State */}
            {isLoading && allProducts.length === 0 ? (
              <CatalogGridSkeleton count={12} />
            ) : (
              <CatalogProductGrid
                products={displayedProducts}
                totalFilteredCount={filteredProducts.length}
                viewMode={viewMode}
                cacheKey={`${sortBy}-${viewMode}-${selectedBrands.join("-")}-${searchQuery}`}
                onResetFilters={handleResetAll}
                isLoadingMore={isLoadingMore}
                skeletonCount={Math.min(BATCH_INCREMENT, filteredProducts.length - displayedProducts.length || BATCH_INCREMENT)}
              />
            )}

            {/* Infinite Scroll Trigger Sentinel */}
            {!isLoading && hasMore && (
              <div
                ref={loadMoreTriggerRef}
                aria-hidden="true"
                className="h-8 w-full pointer-events-none"
              />
            )}

            {!isLoading && !hasMore && filteredProducts.length > INITIAL_BATCH_SIZE && (
              <div className="py-8 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground border-t border-border/40 mt-6">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>All {filteredProducts.length} verified products loaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer Slide-over */}
        <CatalogMobileDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
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
            setVisibleCount(INITIAL_BATCH_SIZE);
          }}
          inStockOnly={inStockOnly}
          onToggleInStock={() => {
            setInStockOnly((v) => !v);
            setVisibleCount(INITIAL_BATCH_SIZE);
          }}
          onSaleOnly={onSaleOnly}
          onToggleOnSale={() => {
            setOnSaleOnly((v) => !v);
            setVisibleCount(INITIAL_BATCH_SIZE);
          }}
          onResetAll={handleResetAll}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredProducts.length}
        />

        {/* Support & Guarantee Strip at Bottom */}
        {showSupportStrip && (
          <section className="pt-6">
            <SupportAndHelpstrip />
          </section>
        )}
      </div>
    </LazyMotion>
  );
}
