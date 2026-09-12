"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/types/ecommerce.types";
import { ProductCard } from "@/components/common";
import { SupportAndHelpstrip, TrustGuaranteeCards, TrendingSearchesStrip } from "@/components/shared";
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

// Stable Framer Motion variants defined outside component for zero re-render overhead
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardItemAnim: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

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
    <LazyMotion features={domAnimation}>
      <div className="space-y-10 sm:space-y-14">
        {/* ── 1. Trending Quick Subcategory Pills Reel ── */}
        <m.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="container px-3 sm:px-6"
        >
          <TrendingSearchesStrip />
        </m.div>

        {/* ── 2. Parent Group Filter Tabs (No redundancy with top search) ── */}
        <m.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          aria-label="Category Groups"
          className="container px-3 sm:px-6"
        >
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
        </m.section>

        {/* ── 3. High-Conversion Category Grid ── */}
        <section ref={gridSectionRef} aria-label="All Categories Grid" className="container px-3 sm:px-6 scroll-mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
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
                    delay: Math.min((idx % BATCH_INCREMENT) * 0.04, 0.3),
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/50"
                >
                  {/* Visual Category Cover Image / Banner */}
                  <Link
                    href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                    className="relative block h-32 sm:h-38 w-full overflow-hidden bg-muted/30"
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : null}

                    {/* Minimal Floating Category Icon */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-md text-foreground shadow-xs border border-border/50">
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
                        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight transition-colors group-hover/title:text-amber-500 line-clamp-1">
                          {cat.name}
                        </h3>
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                        {cat.itemCount} products
                      </p>
                    </div>

                    <Link
                      href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:bg-amber-500 hover:text-white py-2 sm:py-2.5 px-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 active:scale-[0.98]"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </m.div>
              );
            })}
          </div>

          {/* ── Progressive Batch "Load More" & "Show Less" Controls ── */}
          <m.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 flex flex-col items-center justify-center text-center"
          >
            {/* Minimal Elegant Progress Bar */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <div className="w-48 sm:w-56 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500 ease-out rounded-full shadow-sm shadow-amber-500/50"
                  style={{
                    width: `${(displayedCategories.length / filteredCategories.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground tracking-wide">
                Showing <span className="text-foreground font-semibold">{displayedCategories.length}</span> of{" "}
                <span className="text-foreground font-semibold">{filteredCategories.length}</span> categories
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 active:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white active:text-white px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-colors duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <span>Load More</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}

              {isExpanded && (
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors active:scale-[0.98] cursor-pointer"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Show Less</span>
                </button>
              )}
            </div>

            {!hasMore && filteredCategories.length > INITIAL_BATCH_SIZE && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80 pt-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                You have viewed all categories
              </span>
            )}
          </m.div>
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
