"use client";

import React from "react";
import Link from "next/link";
import { categories } from "@/data";
import { ROUTES } from "@/constants";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Tv,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Tv,
  Home: HomeIcon,
  Shirt,
  Accessories: Sparkles,
};

export function QuickCategoryBar() {
  // Take top 8 categories
  const topCategories = categories.slice(0, 8);

  return (
    <section aria-label="Quick Categories" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore 250+ products across popular departments
          </p>
        </div>
        <Link
          href={ROUTES.CATEGORIES}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 dark:hover:text-zinc-950 shadow-xs transition-all duration-200 shrink-0 group"
        >
          <span>All Categories</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Categories Bar: Horizontal scroll on mobile with no scrollbar, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
        {topCategories.map((cat) => {
          const Icon = (cat.icon && ICON_MAP[cat.icon]) || LayoutGrid;

          return (
            <Link
              key={cat.id}
              href={ROUTES.CATEGORY_DETAIL(cat.slug)}
              className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-border/70 bg-card hover:border-amber-500/60 hover:shadow-md transition-all duration-200 min-w-[90px] sm:min-w-0 flex-shrink-0 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200 shadow-xs">
                <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground group-hover:text-amber-600 transition-colors line-clamp-1 w-full">
                {cat.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {cat.itemCount} items
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
