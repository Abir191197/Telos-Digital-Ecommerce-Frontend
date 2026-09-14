"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LayoutGrid,
  Grid,
  ArrowRight,
  Package,
  Home as HomeIcon,
  Flame,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Shirt,
  Sparkles,
  Footprints,
  Sparkle,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Baby,
  Glasses,
  UtensilsCrossed,
  Dog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { categories, products } from "@/data";

// Map category icons to Lucide icons
export const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home: HomeIcon,
  Shirt,
  Sparkles,
  Footprints,
  Sparkle,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Baby,
  Glasses,
  UtensilsCrossed,
  Dog,
};

export const QUICK_CATEGORIES = [
  {
    label: "Smartphones",
    slug: "smartphones-tablets",
    href: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    icon: Smartphone,
    badge: "Hot",
  },
  {
    label: "Laptops",
    slug: "laptops-macbooks",
    href: ROUTES.CATEGORY_DETAIL("laptops-macbooks"),
    icon: Laptop,
    badge: "Popular",
  },
  {
    label: "Audio & Wearables",
    slug: "audio-headphones",
    href: ROUTES.CATEGORY_DETAIL("audio-headphones"),
    icon: Headphones,
  },
];

interface MegaMenuProps {
  pathname: string;
}

export function MegaMenu({ pathname }: MegaMenuProps) {
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState<string>(
    categories[0]?.slug || "smartphones-tablets"
  );
  const categoriesRef = useRef<HTMLDivElement>(null);

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
  }, [activeCategorySlug]);

  const activeCategoryProducts = React.useMemo(() => {
    if (!activeCategory) return [];
    return products
      .filter((p) => p.categorySlug === activeCategory.slug)
      .slice(0, 6);
  }, [activeCategory]);

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
              setActiveCategorySlug("smartphones-tablets");
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
          {categoriesOpen && (
            <div className="absolute left-0 top-full pt-2 z-50 w-[min(96vw,1200px)] animate-fade-in">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-popover/98 text-popover-foreground shadow-2xl backdrop-blur-xl transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/60">
                  {/* Left Column: Categories List with Icons & Item Counts (4 cols) */}
                  <div className="md:col-span-4 max-h-[480px] overflow-y-auto p-2.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                    <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/50 mb-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Categories ({categories.length})
                      </div>
                      <Link
                        href={ROUTES.CATEGORIES}
                        onClick={() => setCategoriesOpen(false)}
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
                          (cat.icon && CATEGORY_ICON_MAP[cat.icon]) ||
                          LayoutGrid;
                        const isActive = cat.slug === activeCategorySlug;

                        return (
                          <Link
                            key={cat.id}
                            href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                            onMouseEnter={() => setActiveCategorySlug(cat.slug)}
                            onClick={() => setCategoriesOpen(false)}
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

                  {/* Middle Column: Active Category Details, Subcategories & Products with Images */}
                  <div className="md:col-span-5 lg:col-span-5 p-5 flex flex-col justify-between bg-muted/10">
                    <div>
                      {/* Active Category Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-foreground">
                              {activeCategory?.name}
                            </h3>
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              {activeCategory?.itemCount}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {activeCategory?.description}
                          </p>
                        </div>

                        <Link
                          href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
                          onClick={() => setCategoriesOpen(false)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 text-xs font-extrabold shadow-sm shadow-amber-500/25 hover:shadow-md hover:shadow-amber-500/35 transition-all duration-200 shrink-0 group active:scale-95"
                        >
                          <span>View All</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
                        </Link>
                      </div>

                      {/* Subcategories Pills */}
                      <div className="mt-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Popular Subcategories
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCategory?.subcategories.slice(0, 6).map((sub) => (
                            <Link
                              key={sub.id}
                              href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
                              onClick={() => setCategoriesOpen(false)}
                              className="rounded-lg bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Category Products Quick Grid */}
                      <div className="mt-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Featured in {activeCategory?.name}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {activeCategoryProducts.slice(0, 4).map((prod) => (
                            <Link
                              key={prod.id}
                              href={ROUTES.PRODUCT_DETAIL(prod.slug)}
                              onClick={() => setCategoriesOpen(false)}
                              className="group flex flex-col rounded-2xl bg-card p-2 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
                            >
                              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
                                <Image
                                  src={prod.thumbnail}
                                  alt={prod.name}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 15vw"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {prod.discountPercentage && prod.discountPercentage > 0 ? (
                                  <span className="absolute top-1 left-1 rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs">
                                    -{prod.discountPercentage}%
                                  </span>
                                ) : null}
                              </div>
                              <h4 className="mt-1.5 text-xs font-semibold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                                {prod.name}
                              </h4>
                              <div className="mt-0.5 text-xs font-extrabold text-foreground">
                                ৳{prod.price.toLocaleString()}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subtle status indicator */}
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground/70">
                      <span className="text-[11px]">
                        Click any product to view specs & discounts
                      </span>
                      <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        Direct BD Stock
                      </span>
                    </div>
                  </div>

                  {/* Right Column: 2 Stacked Feature Cards */}
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
                          onClick={() => setCategoriesOpen(false)}
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
                            {categories.length} Aisles
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
                          onClick={() => setCategoriesOpen(false)}
                          className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 px-3 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
                        >
                          <span>All Categories</span>
                          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
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
