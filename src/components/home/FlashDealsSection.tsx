"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Flame, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
import { FlashDealCard } from "@/components/deals/FlashDealCard";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { cn } from "@/lib/utils";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export function FlashDealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 1,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: serverProducts } = useGetProductsQuery({ limit: 100 });
  const allProducts = serverProducts?.data || [];

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
        return { hours: 8, minutes: 42, seconds: 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Strictly displays the products enabled by the admin in /dashboard/flashdeal with:
  // 1. "Include in Flash Deals" (isFlashDeal: true)
  // 2. "Feature on Homepage" (isFeatured: true)
  // Strictly up to 12 products
  const flashProducts = useMemo(() => {
    const adminSelected = allProducts.filter((p) => Boolean(p.isFlashDeal && p.isFeatured));
    if (adminSelected.length > 0) {
      return adminSelected.slice(0, 12);
    }
    // Initial fallback if admin has not yet flagged featured items:
    return allProducts.filter((p) => Boolean(p.isFlashDeal)).slice(0, 12);
  }, [allProducts]);

  // Handle scroll buttons visibility
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll, { passive: true });
    }
    window.addEventListener("resize", checkScroll);
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, flashProducts]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (flashProducts.length === 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Flash Deals" className="w-full">
        <m.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative rounded-3xl border border-amber-500/25 bg-[#FFF9F2] dark:bg-[#1A130B]/90 p-4 sm:p-6 lg:p-7 shadow-[0_10px_35px_-8px_rgba(245,158,11,0.07)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]"
        >
          {/* Header with Title, Badge, Countdown & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-amber-500/15 dark:border-amber-500/10">
            {/* Left Info: Flame Icon, Title & Subtitle */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 shrink-0">
                <Flame className="h-6 w-6 fill-zinc-950 text-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Flash Deals
                  </h2>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    LIMITED TIME
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Up to 35% discount with direct BD express courier
                </p>
              </div>
            </div>

            {/* Right Controls: Live Countdown Timer + Carousel Arrows + View All Link */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start lg:self-auto">
              {/* Live Countdown Timer */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Ends In:
                </span>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-foreground">
                  <span className="rounded-lg bg-background/90 border border-border/80 px-2 py-1 shadow-xs">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span className="text-muted-foreground font-bold">:</span>
                  <span className="rounded-lg bg-background/90 border border-border/80 px-2 py-1 shadow-xs">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span className="text-muted-foreground font-bold">:</span>
                  <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 px-2 py-1 shadow-xs font-black">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              {/* Carousel Navigation Arrow Controls */}
              <div className="hidden sm:flex items-center gap-1.5 border-l border-amber-500/20 pl-3">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous flash deals"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 transition-all duration-200 shadow-xs cursor-pointer",
                    canScrollLeft
                      ? "text-foreground hover:bg-background hover:scale-105 active:scale-95 hover:border-amber-500/50"
                      : "text-muted-foreground/40 border-border/40 cursor-not-allowed opacity-50"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Next flash deals"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 transition-all duration-200 shadow-xs cursor-pointer",
                    canScrollRight
                      ? "text-foreground hover:bg-background hover:scale-105 active:scale-95 hover:border-amber-500/50"
                      : "text-muted-foreground/40 border-border/40 cursor-not-allowed opacity-50"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* View All Button */}
              <Link
                href={ROUTES.FLASH_DEALS}
                className="inline-flex items-center gap-1.5 rounded-full bg-background/80 hover:bg-background border border-border/70 hover:border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-foreground transition-all duration-200 group shrink-0 shadow-xs cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* Smooth Carousel Track */}
          <div
            ref={scrollRef}
            className="mt-5 sm:mt-6 flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {flashProducts.map((product) => (
              <div
                key={product.id}
                className="w-[210px] sm:w-[230px] md:w-[245px] lg:w-[260px] shrink-0 snap-start"
              >
                <FlashDealCard product={product} />
              </div>
            ))}
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
