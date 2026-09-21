"use client";

import React from "react";
import Link from "next/link";
import { BrandLogoDisplay } from "@/components/shared";
import { ROUTES } from "@/constants";
import { Award, ShieldCheck, ArrowRight, Store } from "lucide-react";
import { BrandCompactProductCard } from "./BrandCompactProductCard";
import type { Brand, Product } from "@/types/ecommerce.types";

interface BrandSpotlightSectionProps {
  brand: Brand;
  products: Product[];
}

export function BrandSpotlightSection({
  brand,
  products,
}: BrandSpotlightSectionProps) {
  if (!products.length) return null;

  return (
    <section aria-label={`Featured brand: ${brand.name}`} className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Award className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Featured Brand: {brand.name}
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Official Partner
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore official flagship hardware with genuine Bangladesh warranty.
            </p>
          </div>
        </div>

        <Link
          href={ROUTES.BRAND_DETAIL(brand.slug)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-xs hover:shadow-md transition-all duration-200 group">
          <span>View All {brand.name}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Brand Showcase Card (1 Col) + 3 Product Columns (3 stacked compact cards each = 9 slots) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch">
        {/* Brand Showcase Card (1 Col - No border, Default Liquid Shadow) */}
        <div className="lg:col-span-1 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-muted/60 via-card to-card text-center relative overflow-hidden group shadow-[0_8px_20px_-6px_rgba(245,158,11,0.18),0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_-6px_rgba(245,158,11,0.15),0_4px_16px_-2px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1">
          <div
            aria-hidden="true"
            className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/20 px-2.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 mb-4">
              <ShieldCheck className="h-3 w-3" />
              <span>Authorized Flagship</span>
            </div>

            <div className="h-24 w-full flex items-center justify-center my-3">
              <BrandLogoDisplay
                name={brand.name}
                slug={brand.slug}
                image={brand.image}
                className="h-14 sm:h-16 max-w-[155px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="text-lg font-extrabold text-foreground mt-2">
              {brand.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
              {brand.tagline || "Innovating technology designed for performance and precision."}
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-border/40">
            <Link
              href={ROUTES.BRAND_DETAIL(brand.slug)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 py-2.5 px-4 text-xs font-bold transition-all shadow-xs">
              <span>Visit Store</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Product Columns (Exactly 3 cards per column, total 9 slots) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {[0, 1, 2].map((colIndex) => {
            const slotIndices = [colIndex * 3, colIndex * 3 + 1, colIndex * 3 + 2];

            return (
              <div
                key={colIndex}
                className="flex flex-col gap-3.5 justify-between">
                {slotIndices.map((slotIdx) => {
                  const product = products[slotIdx];

                  if (product) {
                    return (
                      <BrandCompactProductCard
                        key={product.id}
                        product={product}
                        className="flex-1"
                      />
                    );
                  }

                  // If less than 9 products exist, render an elegant "Explore More" card
                  return (
                    <Link
                      key={`empty-slot-${slotIdx}`}
                      href={ROUTES.BRAND_DETAIL(brand.slug)}
                      className="group flex-1 flex items-center justify-between p-4 rounded-2xl bg-card shadow-[0_8px_20px_-6px_rgba(245,158,11,0.18),0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_-6px_rgba(245,158,11,0.15),0_4px_16px_-2px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.28),0_8px_20px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                            More {brand.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Browse catalog & deals
                          </div>
                        </div>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-amber-500 group-hover:text-zinc-950 text-muted-foreground transition-colors">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 sm:hidden text-center">
        <Link
          href={ROUTES.BRAND_DETAIL(brand.slug)}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-xs transition-colors">
          <span>View All {brand.name} Products</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
