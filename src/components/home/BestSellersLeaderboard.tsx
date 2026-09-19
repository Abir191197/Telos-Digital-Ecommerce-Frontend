"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Star, TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { useGetProductsQuery } from "@/services/api/products/productApi";

const leaderboardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const leaderboardCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
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

export function BestSellersLeaderboard() {
  const { data: serverProducts, isLoading } = useGetProductsQuery({ limit: 40 });
  const allProducts = serverProducts?.data || [];

  // Top 4 best sellers ranked by reviews & rating
  const topRanked = React.useMemo(() => {
    return [...allProducts]
      .sort((a, b) => (b.reviewCount || 0) * (b.rating || 0) - (a.reviewCount || 0) * (a.rating || 0))
      .slice(0, 4);
  }, [allProducts]);

  if (topRanked.length === 0 && !isLoading) return null;

  const MEDAL_STYLES = [
    { bg: "bg-amber-400 text-amber-950", label: "#1 Best Seller" },
    { bg: "bg-slate-300 text-slate-900", label: "#2 Top Choice" },
    { bg: "bg-amber-700/80 text-white", label: "#3 Rising Star" },
    { bg: "bg-muted text-foreground", label: "#4 Popular Pick" },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Best Sellers Leaderboard" className="w-full">
        <m.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-5 sm:mb-6"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                <Trophy className="h-3 w-3" />
                Customer Top Picks
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Best Sellers Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Most bought and highly-rated products across Bangladesh this week
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
          </Link>
        </m.div>

        {/* Leaderboard: 2 cols on mobile, 4 cols on desktop */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`bestseller-skeleton-${i}`}
                className="rounded-3xl bg-card p-4 sm:p-5 border border-border/50 h-52 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 rounded-full bg-muted/60" />
                  <div className="h-4 w-16 rounded bg-muted/40" />
                </div>
                <div className="flex gap-3 items-center">
                  <div className="h-20 w-20 rounded-2xl bg-muted/60 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-12 rounded bg-muted/50" />
                    <div className="h-4 w-full rounded bg-muted/70" />
                    <div className="h-3 w-20 rounded bg-muted/50" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-20 rounded bg-muted/70" />
                  <div className="h-7 w-16 rounded-full bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {topRanked.map((product, idx) => {
              const medal = MEDAL_STYLES[idx] || MEDAL_STYLES[3];
              const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-3xl bg-card p-4 sm:p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5),0_6px_10px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.12),0_10px_15px_-6px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_22px_40px_-8px_rgba(0,0,0,0.7),0_10px_20px_-6px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 select-none"
                >
                  {/* Rank Header Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/40">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-xs ${medal.bg}`}
                    >
                      <Trophy className="h-3 w-3" />
                      {medal.label}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      {product.reviewCount * 7}+ sold
                    </span>
                  </div>

                  {/* Product Visual & Details - flex-1 for consistent height */}
                  <div className="flex items-center gap-3 pt-3.5 flex-1">
                    <Link href={productUrl} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted/40 block">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {product.brand}
                      </span>
                      <Link
                        href={productUrl}
                        className="block font-bold text-xs sm:text-sm text-foreground hover:text-amber-600 line-clamp-2 transition-colors mt-0.5"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-foreground">{product.rating}</span>
                        <span className="text-muted-foreground text-[11px]">({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action - anchored cleanly to bottom with mt-auto */}
                  <div className="mt-auto pt-3.5 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-foreground">
                        ৳{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <div className="text-[11px] text-muted-foreground line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Best price
                        </div>
                      )}
                    </div>

                    <Link
                      href={productUrl}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Buy</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
  </LazyMotion>
);
}

