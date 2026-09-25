"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";
import { m } from "framer-motion";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/ecommerce.types";
import { fadeInUp } from "./categoryConfig";

interface CategoryPopularSectionProps {
  products: Product[];
}

export function CategoryPopularSection({
  products,
}: CategoryPopularSectionProps) {
  if (products.length === 0) return null;

  return (
    <m.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      aria-label="Most Popular in Categories"
      className="container px-3 sm:px-6 pt-6"
    >
      <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card/90 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Top Rated Pick
            </span>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Highest Rated in Our Catalog
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
              Customer favorites verified with 100% genuine BD warranty
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="group inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 active:scale-95"
          >
            <span>View All Products</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </m.section>
  );
}
