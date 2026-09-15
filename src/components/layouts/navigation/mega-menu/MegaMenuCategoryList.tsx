import React from "react";
import Link from "next/link";
import { Grid, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { Category } from "@/types/ecommerce.types";
import { CATEGORY_ICON_MAP } from "./megaMenuConfig";

interface MegaMenuCategoryListProps {
  categories: Category[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  onClose: () => void;
}

export function MegaMenuCategoryList({
  categories,
  activeCategorySlug,
  onSelectCategory,
  onClose,
}: MegaMenuCategoryListProps) {
  return (
    <div className="md:col-span-4 max-h-[480px] overflow-y-auto p-2.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/50 mb-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Categories ({categories.length})
        </div>
        <Link
          href={ROUTES.CATEGORIES}
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1 text-[11px] font-extrabold shadow-sm shadow-amber-500/25 hover:shadow-md hover:shadow-amber-500/35 transition-all duration-200 group active:scale-95"
        >
          <Grid className="h-3 w-3 stroke-[2.5]" />
          <span>View All</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
        </Link>
      </div>
      <div className="space-y-1 mt-1">
        {categories.map((cat) => {
          const IconComponent =
            (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || LayoutGrid;
          const isActive = cat.slug === activeCategorySlug;

          return (
            <Link
              key={cat.id}
              href={ROUTES.CATEGORY_DETAIL(cat.slug)}
              onMouseEnter={() => onSelectCategory(cat.slug)}
              onClick={onClose}
              className={cn(
                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all",
                isActive
                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                  : "text-foreground hover:bg-muted/70"
              )}
            >
              <span className="flex items-center gap-2.5 truncate">
                <IconComponent
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-amber-500 group-hover:scale-110"
                  )}
                />
                <span className="truncate">{cat.name}</span>
              </span>
              <span
                className={cn(
                  "ml-2 text-xs font-medium rounded-full px-1.5 py-0.5 shrink-0",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                {cat.itemCount}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
