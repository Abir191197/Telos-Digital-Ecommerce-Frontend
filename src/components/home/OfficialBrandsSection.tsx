"use client";

import { ROUTES } from "@/constants";
import { useGetMarqueeBrandsQuery } from "@/services/api/brands/brandApi";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BrandLogoDisplay } from "@/components/shared";

export function OfficialBrandsSection() {
  const { data: brands = [], isLoading } = useGetMarqueeBrandsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (brands.length === 0) return null;

  // Duplicate array for infinite seamless marquee
  const marqueeItems = [...brands, ...brands];

  return (
    <section
      aria-label="Official Brand Stores"
      className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-500">
              <Sparkles className="h-3 w-3" />
              Direct Partnerships
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Official Brand Stores
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Authorized Bangladesh warranty and certified dealer support
          </p>
        </div>

        <Link
          href={ROUTES.BRANDS}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group">
          <span>All Brands</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
        </Link>
      </div>

      {/* Infinite Marquee Track - unconstrained vertical padding for liquid shadow */}
      <div className="relative w-full overflow-visible py-2 pb-8 pt-2">
        {/* Scrolling Strip */}
        <div className="animate-marquee gap-3 sm:gap-4 select-none pb-2">
          {marqueeItems.map((brand, idx) => {
            return (
              <Link
                key={`${brand.id}-${idx}`}
                href={ROUTES.BRAND_DETAIL(brand.slug)}
                className="group relative flex flex-col items-center justify-between w-[155px] sm:w-[180px] shrink-0 p-5 rounded-3xl bg-card text-card-foreground shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5),0_6px_10px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_35px_-8px_rgba(0,0,0,0.12),0_10px_15px_-6px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_22px_40px_-8px_rgba(0,0,0,0.7),0_10px_20px_-6px_rgba(245,158,11,0.15)] hover:-translate-y-1 transition-all duration-300 text-center select-none overflow-hidden"
              >
                {/* Ambient glow on hover - borderless design */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />

                {/* Logo Capsule - Centered */}
                <div className="relative z-10 flex-1 w-full flex items-center justify-center text-foreground/80 group-hover:text-foreground transition-colors duration-200 py-1">
                  <BrandLogoDisplay
                    name={brand.name}
                    slug={brand.slug}
                    image={brand.image}
                    className="h-9 sm:h-10 max-w-[120px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Brand Info */}
                <div className="relative z-10 flex flex-col items-center gap-0.5 mt-2 w-full">
                  <span className="text-sm font-bold text-foreground group-hover:text-foreground transition-colors truncate w-full tracking-tight">
                    {brand.name}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground/80">
                    {brand.tagline}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
