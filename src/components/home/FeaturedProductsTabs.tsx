"use client";

import React from "react";
import Link from "next/link";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedProductsTabs() {
  const featuredProducts = React.useMemo(() => {
    return products.filter((p) => p.isFeatured).slice(0, 10);
  }, []);

  return (
    <section aria-label="Curated Products" className="w-full">
      <div className="flex items-end justify-between mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-500">
              <Sparkles className="h-3 w-3" />
              Hand-Picked Selection
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Curated Products For You
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Hand-picked selections guaranteed authentic with official Bangladesh warranty
          </p>
        </div>

        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
        </Link>
      </div>

      {/* Product Grid: 2 cols on mobile, 3 on md, 5 on xl desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

