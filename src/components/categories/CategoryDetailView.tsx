"use client";

import React from "react";
import Link from "next/link";
import { Category, Product } from "@/types/ecommerce.types";
import { CatalogView } from "@/components/catalog";
import { TrustGuaranteeCards, SupportAndHelpstrip } from "@/components/shared";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation } from "framer-motion";
import {
  ChevronRight,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { useRecentlyViewedStore } from "@/stores";
import { useMounted } from "@/hooks";
import { getCategoryIcon } from "./categoryConfig";
import { CategoryRecentlyViewedSection } from "./CategoryRecentlyViewedSection";

interface CategoryDetailViewProps {
  category: Category;
  initialProducts: Product[];
  sisterCategories?: Category[];
}

export function CategoryDetailView({
  category,
  initialProducts,
  sisterCategories = [],
}: CategoryDetailViewProps) {
  const mounted = useMounted();
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const recentlyViewed = mounted ? rawRecentlyViewed : [];

  const IconComponent = getCategoryIcon(category.icon);
  const subcategories = category.subcategories || [];

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8 sm:space-y-12">
        {/* ── Embedded Catalog View (Filters + Sort + Products Grid with Title) ── */}
        <section aria-label={`${category.name} Products Feed`}>
          <CatalogView
            initialProducts={initialProducts}
            category={category}
            showSupportStrip={false}
            showHeader={true}
            title={category.name}
            subtitle={category.description || "Official Bangladesh warranty catalog with certified distributor support."}
          />
        </section>

        {/* ── Recently Viewed Products (Above Strips) ── */}
        {recentlyViewed.length > 0 && (
          <CategoryRecentlyViewedSection products={recentlyViewed} />
        )}

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

              {/* Rich Visual Cards Grid with Real Imagery & Ambient Liquid Shadow */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {sisterCategories.map((sister) => {
                  const SisterIcon = getCategoryIcon(sister.icon);

                  return (
                    <Link
                      key={sister.id}
                      href={ROUTES.CATEGORY_DETAIL(sister.slug)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card border border-border/70 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_8px_20px_-6px_rgba(245,158,11,0.18),0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_-6px_rgba(245,158,11,0.15),0_4px_16px_-2px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.28),0_8px_20px_-4px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_18px_36px_-6px_rgba(245,158,11,0.25),0_8px_24px_-4px_rgba(0,0,0,0.85)]"
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
                        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 font-bold shadow-xs transition-transform duration-200 group-hover:scale-110">
                          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
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
                        <div className="mt-2 flex items-center justify-between gap-1 text-[11px] text-muted-foreground font-medium">
                          <span>{sister.itemCount} items</span>
                          <span className="inline-flex items-center justify-center rounded-lg bg-amber-500 text-zinc-950 px-2 py-0.5 text-[10px] font-bold shadow-xs group-hover:bg-amber-400 transition-colors">
                            View
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
