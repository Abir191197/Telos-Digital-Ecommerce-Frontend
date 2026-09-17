"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants";
import { ChevronRight, Loader2, Award, ShieldCheck, Package, Truck } from "lucide-react";
import { useGetBrandBySlugQuery, useGetBrandsQuery } from "@/services/api/brands/brandApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { ProductCard } from "@/components/common";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
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
        <div className="space-y-8 sm:space-y-12">
          {/* ── Brand Hero Banner ── */}
          <section className="container px-3 sm:px-6 pt-4">
            <m.div
              variants={heroFadeUp}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Column: Brand Info */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4 flex flex-col justify-center relative z-10">
                  {/* Meta Badge Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Award className="h-3.5 w-3.5" />
                      <span>Official Store</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Package className="h-3.5 w-3.5 text-amber-500" />
                      <span>{brandProducts.length} Products</span>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Official BD Warranty</span>
                    </div>
                  </div>

                  {/* Brand Title */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                      {brand.name}
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                      {brand.description ||
                        brand.tagline ||
                        "Shop authentic products with manufacturer authorized warranty, genuine distributor packaging, and fast delivery across Bangladesh."}
                    </p>
                  </div>

                  {/* Micro-Benefits Strip */}
                  <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Authorized Dealer</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>Dhaka 24h Express</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>7-Day Return Policy</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Brand Image */}
                {brand.image && (
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[280px] lg:min-h-[340px] w-full overflow-hidden">
                    <div className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.4)_18%,rgba(0,0,0,0.85)_38%,black_60%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.4)_18%,rgba(0,0,0,0.85)_38%,black_60%)]">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-contain object-center p-8 transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </div>
            </m.div>
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
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
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
