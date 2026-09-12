"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ArrowRight,
  Loader2,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
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

const INITIAL_COUNT = 8;
const BATCH_SIZE = 6;

export function FlashDealsView() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter flash deal items or products with significant discount
  const allFlashProducts = useMemo(() => {
    return products.filter(
      (p) => p.isFlashDeal || (p.discountPercentage && p.discountPercentage >= 10)
    );
  }, []);

  // Infinite scroll state: start with 8 products, append in batches of 6 with visible transition
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const displayedProducts = useMemo(() => {
    return allFlashProducts.slice(0, visibleCount);
  }, [allFlashProducts, visibleCount]);

  const hasMore = visibleCount < allFlashProducts.length;

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allFlashProducts.length));
            setIsLoadingMore(false);
          }, 500); // 500ms visible loading experience
        }
      },
      { rootMargin: "100px" } // Triggers visibly when user reaches near bottom
    );

    const currentRef = loadMoreTriggerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, allFlashProducts.length]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-amber-500 selection:text-zinc-950">
        {/* ── Breadcrumb Bar ── */}
        <div className="border-b border-border/60 bg-muted/20 py-3">
          <div className="container px-3 sm:px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-border" />
              <span className="font-semibold text-foreground">Flash Deals</span>
            </nav>
          </div>
        </div>

        {/* ── Hero Banner with Live Countdown ── */}
        <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/60 bg-gradient-to-b from-amber-500/10 via-background to-background">
          {/* Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/20 blur-3xl rounded-full -z-10"
          />

          <div className="container px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Flame className="h-4 w-4 fill-amber-500" />
                  <span>Limited Time Event</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                  Exclusive Flash Deals &amp; Daily Price Drops
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Genuine flagship smartphones, creator laptops, noise-cancelling headphones, and official gaming peripherals with time-sensitive promotional markdowns and authorized Bangladesh warranty.
                </p>
              </div>

              {/* Live Countdown Box */}
              <div className="self-start lg:self-center rounded-3xl bg-card border border-amber-500/30 p-5 sm:p-6 shadow-[0_8px_30px_-4px_rgba(245,158,11,0.2)] dark:shadow-[0_10px_40px_-6px_rgba(0,0,0,0.6)] space-y-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Flash Round Closes In</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-base sm:text-lg font-black text-foreground">
                  <div className="flex flex-col items-center">
                    <span className="rounded-2xl bg-muted/80 border border-border px-3 py-2 shadow-xs">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase">Hours</span>
                  </div>
                  <span className="text-amber-500 font-bold -translate-y-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="rounded-2xl bg-muted/80 border border-border px-3 py-2 shadow-xs">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase">Mins</span>
                  </div>
                  <span className="text-amber-500 font-bold -translate-y-2">:</span>
                  <div className="flex flex-col items-center">
                    <span className="rounded-2xl bg-amber-500 text-zinc-950 px-3 py-2 shadow-xs">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Value Trust Strip ── */}
        <section className="border-b border-border/60 bg-muted/20 py-4">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-foreground">100% Genuine BD Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-foreground">Dhaka 24h Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
                <span className="font-semibold text-foreground">7-Day Return Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-foreground">{allFlashProducts.length} Deals Live</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Flash Deals Infinite Grid ── */}
        <section className="container px-3 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                All Active Flash Deals ({allFlashProducts.length})
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Showing {displayedProducts.length} of {allFlashProducts.length} promotional items.
              </p>
            </div>

            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-4 py-2 text-xs font-bold text-foreground transition-all shrink-0 group"
            >
              <span>Full Catalog</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {displayedProducts.map((product) => (
              <div key={product.id} className="animate-in fade-in-50 duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Infinite Scroll Trigger Indicator */}
          <div ref={loadMoreTriggerRef} className="pt-8 pb-4 flex justify-center">
            {hasMore ? (
              <div className="inline-flex items-center gap-2.5 rounded-full bg-card border border-border px-5 py-2.5 text-xs font-bold text-muted-foreground shadow-2xs">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Loading more flash discounts...</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>You&apos;ve viewed all active flash deals</span>
              </div>
            )}
          </div>
        </section>

        {/* ── High-Impact Bottom CTA ── */}
        <section className="container px-4 sm:px-6 pt-4">
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-12 text-center text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
            {/* Ambient Background Glows */}
            <div
              aria-hidden="true"
              className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-amber-500/25 blur-3xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-rose-500/20 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-amber-400 border border-white/10">
                <Bell className="h-3.5 w-3.5" />
                <span>Never Miss a Flash Drop</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Want Instant Alerts Before Flash Rounds Go Live?
              </h3>

              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto">
                Stock is strictly limited per round. Bookmark this page or chat with our Dhaka concierge to get early access to manufacturer markdowns.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-7 py-3 text-xs sm:text-sm font-bold hover:scale-105 active:scale-95 shadow-md shadow-amber-500/25 transition-all"
                >
                  <span>Explore 250+ Verified Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={ROUTES.CONTACT}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all"
                >
                  <span>Contact Care Team</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
