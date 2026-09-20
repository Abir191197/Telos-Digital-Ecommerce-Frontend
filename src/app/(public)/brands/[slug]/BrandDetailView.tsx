"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants";
import { ChevronRight, Award, ShieldCheck, Package, Sparkles } from "lucide-react";
import { useGetBrandBySlugQuery, useGetBrandsQuery } from "@/services/api/brands/brandApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { ProductCard } from "@/components/common";
import { TrustGuaranteeCards, SupportAndHelpstrip, BrandLogoDisplay } from "@/components/shared";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { BrandDetailSkeleton } from "./BrandDetailSkeleton";

interface Props {
  params: Promise<{ slug: string }>;
}

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 280,
    },
  },
};

export function BrandDetailView({ params }: Props) {
  const { slug } = use(params);
  const { data: brand, isLoading: brandLoading } = useGetBrandBySlugQuery(slug);
  const { data: productsResponse, isLoading: prodsLoading } = useGetProductsQuery(
    { brandId: brand?.id },
    { skip: !brand?.id }
  );
  const { data: otherBrandsResponse } = useGetBrandsQuery({
    isActive: true,
    limit: 12,
  });

  const brandProducts = productsResponse?.data || [];
  const otherBrands = (otherBrandsResponse?.data || []).filter(
    (b) => b.slug !== slug
  ).slice(0, 6);

  if (brandLoading || !brand) {
    return <BrandDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-border/40 bg-muted/20 py-3 mb-6">
        <div className="container px-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <Link href={ROUTES.BRANDS} className="hover:text-foreground transition-colors">
              Brands
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="font-semibold text-foreground truncate">{brand.name}</span>
          </nav>
        </div>
      </div>

      <LazyMotion features={domAnimation}>
        <div className="space-y-8 sm:space-y-10">
          {/* ── Compact Brand Header Bar ── */}
          <section className="container px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                {/* Brand Logo Capsule */}
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-xs p-2">
                  <BrandLogoDisplay
                    name={brand.name}
                    slug={brand.slug}
                    image={brand.image}
                    className="h-8 sm:h-9 max-w-[60px] object-contain"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {brand.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Award className="h-3 w-3" />
                      <span>Official Store</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Official BD Warranty</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {brand.description ||
                      brand.tagline ||
                      "Authorized dealer products with genuine distributor packaging and warranty."}
                  </p>
                </div>
              </div>

              {/* Product Count Pill */}
              <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-muted/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-amber-500" />
                <span>{brandProducts.length} Products</span>
              </div>
            </div>
          </section>


          {/* ── Brand Products Grid ── */}
          <section className="container px-3 sm:px-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {brand.name} Products
              </h2>
              <span className="text-sm text-muted-foreground">
                {brandProducts.length} {brandProducts.length === 1 ? "item" : "items"}
              </span>
            </div>

            {prodsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden"
                  >
                    <div className="aspect-square w-full bg-muted/60" />
                    <div className="p-4 space-y-2.5">
                      <div className="h-3 w-16 rounded bg-muted/60" />
                      <div className="h-4 w-full rounded bg-muted/70" />
                      <div className="h-3 w-20 rounded bg-muted/50" />
                      <div className="pt-2 flex items-center justify-between">
                        <div className="h-5 w-20 rounded bg-amber-500/20" />
                        <div className="h-8 w-8 rounded-xl bg-muted/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : brandProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40 mb-4">
                  <Package className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  No products yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Products for this brand are coming soon.
                </p>
              </div>
            ) : (
              <m.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
              >
                {brandProducts.map((product) => (
                  <m.div key={product.id} variants={cardVariants}>
                    <ProductCard product={product} />
                  </m.div>
                ))}
              </m.div>
            )}
          </section>

          {/* ── Trust & Guarantee Cards ── */}
          <section className="container px-3 sm:px-6">
            <TrustGuaranteeCards />
          </section>

          {/* ── Explore Other Brands ── */}
          {otherBrands.length > 0 && (
            <section className="container px-3 sm:px-6">
              <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      Explore Other Brands
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Discover more official brand stores with authorized warranty.
                    </p>
                  </div>

                  <Link
                    href={ROUTES.BRANDS}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 text-xs font-bold text-muted-foreground transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
                  >
                    <span>View All Brands</span>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {otherBrands.map((otherBrand) => (
                    <Link
                      key={otherBrand.id}
                      href={ROUTES.BRAND_DETAIL(otherBrand.slug)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-muted/20 hover:bg-card border border-border/40 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1.5 shadow-2xs hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.7)] p-4"
                    >
                      {/* Brand Image */}
                      <div className="relative h-16 sm:h-20 w-full flex items-center justify-center overflow-hidden mb-3">
                        {otherBrand.image ? (
                          <Image
                            src={otherBrand.image}
                            alt={otherBrand.name}
                            width={80}
                            height={80}
                            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-3xl font-black text-foreground/60">
                            {otherBrand.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Brand Info */}
                      <div>
                        <span className="block text-xs font-black text-foreground line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {otherBrand.name}
                        </span>
                        <span className="block text-[11px] text-muted-foreground font-medium mt-0.5 line-clamp-1">
                          {otherBrand.tagline || "Official Store"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Support Strip ── */}
          <section className="container px-3 sm:px-6 pt-2">
            <SupportAndHelpstrip />
          </section>
        </div>
      </LazyMotion>
    </div>
  );
}
