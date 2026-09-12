"use client";

import React from "react";
import Link from "next/link";
import { Flame, Clock, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
import { products } from "@/data";
import { ProductCard } from "@/components/common";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
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
    <LazyMotion features={domAnimation}>
      <section aria-label="Flash Deals" className="w-full">
        <m.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent p-4 sm:p-6 lg:p-8"
        >
          {/* Header with Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 fill-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Flash Deals
                  </h2>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Limited Time
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Up to 35% discount with direct BD express courier
                </p>
              </div>
            </div>

            {/* Live Countdown Timer & View All Link */}
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
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
                  <span className="rounded-lg bg-amber-500 text-zinc-950 px-2 py-1 shadow-xs font-black">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              <Link
                href={ROUTES.FLASH_DEALS}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs font-bold text-foreground transition-all group shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* 2-col on mobile, 3-col on md, 5-col on xl desktop */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {flashProducts.map((product) => (
              <m.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </m.div>
            ))}
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
