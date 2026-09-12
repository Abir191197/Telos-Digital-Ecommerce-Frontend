"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category, Product } from "@/types/ecommerce.types";
import { CatalogView } from "@/components/catalog";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
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
  ChevronRight,
  Package,
  Layers,
  CheckCircle2,
  Sparkles as SparklesIcon,
  Compass,
  ArrowUpRight,
} from "lucide-react";

interface CategoryDetailViewProps {
  category: Category;
  initialProducts: Product[];
  sisterCategories?: Category[];
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

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function CategoryDetailView({
  category,
  initialProducts,
  sisterCategories = [],
}: CategoryDetailViewProps) {
  const IconComponent = (category.icon && CATEGORY_ICON_MAP[category.icon]) || LayoutGrid;
  const subcategories = category.subcategories || [];

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8 sm:space-y-12">
        {/* ── 1. Thematic Hero Header Banner (Hidden on mobile, visible on sm+ screens) ── */}
        <section className="hidden sm:block container px-3 sm:px-6 pt-4">
          <m.div
            variants={heroFadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] bg-card border border-border/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Editorial Information & Meta */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4 flex flex-col justify-center relative z-10">
                {/* Meta Badge Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>Official Category</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    <Package className="h-3.5 w-3.5 text-amber-500" />
                    <span>{category.itemCount || initialProducts.length} Verified Items</span>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Official BD Warranty</span>
                  </div>
                </div>

                {/* Primary Category Title */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                    {category.name}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                    {category.description ||
                      "Browse our verified catalog with manufacturer authorized warranty, authentic distributor packaging, and fast delivery across Bangladesh."}
                  </p>
                </div>

                {/* Micro-Benefits Guarantee Strip */}
                <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>In-Stock Ready to Ship</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Dhaka 24h Express</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>7-Day Return Policy</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Expanded Hero Image with True Feathered Alpha Mask Blend */}
              {category.image && (
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[280px] lg:min-h-[340px] w-full overflow-hidden">
                  <div
                    className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.4)_18%,rgba(0,0,0,0.85)_38%,black_60%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.4)_18%,rgba(0,0,0,0.85)_38%,black_60%)]"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </section>

        {/* ── 2. Embedded Catalog View (Filters + Sort + Products Grid) ── */}
        <section aria-label={`${category.name} Products Feed`}>
          <CatalogView
            initialProducts={initialProducts}
            category={category}
            showSupportStrip={false}
            showHeader={false}
            title={`${category.name} Catalog`}
            subtitle={category.description}
          />
        </section>

        {/* ── 4. BD Trust & Guarantee Strip ── */}
        <section className="container px-3 sm:px-6">
          <TrustGuaranteeCards />
        </section>

        {/* ── 5. Sister Aisles / Related Categories Strip (Rich Visual Redesign) ── */}
        {sisterCategories.length > 0 && (
          <section className="container px-3 sm:px-6">
            <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      Explore Other Aisles
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Discover companion gear, certified tech ecosystems, and official lifestyle categories.
                    </p>
                  </div>
                </div>

                <Link
                  href={ROUTES.CATEGORIES}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 px-3.5 py-1.5 text-xs font-bold text-muted-foreground transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <span>Browse All 25 Categories</span>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                </Link>
              </div>

              {/* Rich Visual Cards Grid with Real Imagery & Ambient Hover Depth */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {sisterCategories.map((sister) => {
                  const SisterIcon =
                    (sister.icon && CATEGORY_ICON_MAP[sister.icon]) || LayoutGrid;

                  return (
                    <Link
                      key={sister.id}
                      href={ROUTES.CATEGORY_DETAIL(sister.slug)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-muted/20 hover:bg-card border border-border/40 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1.5 shadow-2xs hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.7)]"
                    >
                      {/* Image Thumbnail Container with Gradient Mask */}
                      <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-muted/40">
                        {sister.image ? (
                          <Image
                            src={sister.image}
                            alt={sister.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Top-Right Arrow Micro-badge */}
                        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white/80 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>

                        {/* Floating Icon Over Image */}
                        <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-xl bg-background/90 backdrop-blur-md text-amber-500 shadow-xs group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                          <SisterIcon className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="p-3">
                        <span className="block text-xs font-black text-foreground line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {sister.name}
                        </span>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                          <span>{sister.itemCount} items</span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Bottom Support & Dhaka Hotline CTA (Placed below All Strips) ── */}
        <section className="container px-3 sm:px-6 pt-2">
          <SupportAndHelpstrip />
        </section>
      </div>
    </LazyMotion>
  );
}
