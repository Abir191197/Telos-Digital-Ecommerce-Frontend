"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { useGetProductsQuery } from "@/services/api/products/productApi";

const rightGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants: Variants = {
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

export function CategorySpotlightBanner() {
  const { data: serverProducts, isLoading } = useGetProductsQuery({ limit: 30 });
  const allProducts = serverProducts?.data || [];

  // Focus on Flagship Smartphones & Tablets or top tech
  const spotlightProducts = React.useMemo(() => {
    const phones = allProducts.filter(
      (p) =>
        p.categorySlug === "smartphones-tablets" ||
        p.categoryId === "cat-smartphones" ||
        p.categoryName?.toLowerCase().includes("phone") ||
        p.categoryName?.toLowerCase().includes("smartphone") ||
        p.categoryName?.toLowerCase().includes("tablet")
    );
    return (phones.length >= 4 ? phones : allProducts).slice(0, 4);
  }, [allProducts]);

  if (spotlightProducts.length === 0 && !isLoading) return null;

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Category Spotlight" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Promo Card */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group lg:col-span-4 relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(245,158,11,0.12)] hover:-translate-y-1 hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.24)] transition-all duration-300"
          >
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="h-3 w-3" />
                Flagship Zone
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                Smartphones & Laptops
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Official warranty from Apple, Samsung, Asus and Lenovo. Fast same-day dispatch in Dhaka city.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                href={ROUTES.CATEGORY_DETAIL("smartphones-tablets")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Background decorative artwork */}
            <div
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-48 h-48 opacity-15 pointer-events-none"
            >
              <Image
                src="/images/hero/electronics.png"
                alt=""
                fill
                sizes="200px"
                className="object-contain"
              />
            </div>
          </m.div>

          {/* Right 4 Featured Products */}
          {isLoading ? (
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`spotlight-skeleton-${i}`}
                  className="rounded-3xl border border-border/50 bg-card p-2.5 flex flex-col h-[340px] justify-between"
                >
                  <div className="aspect-square w-full rounded-2xl bg-muted/60" />
                  <div className="p-2 space-y-2">
                    <div className="h-3 bg-muted/60 rounded w-1/3" />
                    <div className="h-4 bg-muted/70 rounded w-4/5" />
                    <div className="h-3 bg-muted/50 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-muted/60 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {spotlightProducts.map((product) => (
                <div key={product.id} className="transition-all duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
