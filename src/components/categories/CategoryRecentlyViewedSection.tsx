"use client";

import React from "react";
import { History } from "lucide-react";
import { m } from "framer-motion";
import { ProductCard } from "@/components/common";
import type { Product } from "@/types/ecommerce.types";
import { fadeInUp } from "./categoryConfig";

interface CategoryRecentlyViewedSectionProps {
  products: Product[];
}

export function CategoryRecentlyViewedSection({
  products,
}: CategoryRecentlyViewedSectionProps) {
  if (products.length === 0) return null;

  return (
    <m.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      aria-label="Recently Viewed Products"
      className="container px-3 sm:px-6 pt-6"
    >
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card/90 p-3 sm:p-7 shadow-xl shadow-amber-500/5 dark:shadow-2xl dark:shadow-black/60">
        <div className="flex flex-row items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-2xl font-black tracking-tight text-foreground">
                  Recently Viewed
                </h2>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  {products.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Pick up right where you left off in your shopping session
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </m.section>
  );
}
