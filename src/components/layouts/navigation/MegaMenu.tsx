"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LayoutGrid,
  Home as HomeIcon,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useGetCategoryTreeQuery } from "@/services/api/categories/categoryApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import {
  QUICK_CATEGORIES,
  MegaMenuCategoryList,
  MegaMenuCategoryDetails,
  MegaMenuFeatureCards,
} from "./mega-menu";

// Re-export constants for external consumers
export * from "./mega-menu";

interface MegaMenuProps {
  pathname: string;
}

export function MegaMenu({ pathname }: MegaMenuProps) {
  const { data: categories = [], isLoading: catsLoading } = useGetCategoryTreeQuery();
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState<string>("");
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Set initial active slug once categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategorySlug) {
      const quickSlug = QUICK_CATEGORIES[0]?.slug;
      const match = categories.find((c) => c.slug === quickSlug);
      setActiveCategorySlug(match?.slug || categories[0].slug);
    }
  }, [categories, activeCategorySlug]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategory = React.useMemo(() => {
    return (
      categories.find((c) => c.slug === activeCategorySlug) || categories[0]
    );
  }, [categories, activeCategorySlug]);

  // Fetch products for active category
  const { data: productsResponse } = useGetProductsQuery(
    { categoryId: activeCategory?.id, limit: 6 },
    { skip: !activeCategory?.id },
  );
  const activeCategoryProducts = productsResponse?.data || [];

  return (
    <div className="hidden md:block border-t border-border/60 bg-muted/20">
      <div className="container flex h-12 items-center justify-between gap-4">
        {/* Categories & Quick Highlights Container with Seamless Hover Mega Menu */}
        <div
          ref={categoriesRef}
          className="relative flex items-center gap-1 sm:gap-2"
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          {/* Home Navigation */}
          <Link
            href={ROUTES.HOME}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted/60",
              pathname === ROUTES.HOME
                ? "font-bold text-amber-600 dark:text-amber-400 bg-muted/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HomeIcon
              className={cn(
                "h-4 w-4 shrink-0 stroke-[2.2]",
                pathname === ROUTES.HOME
                  ? "text-amber-500"
                  : "text-muted-foreground"
              )}
            />
            <span>Home</span>
          </Link>

          {/* Categories Button */}
          <button
            type="button"
            onClick={() => setCategoriesOpen((prev) => !prev)}
            onMouseEnter={() => {
              setCategoriesOpen(true);
              if (categories.length > 0) {
                const quickSlug = QUICK_CATEGORIES[0]?.slug;
                const match = categories.find((c) => c.slug === quickSlug);
                setActiveCategorySlug(match?.slug || categories[0].slug);
              }
            }}
            aria-expanded={categoriesOpen}
            className={cn(
              "flex items-center gap-2 rounded-xl bg-transparent hover:bg-muted/60 text-foreground px-3.5 py-2 text-sm font-semibold active:scale-98 focus-visible:outline-none cursor-pointer transition-all",
              categoriesOpen && "bg-muted/80 text-amber-500"
            )}
          >
            <LayoutGrid className="h-4 w-4 shrink-0 stroke-[2.2] text-amber-500" />
            <span>Categories</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200 stroke-[2.2] text-muted-foreground",
                categoriesOpen && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {/* Quick Categories with Icons */}
          <div className="hidden sm:flex items-center gap-1.5">
            {QUICK_CATEGORIES.map((cat) => {
              const isCatActive =
                categoriesOpen && activeCategorySlug === cat.slug;
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onMouseEnter={() => {
                    setActiveCategorySlug(cat.slug);
                    setCategoriesOpen(true);
                  }}
                  onClick={() => setCategoriesOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    isCatActive
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <CatIcon
                    className={cn(
                      "h-4 w-4 shrink-0 stroke-[2.2]",
                      isCatActive
                        ? "text-amber-500"
                        : "text-muted-foreground/80"
                    )}
                  />
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                        cat.badge === "Hot"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {cat.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Rich Expanded Categories Mega Menu ── */}
          {categoriesOpen && !catsLoading && categories.length > 0 && (
            <div className="absolute left-0 top-full pt-2 z-50 w-[min(96vw,1200px)] animate-fade-in">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-popover/98 text-popover-foreground shadow-2xl backdrop-blur-xl transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/60">
                  {/* Left Column: Categories List with Icons & Item Counts (4 cols) */}
                  <MegaMenuCategoryList
                    categories={categories}
                    activeCategorySlug={activeCategorySlug}
                    onSelectCategory={setActiveCategorySlug}
                    onClose={() => setCategoriesOpen(false)}
                  />

                  {/* Middle Column: Active Category Details, Subcategories & Products with Images */}
                  <MegaMenuCategoryDetails
                    activeCategory={activeCategory}
                    activeCategoryProducts={activeCategoryProducts}
                    onClose={() => setCategoriesOpen(false)}
                  />

                  {/* Right Column: 2 Stacked Feature Cards */}
                  <MegaMenuFeatureCards
                    categoryCount={categories.length}
                    onClose={() => setCategoriesOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right link in nav row */}
        <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <Link
            href={ROUTES.FLASH_DEALS}
            className="group flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
          >
            <span className="inline-flex items-center justify-center">
              <Flame className="h-4.5 w-4.5 fill-amber-500 text-amber-500 animate-flame transition-transform" />
            </span>
            <span className="group-hover:underline">Flash Deals</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
