"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Layers, Flame, Zap } from "lucide-react";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 260,
    },
  },
};

const BENTO_ITEMS: BentoItem[] = [
  {
    title: "Esports & Pro Gaming Arena",
    badge: "Hot Zone",
    badgeColor: "bg-rose-600 text-white",
    description: "Mechanical boards, ultra-lightweight 8K wireless mice, 7.1 headsets & RTX consoles.",
    href: ROUTES.CATEGORY_DETAIL("gaming-gear-consoles"),
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    tagline: "Up to 35% OFF Gear",
    gridSpan: "col-span-1 sm:col-span-2 lg:col-span-8 row-span-2 min-h-[380px] sm:min-h-[460px]",
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
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-4 row-span-1 min-h-[250px] sm:min-h-[270px]",
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
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-4 row-span-1 min-h-[250px] sm:min-h-[270px]",
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
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-6 row-span-1 min-h-[260px] sm:min-h-[280px]",
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
    gridSpan: "col-span-1 sm:col-span-1 lg:col-span-6 row-span-1 min-h-[260px] sm:min-h-[280px]",
    priceHint: "Starts at ৳3,200",
    ctaText: "View Wearables",
  },
];

export function BentoShowcaseSection() {
  return (
    <LazyMotion features={domAnimation}>
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
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5"
        >
          {BENTO_ITEMS.map((item, idx) => (
            <m.div
              key={item.title}
              variants={tileVariants}
              className={cn("flex flex-col", item.gridSpan)}
            >
              <Link
                href={item.href}
                className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card p-5 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 dark:hover:shadow-black/60"
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
              {/* Light gradient overlay to keep photography vivid behind frosted glass */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent" />
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

            {/* Liquid Glass Content Card Capsule */}
            <div className="relative z-10 mt-auto p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl overflow-hidden bg-white/20 dark:bg-black/25 backdrop-blur-md backdrop-saturate-150 shadow-[0_6px_24px_0_rgba(0,0,0,0.1)] dark:shadow-[0_6px_24px_0_rgba(0,0,0,0.4)] space-y-1.5">
              {/* Liquid radial refractive glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/20 dark:bg-amber-500/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
              />

              <span className="relative z-10 inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {item.tagline}
              </span>

              <h3
                className={cn(
                  "relative z-10 font-black text-zinc-950 dark:text-white tracking-tight leading-snug transition-colors drop-shadow-2xs",
                  idx === 0 ? "text-lg sm:text-xl lg:text-2xl" : "text-sm sm:text-base"
                )}
              >
                {item.title}
              </h3>

              <p className="relative z-10 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-medium line-clamp-1 leading-relaxed">
                {item.description}
              </p>

              <div className="relative z-10 pt-0.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 pl-3.5 pr-1 py-1 text-[11px] sm:text-xs font-black shadow-md shadow-amber-500/20 transition-all duration-200 group-hover:scale-[1.03]">
                  <span>{item.ctaText}</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-zinc-950 shadow-xs">
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-[-45deg]" />
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </m.div>
      ))}
    </m.div>
  </section>
</LazyMotion>
);
}
