"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetBrandsQuery } from "@/services/api/brands/brandApi";
import { ROUTES } from "@/constants";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import {
  Search,
  X,
  ShieldCheck,
  Award,
  Package,
  Truck,
  Loader2,
  Sparkles,
} from "lucide-react";

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

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase().trim();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        (b.tagline && b.tagline.toLowerCase().includes(q))
    );
  }, [brands, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Hero Banner Section ── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-10 md:py-14 mb-6 sm:mb-8">
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
        />

        <div className="container relative z-10 px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Award className="h-3.5 w-3.5" />
              Authorized Dealers
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Official Brand Stores
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl">
              Shop from {brands.length} authorized brands with genuine Bangladesh warranty and certified dealer support.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur-xs px-3 py-1 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>100% Genuine BD Warranty</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur-xs px-3 py-1 shadow-2xs">
                <Package className="h-3.5 w-3.5 text-amber-500" />
                <span>{brands.length} Official Brands</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur-xs px-3 py-1 shadow-2xs">
                <Truck className="h-3.5 w-3.5 text-blue-500" />
                <span>24-48h Express Delivery</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <LazyMotion features={domAnimation}>
        <div className="space-y-10 sm:space-y-14">
          {/* ── Search Bar ── */}
          <section className="container px-3 sm:px-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-card border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </section>

          {/* ── Brands Grid ── */}
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
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <m.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.04 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              >
                {filteredBrands.map((brand) => (
                  <m.div key={brand.id} variants={cardVariants}>
                    <Link
                      href={ROUTES.BRAND_DETAIL(brand.slug)}
                      className="group relative flex flex-col items-center justify-between p-5 h-[180px] sm:h-[200px] rounded-3xl bg-card text-card-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center select-none"
                    >
                      {/* Ambient glow on hover */}
                      <div
                        aria-hidden="true"
                        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 bg-amber-500/20 pointer-events-none"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      />

                      {/* Brand Image or Initial */}
                      <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-background/85 group-hover:bg-background/95 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 shadow-none overflow-hidden">
                        {brand.image ? (
                          <Image
                            src={brand.image}
                            alt={brand.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl font-black text-foreground/80">
                            {brand.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Brand Details */}
                      <div className="relative z-10 w-full flex flex-col items-center gap-1 mt-auto">
                        <span className="text-sm sm:text-[15px] font-bold text-foreground group-hover:text-foreground line-clamp-1 w-full tracking-tight">
                          {brand.name}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium text-muted-foreground/80 line-clamp-1">
                          {brand.tagline || "Official Store"}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {brand.isFeaturedMarquee && (
                        <div className="absolute top-3 right-3 flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Featured</span>
                        </div>
                      )}
                    </Link>
                  </m.div>
                ))}
              </m.div>
            )}
          </section>

          {/* ── Trust & Guarantee Cards ── */}
          <m.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="container px-3 sm:px-6"
          >
            <TrustGuaranteeCards />
          </m.div>

          {/* ── Support Strip ── */}
          <m.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="container px-3 sm:px-6"
          >
            <SupportAndHelpstrip />
          </m.section>
        </div>
      </LazyMotion>
    </div>
  );
}
