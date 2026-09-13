"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { ProductCard } from "@/components/common";
import type { Product } from "@/types/ecommerce.types";

interface RelatedProductsProps {
  categorySlug: string;
  relatedProducts: Product[];
  sectionFadeUp: Variants;
}

export function RelatedProducts({
  categorySlug,
  relatedProducts,
  sectionFadeUp,
}: RelatedProductsProps) {
  if (relatedProducts.length === 0) return null;

  return (
    <m.section
      variants={sectionFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-14 pt-10 border-t border-border/70 space-y-6"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            More In This Category
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Customers Also Viewed
          </h2>
        </div>
        <Link
          href={ROUTES.CATEGORY_DETAIL(categorySlug)}
          className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 px-4 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-amber-500/20 active:scale-95"
        >
          <span>View All</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {relatedProducts.slice(0, 5).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </m.section>
  );
}
