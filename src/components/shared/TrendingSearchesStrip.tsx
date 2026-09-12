"use client";

import React from "react";
import Link from "next/link";
import { Tag, Flame } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export const TRENDING_SUBCATS = [
  { name: "iPhone 16 Pro", slug: "smartphones-tablets", tag: "Flagship" },
  { name: "M3 MacBooks", slug: "laptops-macbooks", tag: "Hot" },
  { name: "Noise Cancelling", slug: "audio-headphones", tag: "Popular" },
  { name: "RTX 40-Series", slug: "pc-components-hardware", tag: "Gaming" },
  { name: "Smart Bands", slug: "smartwatches-wearables", tag: "Trending" },
  { name: "Mechanical Keyboards", slug: "gaming-gear-consoles", tag: "Gear" },
  { name: "WiFi 6 Routers", slug: "networking-routers", tag: "New" },
  { name: "4K Cinema OLED", slug: "tv-home-entertainment", tag: "Top Rated" },
];

interface TrendingSearchesStripProps {
  className?: string;
}

export function TrendingSearchesStrip({ className }: TrendingSearchesStripProps) {
  return (
    <section
      aria-label="Trending Searches & Aisles"
      className={cn("w-full", className)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Flame className="h-3 w-3" />
        </span>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Trending Searches & Aisles
        </h2>
      </div>

      <div className="no-scrollbar -mx-3 flex items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:px-0 py-1">
        {TRENDING_SUBCATS.map((item) => (
          <Link
            key={item.name}
            href={ROUTES.CATEGORY_DETAIL(item.slug)}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:shadow-md transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <Tag className="h-3 w-3 text-muted-foreground group-hover:text-amber-500 transition-colors" />
            <span>{item.name}</span>
            <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[9px] font-bold text-muted-foreground group-hover:bg-amber-500/20 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              {item.tag}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
