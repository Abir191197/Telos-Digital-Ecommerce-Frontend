"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/types/ecommerce.types";
import { ProductCard } from "@/components/common";
import { SupportAndHelpstrip, TrustGuaranteeCards } from "@/components/shared";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
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
  Loader2,
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

const INITIAL_BATCH_SIZE = 10;
const BATCH_INCREMENT = 10;

// Stable Framer Motion variants defined outside component for zero re-render overhead
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const categoryGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const categoryCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 280,
    },
  },
};

export function CategoriesView({ categories, popularProducts }: CategoriesViewProps) {
  const mounted = useMounted();
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const clearRecentlyViewed = useRecentlyViewedStore((state) => state.clearAll);
  const recentlyViewed = mounted ? rawRecentlyViewed : [];

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const gridSectionRef = React.useRef<HTMLElement>(null);

  // Filtered categories based on selected group & search query
  const filteredCategories = useMemo(() => {
    let list = categories;

    if (selectedGroup !== "all") {
      const groupDef = CATEGORY_GROUPS.find((g) => g.id === selectedGroup);
      if (groupDef && "match" in groupDef) {
        list = list.filter((c) => (groupDef.match as readonly string[]).includes(c.slug));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [categories, selectedGroup, searchQuery]);

  // When changing group or search, reset visible batch
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleClearFilters = () => {
    setSelectedGroup("all");
    setSearchQuery("");
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  // Infinite scroll trigger sentinel ref
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sliced items for display
  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, visibleCount);
  }, [filteredCategories, visibleCount]);

  const hasMore = visibleCount < filteredCategories.length;

  // Infinite scroll trigger
  React.useEffect(() => {
    if (!hasMore) return;

    let isFetching = false;

    const handleCheck = () => {
      if (isFetching || !hasMore) return;
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const rect = sentinel.getBoundingClientRect();
      // Trigger when user scrolls to within 180px of sentinel
      if (rect.top <= window.innerHeight + 180) {
        isFetching = true;
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredCategories.length));
          setIsLoadingMore(false);
          isFetching = false;
        }, 650);
      }
    };

    window.addEventListener("scroll", handleCheck, { passive: true });
    window.addEventListener("resize", handleCheck, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleCheck);
      window.removeEventListener("resize", handleCheck);
    };
  }, [hasMore, visibleCount, filteredCategories.length]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-10 sm:space-y-14">
        {/* ── 1. Search Bar & Parent Group Filter Tabs ── */}
        <m.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          aria-label="Category Filters"
          className="container px-3 sm:px-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
            {/* Group Filter Pills */}
            <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
              {CATEGORY_GROUPS.map((group) => {
                const isActive = selectedGroup === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => handleGroupChange(group.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs",
                      isActive
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                        : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>

            {/* Instant Category Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search categories..."
                className="w-full rounded-2xl bg-card pl-4 pr-9 py-2 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3)] focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
                  aria-label="Clear category search"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-xs pointer-events-none">
                  🔍
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredCategories.length}</strong> of{" "}
              {categories.length} categories
            </span>
            {(selectedGroup !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </m.section>

        {/* ── 2. High-Conversion Category Grid ── */}
        <section ref={gridSectionRef} aria-label="All Categories Grid" className="container px-3 sm:px-6 scroll-mt-20">
          {displayedCategories.length === 0 ? (
            <div className="rounded-3xl bg-card p-10 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] max-w-md mx-auto space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No categories matched</h3>
              <p className="text-xs text-muted-foreground">
                Try searching another term or clear active filters to see all available categories.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs shadow-xs transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
              {displayedCategories.map((cat, idx) => {
                const IconComponent =
                  (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || LayoutGrid;

                return (
                  <m.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min((idx % 10) * 0.03, 0.3),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1.5"
                  >
                    {/* Visual Category Cover Image / Banner */}
                    <Link
                      href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                      className="relative block h-32 sm:h-38 w-full overflow-hidden bg-muted/20"
                    >
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                        />
                      ) : null}

                      {/* Minimal Floating Category Icon */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-background/85 backdrop-blur-md text-foreground shadow-xs">
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                      </div>
                    </Link>

                    {/* Card Body: Title + Stock Count + Action Button */}
                    <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                      <div className="mb-3">
                        <Link
                          href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                          className="block group/title"
                        >
                          <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight transition-colors group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400 line-clamp-1">
                            {cat.name}
                          </h3>
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                          {cat.itemCount} products
                        </p>
                      </div>

                      <Link
                        href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] shadow-xs"
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-400" />
                      </Link>
                    </div>
                  </m.div>
                );
              })}
            </div>
          )}

          {/* ── Loading Skeleton Preview while fetching next batch ── */}
          {isLoadingMore && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-3xl bg-muted/40 border border-border/40 overflow-hidden h-64 flex flex-col justify-between p-4"
                >
                  <div className="h-32 rounded-2xl bg-muted/70 w-full" />
                  <div className="space-y-2 mt-3">
                    <div className="h-4 bg-muted/70 rounded-md w-3/4" />
                    <div className="h-3 bg-muted/50 rounded-md w-1/3" />
                  </div>
                  <div className="h-8 rounded-xl bg-muted/60 mt-3" />
                </div>
              ))}
            </div>
          )}

          {/* ── Infinite Scroll Sentinel & Status ── */}
          <div ref={sentinelRef} className="mt-8 flex flex-col items-center justify-center text-center">
            {hasMore ? (
              <div className="flex items-center gap-2 py-3 px-5 rounded-full bg-card border border-border/70 shadow-xs text-xs font-semibold text-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Loading next categories...</span>
              </div>
            ) : filteredCategories.length > INITIAL_BATCH_SIZE ? (
              <div className="flex items-center gap-1.5 py-4 text-xs font-medium text-muted-foreground/80">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>All {filteredCategories.length} categories loaded</span>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── 4. "Most Popular Across Categories" Micro Product Rail ── */}
        {popularProducts.length > 0 && (
          <m.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            aria-label="Most Popular in Categories"
            className="container px-3 sm:px-6 pt-6"
          >
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card/90 p-5 sm:p-7 shadow-xl shadow-amber-500/5 dark:shadow-2xl dark:shadow-black/60">
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
                {popularProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </m.section>
        )}

        {/* ── 4.5. Recently Viewed Products Section ── */}
        {recentlyViewed.length > 0 && (
          <m.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            aria-label="Recently Viewed Products"
            className="container px-3 sm:px-6 pt-6"
          >
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card/90 p-5 sm:p-7 shadow-xl shadow-amber-500/5 dark:shadow-2xl dark:shadow-black/60">
              <div className="flex flex-row items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                        Recently Viewed
                      </h2>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        {recentlyViewed.length}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Pick up right where you left off in your shopping session
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {recentlyViewed.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </m.section>
        )}

        {/* ── 5. High-Density BD Trust & Guarantee Cards (Reusable Component) ── */}
        <m.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container px-3 sm:px-6"
        >
          <TrustGuaranteeCards />
        </m.div>

        {/* ── 6. Dhaka Customer Hotline & Support Strip ── */}
        <m.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container px-3 sm:px-6"
        >
          <SupportAndHelpstrip />
        </m.section>
      </div>
    </LazyMotion>
  );
}
