"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Star, TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";
import { products } from "@/data";
import { cn } from "@/lib/utils";

export function BestSellersLeaderboard() {
  // Top 4 best sellers ranked by reviews & rating
  const topRanked = React.useMemo(() => {
    return [...products]
      .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
      .slice(0, 4);
  }, []);

  const MEDAL_STYLES = [
    { bg: "bg-amber-400 text-amber-950", label: "#1 Best Seller", border: "border-amber-400/50" },
    { bg: "bg-slate-300 text-slate-900", label: "#2 Top Choice", border: "border-slate-300/50" },
    { bg: "bg-amber-700/80 text-white", label: "#3 Rising Star", border: "border-amber-700/40" },
    { bg: "bg-muted text-foreground", label: "#4 Popular Pick", border: "border-border" },
  ];

  return (
    <section aria-label="Best Sellers Leaderboard" className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Best Sellers Leaderboard
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Trophy className="h-3 w-3" />
              Customer Top Picks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Most bought and highly-rated products across Bangladesh this week
          </p>
        </div>
      </div>

      {/* Leaderboard: 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {topRanked.map((product, idx) => {
          const medal = MEDAL_STYLES[idx] || MEDAL_STYLES[3];

          return (
            <div
              key={product.id}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                medal.border
              )}
            >
              {/* Rank Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-xs",
                    medal.bg
                  )}
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
              <div className="flex items-center gap-3 pt-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/40">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {product.brand}
                  </span>
                  <Link
                    href={`/?product=${product.slug}`}
                    className="block font-bold text-xs sm:text-sm text-foreground hover:text-amber-600 line-clamp-2 transition-colors"
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
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
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
                  href={`/?product=${product.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Buy</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
