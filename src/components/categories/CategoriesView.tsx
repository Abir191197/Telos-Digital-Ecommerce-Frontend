"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/types/ecommerce.types";
import { ProductCard } from "@/components/common";
import { SupportAndHelpstrip } from "@/components/shared";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home as HomeIcon,
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
  LayoutGrid,
  ArrowRight,
  TrendingUp,
  Tag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Plus,
  CheckCircle2,
  Flame,
  History,
  Trash2,
} from "lucide-react";
import { useRecentlyViewedStore } from "@/stores";
import { useMounted } from "@/hooks";

interface CategoriesViewProps {
  categories: Category[];
  popularProducts: Product[];
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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

// Parent cluster groups for high-level pill filters
const CATEGORY_GROUPS = [
  { id: "all", label: "All Categories" },
  { id: "tech", label: "Tech & Devices", match: ["smartphones-tablets", "laptops-macbooks", "pc-components", "cameras-optics"] },
  { id: "audio-gaming", label: "Audio & Gaming", match: ["audio-headphones", "gaming-consoles", "wearables-smartwatches", "smart-home-iot"] },
  { id: "home-office", label: "Office & Home", match: ["networking-wifi", "printers-scanners", "home-appliances", "kitchen-dining"] },
  { id: "lifestyle", label: "Fashion & Lifestyle", match: ["mens-fashion", "womens-fashion", "sports-fitness", "watches-jewellery", "beauty-personal-care", "footwear", "eyewear-sunglasses"] },
] as const;

// Trending subcategory quick bubbles
const TRENDING_SUBCATS = [
  { name: "iPhone 16 Pro", slug: "smartphones-tablets", tag: "Flagship" },
  { name: "M3 MacBooks", slug: "laptops-macbooks", tag: "Hot" },
  { name: "Noise Cancelling", slug: "audio-headphones", tag: "Popular" },
  { name: "RTX 40-Series", slug: "pc-components", tag: "Gaming" },
  { name: "Smart Bands", slug: "wearables-smartwatches", tag: "Trending" },
  { name: "Mechanical Keyboards", slug: "gaming-consoles", tag: "Gear" },
  { name: "WiFi 6 Routers", slug: "networking-wifi", tag: "New" },
];

const INITIAL_BATCH_SIZE = 10;
const BATCH_INCREMENT = 10;

export function CategoriesView({ categories, popularProducts }: CategoriesViewProps) {
  const mounted = useMounted();
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const clearRecentlyViewed = useRecentlyViewedStore((state) => state.clearAll);
  const recentlyViewed = mounted ? rawRecentlyViewed : [];

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const gridSectionRef = React.useRef<HTMLElement>(null);

  // Filtered categories based on selected group
  const filteredCategories = useMemo(() => {
    if (selectedGroup === "all") return categories;
    const groupDef = CATEGORY_GROUPS.find((g) => g.id === selectedGroup);
    if (!groupDef || !("match" in groupDef)) return categories;
    return categories.filter((c) => (groupDef.match as readonly string[]).includes(c.slug));
  }, [categories, selectedGroup]);

  // When changing group, reset visible batch
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  // Sliced items for display
  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, visibleCount);
  }, [filteredCategories, visibleCount]);

  const hasMore = visibleCount < filteredCategories.length;
  const isExpanded = visibleCount > INITIAL_BATCH_SIZE;
  const remainingCount = Math.max(0, filteredCategories.length - visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredCategories.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_BATCH_SIZE);
    // Smooth scroll back to top of category grid
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalProducts = useMemo(
    () => categories.reduce((sum, c) => sum + (c.itemCount || 0), 0),
    [categories]
  );

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ── 1. Trending Quick Subcategory Pills Reel ── */}
      <section aria-label="Trending Subcategories" className="container px-3 sm:px-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
            <Flame className="h-3 w-3" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Trending Searches & Aisles
          </h2>
        </div>

        <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
          {TRENDING_SUBCATS.map((item) => (
            <Link
              key={item.name}
              href={ROUTES.CATEGORY_DETAIL(item.slug)}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-all duration-200 hover:border-amber-500/70 hover:bg-amber-500/5 hover:text-amber-600"
            >
              <Tag className="h-3 w-3 text-muted-foreground group-hover:text-amber-500" />
              <span>{item.name}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.2 text-[9px] font-bold text-muted-foreground group-hover:bg-amber-500/20 group-hover:text-amber-700">
                {item.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 2. Parent Group Filter Tabs (No redundancy with top search) ── */}
      <section aria-label="Category Groups" className="container px-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            {CATEGORY_GROUPS.map((group) => {
              const isActive = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => handleGroupChange(group.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground whitespace-nowrap">
            Showing <strong className="text-foreground">{filteredCategories.length}</strong> of {categories.length}
          </span>
        </div>
      </section>

      {/* ── 3. High-Conversion Category Grid with Subcategory Preview ── */}
      <section ref={gridSectionRef} aria-label="All Categories Grid" className="container px-3 sm:px-6 scroll-mt-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {displayedCategories.map((cat) => {
            const IconComponent =
              (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || LayoutGrid;

            return (
              <div
                key={cat.id}
                className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5"
              >
                {/* Visual Category Cover Image */}
                <Link
                  href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                  className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-muted/40 block"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Floating Category Icon & Item Count Badge */}
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-background/90 backdrop-blur-md text-amber-500 shadow-sm">
                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>

                  <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white">
                    {cat.itemCount} items
                  </span>

                  {/* Overlay Title on bottom of image */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3">
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-md truncate">
                      {cat.name}
                    </h3>
                  </div>
                </Link>

                {/* Card Body with direct Subcategory quick links */}
                <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                  <div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-snug">
                      {cat.description}
                    </p>

                    {/* Subcategories preview tags */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <Link
                          key={sub.id}
                          href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                          className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition-colors truncate max-w-full"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          +{cat.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <Link
                    href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                    className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    <span>Explore Aisle</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Progressive Batch "Load More" & "Show Less" Controls ── */}
        <div className="mt-8 flex flex-col items-center justify-center text-center space-y-3">
          {/* Progress line */}
          <div className="w-48 sm:w-64 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              style={{
                width: `${(displayedCategories.length / filteredCategories.length) * 100}%`,
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{displayedCategories.length}</span> of{" "}
            <span className="font-bold text-foreground">{filteredCategories.length}</span> categories
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 rounded-xl bg-card border border-border/90 hover:border-amber-500/70 hover:bg-amber-500/5 px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-amber-500" />
                <span>Load More (+{remainingCount > BATCH_INCREMENT ? BATCH_INCREMENT : remainingCount})</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {isExpanded && (
              <button
                onClick={handleShowLess}
                className="inline-flex items-center gap-2 rounded-xl bg-muted/60 border border-border/70 hover:bg-muted hover:text-foreground px-4 py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ChevronUp className="h-4 w-4 text-amber-500" />
                <span>Show Less (Top 10)</span>
                <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {!hasMore && filteredCategories.length > INITIAL_BATCH_SIZE && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                All {filteredCategories.length} categories loaded
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. "Most Popular Across Categories" Micro Product Rail ── */}
      {popularProducts.length > 0 && (
        <section aria-label="Most Popular in Categories" className="container px-3 sm:px-6 pt-4">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-card p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Top Rated Pick
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                  Highest Rated in Our Catalog
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Customer favorites verified with 100% genuine BD warranty
                </p>
              </div>

              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:underline"
              >
                <span>View All Products</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {popularProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4.5. Recently Viewed Products Section ── */}
      {recentlyViewed.length > 0 && (
        <section aria-label="Recently Viewed Products" className="container px-3 sm:px-6 pt-6">
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/40 via-card to-card p-4 sm:p-6 shadow-xs">
            <div className="flex flex-row items-center justify-between gap-3 mb-5 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <History className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                      Recently Viewed
                    </h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {recentlyViewed.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Pick up right where you left off in your shopping session
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearRecentlyViewed}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-rose-500/10"
                title="Clear recently viewed history"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {recentlyViewed.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. High-Density BD Trust & Guarantee Cards (2-Col, No Empty Space) ── */}
      <section aria-label="Authenticity & Service Guarantees" className="container px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Genuine & Warranty */}
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/8 via-card to-card p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  100% Genuine BD Warranty
                </h3>
                <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Official Importer
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Direct authorized regional inventory with verified IMEI/serial tracking, sealed factory packages, and official brand service center coverage.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Original Box & Seal</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Official Invoicing</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">1-2 Yr Service</span>
              </div>
            </div>
          </div>

          {/* Card 2: Express Delivery */}
          <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/8 via-card to-card p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  Express 24-48h Dispatch
                </h3>
                <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  Dhaka Metro Fast
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Same-day dispatch for orders placed before 2 PM. Real-time SMS tracking updates and safe tamper-evident transit packaging.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Dhaka: 24h</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Nationwide: 48-72h</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Cash On Delivery</span>
              </div>
            </div>
          </div>

          {/* Card 3: 7 Days Return */}
          <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/8 via-card to-card p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  7-Day Hassle-Free Return
                </h3>
                <span className="shrink-0 rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  Zero Risk
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Found manufacturing defect or wrong item received? Doorstep reverse pickup arranged within 48 hours without friction.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Doorstep Pickup</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Instant Replacement</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">bKash/Bank Refund</span>
              </div>
            </div>
          </div>

          {/* Card 4: Dedicated BD Support */}
          <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-500/8 via-card to-card p-4 sm:p-5 shadow-2xs flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white shadow-xs">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  Dedicated Tech Consultants
                </h3>
                <span className="shrink-0 rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                  Dhaka Team
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Direct phone and WhatsApp technical consultations. We help you choose the right model before purchasing and assist after setup.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Real Humans</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">WhatsApp Direct</span>
                <span className="rounded bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">9 AM – 10 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Dhaka Customer Hotline & Support Strip ── */}
      <section className="container px-3 sm:px-6">
        <SupportAndHelpstrip />
      </section>
    </div>
  );
}
