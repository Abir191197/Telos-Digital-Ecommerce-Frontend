"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  ChevronRight,
  ArrowRight,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { ProductCard } from "@/components/common";
import { FlashDealCard } from "./FlashDealCard";
import { FlashDealsSkeleton, FlashDealCardSkeleton } from "./FlashDealsSkeleton";
import { useGetProductsQuery } from "@/services/api/products/productApi";
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

  const { data: serverProducts, isLoading } = useGetProductsQuery({ limit: 100 });
  const allProducts = serverProducts?.data || [];

  // Filter flash deal items or products with significant discount from real API
  const allFlashProducts = useMemo(() => {
    const deals = allProducts.filter(
      (p) => Boolean(p.isFlashDeal) || (p.discountPercentage && p.discountPercentage >= 10)
    );
    return deals.length > 0 ? deals : allProducts;
  }, [allProducts]);

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

  if (isLoading) {
    return <FlashDealsSkeleton />;
  }

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

        {/* ── Compact Header Bar with Live Countdown ── */}
        <section className="container px-3 sm:px-6 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Flame className="h-4 w-4 fill-amber-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Flash Deals
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {allFlashProducts.length} Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Limited-time price markdowns with official Bangladesh warranty.
              </p>
            </div>

            {/* Compact Live Countdown Capsule */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card border border-border/70 shadow-xs self-start sm:self-auto">
              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Ends in:</span>
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-black text-foreground">
                <span className="rounded-md bg-muted px-1.5 py-0.5">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span className="text-amber-500 font-bold">:</span>
                <span className="rounded-md bg-muted px-1.5 py-0.5">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span className="text-amber-500 font-bold">:</span>
                <span className="rounded-md bg-amber-500 text-zinc-950 px-1.5 py-0.5">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Flash Deals Infinite Grid ── */}
        <section className="container px-3 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Active Promotions ({allFlashProducts.length})
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
                <FlashDealCard product={product} />
              </div>
            ))}

            {/* Skeleton cards shown during infinite scroll fetching */}
            {isLoadingMore && (
              Array.from({ length: Math.min(BATCH_SIZE, allFlashProducts.length - displayedProducts.length || BATCH_SIZE) }).map((_, i) => (
                <FlashDealCardSkeleton key={`loading-more-skeleton-${i}`} />
              ))
            )}
          </div>

          {/* Infinite Scroll Trigger Sentinel & Completion Indicator */}
          <div ref={loadMoreTriggerRef} className="pt-6 pb-4 flex justify-center">
            {!hasMore && displayedProducts.length > 0 && (
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
