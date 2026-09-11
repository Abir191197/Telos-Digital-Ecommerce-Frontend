"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Layers, Flame, Zap } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

interface BentoItem {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  href: string;
  image: string;
  tagline: string;
  gridSpan: string; // Tailwind grid spans
  priceHint?: string;
  ctaText: string;
}

const BENTO_ITEMS: BentoItem[] = [
  {
    title: "Esports & Pro Gaming Arena",
    badge: "Hot Zone",
    badgeColor: "bg-rose-600 text-white",
    description: "Mechanical boards, ultra-lightweight 8K wireless mice, 7.1 headsets & RTX consoles.",
    href: ROUTES.CATEGORY_DETAIL("gaming-gear-consoles"),
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    tagline: "Up to 35% OFF Gear",
    gridSpan: "col-span-1 sm:col-span-2 lg:col-span-8 row-span-2 min-h-[340px] sm:min-h-[420px]",
    priceHint: "Starts from ৳2,499",
    ctaText: "Explore Battle Arena",
  },
  {
    title: "Flagship Apple & Samsung",
    badge: "Official BD",
    badgeColor: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
    description: "iPhone 16 Pro Max & Galaxy S24 Ultra with verified brand warranty.",
    href: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    tagline: "Official Warranty",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-4 row-span-1 min-h-[220px] sm:min-h-[240px]",
    ctaText: "Browse Phones",
  },
  {
    title: "Audiophile & ANC Sound",
    badge: "Hi-Res Audio",
    badgeColor: "bg-purple-600 text-white",
    description: "Sony, Bose & Sennheiser noise-cancelling headphones.",
    href: ROUTES.CATEGORY_DETAIL("audio-headphones"),
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    tagline: "Studio Clarity",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-4 row-span-1 min-h-[220px] sm:min-h-[240px]",
    ctaText: "Discover Audio",
  },
  {
    title: "Ultrabooks & MacBooks",
    badge: "Peak Speed",
    badgeColor: "bg-blue-600 text-white",
    description: "Apple M3/M4 chips and Intel Core Ultra workstations for coding & creator workflows.",
    href: ROUTES.CATEGORY_DETAIL("laptops-macbooks"),
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    tagline: "Fast Same-Day Courier",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-6 row-span-1 min-h-[240px] sm:min-h-[260px]",
    priceHint: "From ৳58,000",
    ctaText: "Shop Laptops",
  },
  {
    title: "AMOLED Smartwatches",
    badge: "Health & GPS",
    badgeColor: "bg-emerald-600 text-white",
    description: "All-day biometric tracking, ECG, SpO2 & multi-day endurance batteries.",
    href: ROUTES.CATEGORY_DETAIL("smartwatches-wearables"),
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    tagline: "Next-Gen Mobility",
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-6 row-span-1 min-h-[240px] sm:min-h-[260px]",
    priceHint: "Starts at ৳3,200",
    ctaText: "View Wearables",
  },
];

export function BentoShowcaseSection() {
  return (
    <section aria-label="Curated Lifestyle Collections" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Featured Collections & Lifestyle
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              Hand-Picked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Dynamic curated hubs tailored for work, gaming, sound, and mobility
          </p>
        </div>

        <Link
          href={ROUTES.CATEGORIES}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 dark:hover:text-zinc-950 shadow-xs transition-all duration-200 self-start sm:self-auto shrink-0 group"
        >
          <span>All 250+ Categories</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Multi-Height & Multi-Weight Bento Grid (12 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {BENTO_ITEMS.map((item, idx) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-500/10",
              item.gridSpan
            )}
          >
            {/* Background Image with Cinematic Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-muted/50">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              {/* Premium Gradient Overlay: dark on bottom/left for clean contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
            </div>

            {/* Top Row Badges */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm",
                  item.badgeColor
                )}
              >
                {item.badge}
              </span>

              {item.priceHint && (
                <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-zinc-900 shadow-xs">
                  {item.priceHint}
                </span>
              )}
            </div>

            {/* Bottom Content Row */}
            <div className="relative z-10 mt-auto pt-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {item.tagline}
              </span>

              <h3
                className={cn(
                  "font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors",
                  idx === 0 ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl"
                )}
              >
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 max-w-xl leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/90 group-hover:bg-amber-500 group-hover:text-zinc-950 px-4 py-2 text-xs font-bold text-zinc-900 shadow-sm backdrop-blur-md transition-all duration-200">
                  <span>{item.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
