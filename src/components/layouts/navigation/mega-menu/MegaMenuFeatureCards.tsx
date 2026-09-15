import React from "react";
import Link from "next/link";
import { Package, LayoutGrid, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

interface MegaMenuFeatureCardsProps {
  categoryCount: number;
  onClose: () => void;
}

export function MegaMenuFeatureCards({
  categoryCount,
  onClose,
}: MegaMenuFeatureCardsProps) {
  return (
    <div className="md:col-span-3 lg:col-span-3 p-3.5 flex flex-col justify-between gap-3 bg-card">
      {/* Card 1: Explore All Products */}
      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-500/16 via-orange-500/10 to-amber-500/5 p-4 shadow-xs transition-all hover:shadow-md hover:from-amber-500/20 hover:via-orange-500/12">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/90 backdrop-blur-xs shadow-xs text-amber-500">
              <Package className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
              250+ Items
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-foreground tracking-tight">
            Explore All Products
          </h4>
          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
            Filter by price, brands, in-stock items, and certified BD warranties.
          </p>
        </div>
        <div className="pt-3">
          <Link
            href={ROUTES.PRODUCTS}
            onClick={onClose}
            className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-2 text-xs font-bold shadow-xs transition-all hover:shadow-md hover:shadow-amber-500/20 active:scale-95"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Card 2: Full Category Directory */}
      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-500/12 via-slate-500/8 to-muted/50 dark:from-indigo-500/15 dark:via-zinc-800/60 dark:to-muted/30 p-4 shadow-xs transition-all hover:shadow-md hover:from-indigo-500/16 hover:via-slate-500/12">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/90 backdrop-blur-xs shadow-xs text-indigo-500 dark:text-indigo-400">
              <LayoutGrid className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-bold">
              {categoryCount} Aisles
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-foreground tracking-tight">
            Category Directory
          </h4>
          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
            Comprehensive department directory and curated niche collections.
          </p>
        </div>
        <div className="pt-3">
          <Link
            href={ROUTES.CATEGORIES}
            onClick={onClose}
            className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 px-3 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
