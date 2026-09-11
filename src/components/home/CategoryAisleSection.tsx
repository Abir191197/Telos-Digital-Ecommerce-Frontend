"use client";

import React from "react";
import Link from "next/link";
import { products, categories } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryAisleSectionProps {
  categorySlug: string;
  badge?: string;
  badgeColor?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function CategoryAisleSection({
  categorySlug,
  badge = "Featured Aisle",
  badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20",
  title,
  subtitle,
  limit = 5,
}: CategoryAisleSectionProps) {
  const category = categories.find((c) => c.slug === categorySlug);

  const aisleProducts = React.useMemo(() => {
    return products
      .filter((p) => p.categorySlug === categorySlug)
      .slice(0, limit);
  }, [categorySlug, limit]);

  if (!category || aisleProducts.length === 0) return null;

  const displayTitle = title || category.name;
  const displaySubtitle = subtitle || category.description;

  return (
    <section aria-label={`${displayTitle} Aisle`} className="w-full">
      {/* Header with Title, Subcategory Quick Pills, and View All Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                badgeColor
              )}
            >
              <Sparkles className="h-3 w-3" />
              {badge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {displayTitle}
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1 max-w-2xl">
            {displaySubtitle}
          </p>
        </div>

        {/* Right subcategory quick pills & view all button */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {category.subcategories.slice(0, 3).map((sub) => (
            <Link
              key={sub.id}
              href={ROUTES.CATEGORY_DETAIL(category.slug)}
              className="hidden md:inline-flex rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              {sub.name}
            </Link>
          ))}

          <Link
            href={ROUTES.CATEGORY_DETAIL(category.slug)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 dark:hover:text-zinc-950 shadow-xs transition-all duration-200 shrink-0 group"
          >
            <span>View All ({category.itemCount})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Product Cards Grid: 2 cols on mobile, 3 on md, 5 cols on xl desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {aisleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
