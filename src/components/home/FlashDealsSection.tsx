"use client";

import React from "react";
import Link from "next/link";
import { Flame, Clock, ArrowRight } from "lucide-react";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { ROUTES } from "@/constants";

export function FlashDealsSection() {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  React.useEffect(() => {
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

  // Filter flash deal or high discount items
  const flashProducts = React.useMemo(() => {
    return products
      .filter((p) => p.isFlashDeal || (p.discountPercentage && p.discountPercentage >= 15))
      .slice(0, 5);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section aria-label="Flash Deals" className="w-full">
      <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-amber-500/5 to-transparent p-4 sm:p-6 lg:p-8">
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/30">
              <Flame className="h-5 w-5 sm:h-6 sm:w-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Flash Deals
                </h2>
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Limited Time
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Up to 35% discount with direct BD express courier
              </p>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-rose-600" />
              Ends In:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
              <span className="rounded-lg bg-background border border-border/80 px-2 py-1 shadow-xs">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="rounded-lg bg-background border border-border/80 px-2 py-1 shadow-xs">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="rounded-lg bg-rose-600 text-white px-2 py-1 shadow-xs">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
        </div>

        {/* 2-col on mobile, 3-col on md, 5-col on xl desktop */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
