"use client";

import {
  BrandLogoDisplay,
  SupportAndHelpstrip,
  TrustGuaranteeCards,
} from "@/components/shared";
import { ROUTES } from "@/constants";
import { useGetBrandsQuery } from "@/services/api/brands/brandApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { Loader2, Search, BadgeCheck, Check, X } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { BrandsPageSkeleton } from "./BrandsPageSkeleton";
import { BrandSpotlightSection } from "./BrandSpotlightSection";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 260,
    },
  },
};

export function BrandsPageView() {
  const { data: brandsResponse, isLoading } = useGetBrandsQuery({
    isActive: true,
    limit: 100,
  });
  const brands = brandsResponse?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const INITIAL_BATCH = 18;
  const BATCH_INCREMENT = 12;
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const filteredBrands = useMemo(() => {
    // Sort featured marquee brands first, then alphabetically
    const list = [...brands].sort((a, b) => {
      if (a.isFeaturedMarquee && !b.isFeaturedMarquee) return -1;
      if (!a.isFeaturedMarquee && b.isFeaturedMarquee) return 1;
      return a.name.localeCompare(b.name);
    });

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.tagline && b.tagline.toLowerCase().includes(q)),
    );
  }, [brands, searchQuery]);

  // Reset pagination when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_BATCH);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setVisibleCount(INITIAL_BATCH);
  };

  const isInfiniteScrollEnabled = filteredBrands.length > INITIAL_BATCH;
  const displayedBrands = useMemo(() => {
    if (!isInfiniteScrollEnabled) return filteredBrands;
    return filteredBrands.slice(0, visibleCount);
  }, [filteredBrands, visibleCount, isInfiniteScrollEnabled]);

  const hasMore =
    isInfiniteScrollEnabled && visibleCount < filteredBrands.length;

  // Featured 3 Popular Brands (Apple, Samsung, Xiaomi)
  const appleBrand = useMemo(() => {
    return brands.find((b) => b.slug === "apple") || brands[0];
  }, [brands]);

  const samsungBrand = useMemo(() => {
    return brands.find((b) => b.slug === "samsung") || brands[1];
  }, [brands]);

  const xiaomiBrand = useMemo(() => {
    return brands.find((b) => b.slug === "xiaomi") || brands[2];
  }, [brands]);

  const { data: appleProductsRes } = useGetProductsQuery(
    appleBrand?.id ? { brandId: appleBrand.id, limit: 12 } : { limit: 12 },
    { skip: !appleBrand?.id }
  );

  const { data: samsungProductsRes } = useGetProductsQuery(
    samsungBrand?.id ? { brandId: samsungBrand.id, limit: 12 } : { limit: 12 },
    { skip: !samsungBrand?.id }
  );

  const { data: xiaomiProductsRes } = useGetProductsQuery(
    xiaomiBrand?.id ? { brandId: xiaomiBrand.id, limit: 12 } : { limit: 12 },
    { skip: !xiaomiBrand?.id }
  );

  const appleProducts = useMemo(() => appleProductsRes?.data || [], [appleProductsRes]);
  const samsungProducts = useMemo(() => samsungProductsRes?.data || [], [samsungProductsRes]);
  const xiaomiProducts = useMemo(() => xiaomiProductsRes?.data || [], [xiaomiProductsRes]);

  // IntersectionObserver for infinite scroll sentinel
  React.useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + BATCH_INCREMENT, filteredBrands.length),
            );
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredBrands.length]);

  if (isLoading) {
    return <BrandsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Compact Header & Breadcrumb ── */}
      <div className="border-b border-border/40 bg-muted/20 py-3 mb-6">
        <div className="container px-3 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href={ROUTES.HOME}
              className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground">Brands</span>
          </nav>
        </div>
      </div>

      <LazyMotion features={domAnimation}>
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* ── Page Header Bar (Title, Count & Search) ── */}
          <section className="container px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    Official Brands
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {brands.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Authorized partners with genuine Bangladesh warranty &
                  certified dealer support.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 rounded-full bg-card border border-border/60 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ── Brands Grid (First) ── */}
          <section className="container px-3 sm:px-6">
            {filteredBrands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40 mb-4">
                  <Search className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  No brands found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? `No brands match "${searchQuery}"`
                    : "No brands available"}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <m.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {displayedBrands.map((brand) => (
                  <m.div key={brand.id} variants={cardVariants}>
                    <Link
                      href={ROUTES.BRAND_DETAIL(brand.slug)}
                      className="group relative flex flex-col items-center justify-between p-4 sm:p-5 h-[190px] sm:h-[210px] rounded-3xl bg-card text-card-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center select-none">
                      {/* Ambient glow on hover */}
                      <div
                        aria-hidden="true"
                        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-amber-500/20 pointer-events-none"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      />

                      {/* Brand Logo Display - Perfectly Centered in upper card body */}
                      <div className="relative z-10 flex-1 w-full flex items-center justify-center text-foreground/85 group-hover:text-foreground transition-colors duration-200 py-1">
                        <BrandLogoDisplay
                          name={brand.name}
                          slug={brand.slug}
                          image={brand.image}
                          className="h-10 sm:h-11 max-w-[125px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Brand Details */}
                      <div className="relative z-10 w-full flex flex-col items-center gap-1 shrink-0 pb-0.5">
                        <span className="text-sm sm:text-[15px] font-bold text-foreground group-hover:text-foreground line-clamp-1 w-full tracking-tight">
                          {brand.name}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground/80 line-clamp-1">
                          {brand.tagline || "Official Store"}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {brand.isFeaturedMarquee && (
                        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 backdrop-blur-xs whitespace-nowrap shadow-2xs">
                          <BadgeCheck className="h-2.5 w-2.5 shrink-0" />
                          <span>Featured</span>
                        </div>
                      )}
                    </Link>
                  </m.div>
                ))}
              </m.div>

              {/* Infinite Scroll Sentinel & Loader */}
              {isInfiniteScrollEnabled && (
                <div
                  ref={sentinelRef}
                  className="mt-8 flex flex-col items-center justify-center text-center">
                  {hasMore ? (
                    <div className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-card border border-border/70 shadow-2xs text-xs font-medium text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                      <span>Loading more brands...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 py-4 text-xs font-medium text-muted-foreground/70">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>
                        All {filteredBrands.length} brands displayed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Featured Brand Showcases (Apple, Samsung, Xiaomi) ── */}
        {!searchQuery.trim() && (
          <m.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="container px-3 sm:px-6 space-y-12 sm:space-y-16">
            {appleBrand && appleProducts.length > 0 && (
              <BrandSpotlightSection brand={appleBrand} products={appleProducts} />
            )}
            {samsungBrand && samsungProducts.length > 0 && (
              <BrandSpotlightSection brand={samsungBrand} products={samsungProducts} />
            )}
            {xiaomiBrand && xiaomiProducts.length > 0 && (
              <BrandSpotlightSection brand={xiaomiBrand} products={xiaomiProducts} />
            )}
          </m.div>
        )}

          {/* ── Trust & Guarantee Cards ── */}
          <m.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="container px-3 sm:px-6">
            <TrustGuaranteeCards />
          </m.div>

          {/* ── Support Strip ── */}
          <m.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="container px-3 sm:px-6">
            <SupportAndHelpstrip />
          </m.section>
        </div>
      </LazyMotion>
    </div>
  );
}
