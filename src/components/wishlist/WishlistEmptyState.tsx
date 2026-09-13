"use client";

import React from "react";
import Link from "next/link";
import { Heart, Sparkles, ShoppingCart, Flame, ChevronRight } from "lucide-react";
import { m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { ProductCard } from "@/components/common";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import type { Product } from "@/types/ecommerce.types";

interface WishlistEmptyStateProps {
  trendingRecommendations: Product[];
  fadeUpAnim: Variants;
}

export function WishlistEmptyState({
  trendingRecommendations,
  fadeUpAnim,
}: WishlistEmptyStateProps) {
  return (
    <div className="container py-12 sm:py-16 space-y-12">
      {/* Empty Hero Card */}
      <m.div
        variants={fadeUpAnim}
        initial="hidden"
        animate="visible"
        className="rounded-3xl sm:rounded-[2.5rem] bg-card border border-border/60 p-8 sm:p-14 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] max-w-2xl mx-auto space-y-6"
      >
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="h-10 w-10 sm:h-12 sm:w-12 fill-rose-500/20 text-rose-500" />
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Save gadgets, smartphones, laptops, and accessories to track official Bangladesh pricing, stock levels, and discount deals.
          </p>
        </div>

        {/* Quick Category Discovery Pills */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Explore Popular Aisles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Smartphones", slug: "smartphones-tablets" },
              { label: "Laptops & MacBooks", slug: "laptops-macbooks" },
              { label: "Audio & Headphones", slug: "audio-headphones" },
              { label: "Gaming Gear", slug: "gaming-gear-consoles" },
            ].map((aisle) => (
              <Link
                key={aisle.slug}
                href={ROUTES.CATEGORY_DETAIL(aisle.slug)}
                className="rounded-full bg-muted/60 hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
              >
                {aisle.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Explore Full Catalog</span>
          </Link>
        </div>
      </m.div>

      {/* Trending Deals Rail */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              <span>Trending BD Official Deals</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Most saved tech gear this week with manufacturer warranty.
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {trendingRecommendations.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* BD Trust & Support Strips */}
      <section className="pt-4">
        <TrustGuaranteeCards />
      </section>
      <section className="pt-2">
        <SupportAndHelpstrip />
      </section>
    </div>
  );
}
