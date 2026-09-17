"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/types/ecommerce.types";
import { GridViewMode } from "@/types/catalog.types";
import { SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation } from "framer-motion";

import { FilterSidebar } from "./FilterSidebar";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { CatalogHeader } from "./CatalogHeader";
import { CatalogIntroHeader } from "./CatalogIntroHeader";
import { CatalogProductGrid } from "./CatalogProductGrid";
import { CatalogPagination } from "./CatalogPagination";
import { CatalogMobileDrawer } from "./CatalogMobileDrawer";
import { useGetProductsQuery } from "@/services/api/products/productApi";

interface CatalogViewProps {
  initialProducts: Product[];
  category?: Category;
  title?: string;
  subtitle?: string;
  showSupportStrip?: boolean;
  showHeader?: boolean;
}

const ITEMS_PER_PAGE = 12;

export function CatalogView({
  initialProducts,
  category,
  title,
  subtitle,
  showSupportStrip = true,
  showHeader = true,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");

  const { data: serverProductsData } = useGetProductsQuery({
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
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const catalogFeedRef = useRef<HTMLDivElement>(null);

  // Sync if URL brand param changes
  useEffect(() => {
    if (brandParam && brandParam !== "all") {
      setSelectedBrands([brandParam]);
      setCurrentPage(1);
    } else if (brandParam === "all") {
      setSelectedBrands([]);
      setCurrentPage(1);
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

  // Filter and Sort Engine
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
    initialProducts,
    searchQuery,
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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (catalogFeedRef.current) {
      catalogFeedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedBrands.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    selectedRating !== undefined ||
    inStockOnly ||
    onSaleOnly;

  // Filter state handlers
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

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
    setSearchQuery("");
    setSelectedBrands([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedRating(undefined);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
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
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <div className="rounded-3xl bg-card p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
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

            {/* Product Cards Feed or Empty State */}
            <CatalogProductGrid
              products={displayedProducts}
              totalFilteredCount={filteredProducts.length}
              viewMode={viewMode}
              cacheKey={`${validCurrentPage}-${sortBy}-${viewMode}-${selectedBrands.join("-")}-${searchQuery}`}
              onResetFilters={handleResetAll}
            />

            {/* Thematic Pagination Controls */}
            <CatalogPagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              totalProducts={filteredProducts.length}
              startIndex={startIndex}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
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
