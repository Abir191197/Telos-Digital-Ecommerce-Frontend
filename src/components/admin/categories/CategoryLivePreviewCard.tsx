"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, LayoutGrid, Sparkles, Layers, Eye } from "lucide-react";
import { getCategoryIcon } from "@/components/categories/categoryConfig";

export interface CategoryLivePreviewCardProps {
  name: string;
  icon: string;
  bannerUrl: string | null;
  itemCount: number;
  featured: boolean;
  description: string;
  subcategories: string[];
}

export function CategoryLivePreviewCard({
  name,
  icon,
  bannerUrl,
  itemCount,
  featured,
  description,
  subcategories,
}: CategoryLivePreviewCardProps) {
  const [previewTab, setPreviewTab] = useState<"card" | "banner">("card");

  const IconComponent = getCategoryIcon(icon);
  const fallbackBanner =
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
  const displayBanner = bannerUrl || fallbackBanner;
  const displayName = name.trim() || "Untitled Category";

  return (
    <div className="space-y-3">
      {/* Container Card */}
      <div className="rounded-3xl border-none bg-card p-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)] space-y-4">
        {/* Preview Header with Mode Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">
              Live Storefront Preview
            </h3>
          </div>
          <div className="flex items-center rounded-xl bg-muted/50 p-0.5 border border-border/60 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setPreviewTab("card")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                previewTab === "card"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Grid Card
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("banner")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                previewTab === "banner"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Page Header
            </button>
          </div>
        </div>

        {/* MODE 1: Storefront Grid Card (matches CategoryCardItem) */}
        {previewTab === "card" && (
          <div className="space-y-4">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-background border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08),0_16px_40px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5),0_18px_50px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_-8px_rgba(245,158,11,0.15)] transition-all duration-300">
              {/* Visual Category Cover Image / Banner */}
              <div className="relative block h-36 w-full overflow-hidden bg-muted/20">
                <Image
                  src={displayBanner}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  unoptimized
                />

                {/* Minimal Floating Category Icon */}
                <div className="absolute top-2.5 left-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-background/90 backdrop-blur-md text-foreground shadow-xs border border-white/10">
                  <IconComponent className="h-4 w-4 text-amber-500" />
                </div>

                {/* Featured Badge */}
                {featured && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-zinc-950 text-[10px] font-black shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {displayName}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                    {itemCount} product{itemCount === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-amber-500 text-white hover:text-zinc-950 dark:bg-zinc-800 dark:hover:bg-amber-500 dark:text-zinc-100 dark:hover:text-zinc-950 py-2.5 px-3 text-xs font-bold tracking-wide transition-all duration-200 shadow-xs cursor-pointer">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover/btn:translate-x-1 text-amber-400 group-hover/btn:text-zinc-950" />
                </div>
              </div>
            </div>

            {/* Subcategories tags preview if any */}
            {subcategories.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-muted/30 border-none shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Layers className="h-3 w-3 text-amber-500" />
                  <span>Subcategories Included ({subcategories.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-background px-2.5 py-0.5 rounded-md border-none shadow-2xs text-foreground"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Category Hero Page Header Banner */}
        {previewTab === "banner" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border-none aspect-16/9 w-full shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)]">
              <Image
                src={displayBanner}
                alt={displayName}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30 p-4 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 font-bold">
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  {featured && (
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                      ★ Featured Collection
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black tracking-tight leading-tight">
                  {displayName}
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-1 leading-relaxed">
                  {description || "Explore top-tier official hardware, verified warranties, and fast delivery."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata summary */}
        <div className="pt-2 border-t border-border/50 text-[11px]">
          <div className="p-2 rounded-xl bg-muted/20 border border-border/60">
            <span className="text-muted-foreground block text-[10px]">Stock Count</span>
            <span className="font-bold text-foreground block">
              {itemCount} items
            </span>
          </div>
        </div>
      </div>

      {/* Guide Callout */}
      <div className="rounded-2xl border border-border/70 bg-muted/20 p-3.5 text-[11px] text-muted-foreground space-y-1">
        <p className="font-bold text-foreground flex items-center gap-1.5">
          <span>💡 Storefront Sync</span>
        </p>
        <p className="leading-relaxed">
          This preview dynamically renders the customer-facing card. When saved, it becomes immediately browsable in the store catalog and navigation menus.
        </p>
      </div>
    </div>
  );
}
