"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Star, TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";
import { products } from "@/data";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

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
  // Top 4 best sellers ranked by reviews & rating
  const topRanked = React.useMemo(() => {
    return [...products]
      .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
      .slice(0, 4);
  }, []);

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
        <m.div
          variants={leaderboardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
        {topRanked.map((product, idx) => {
          const medal = MEDAL_STYLES[idx] || MEDAL_STYLES[3];
          const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

          return (
            <m.div
              key={product.id}
              variants={leaderboardCardVariants}
              className="group relative flex flex-col rounded-3xl bg-card p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.65)] transition-shadow duration-300"
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

              {/* Product Visual & Details */}
              <div className="flex items-center gap-3 pt-3.5">
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

              {/* Price & Action */}
              <div className="mt-4 pt-3.5 border-t border-border/40 flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-foreground">
                    ৳{product.price.toLocaleString()}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-[11px] text-muted-foreground line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                <Link
                  href={productUrl}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Buy</span>
                </Link>
              </div>
            </m.div>
          );
        })}
      </m.div>
    </section>
  </LazyMotion>
);
}

