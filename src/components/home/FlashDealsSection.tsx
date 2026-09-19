"use client";

import { FlashDealCard } from "@/components/deals/FlashDealCard";
import { ROUTES } from "@/constants";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
    const adminSelected = allProducts.filter((p) =>
      Boolean(p.isFlashDeal && p.isFeatured),
    );
    if (adminSelected.length > 0) {
      return adminSelected.slice(0, 12);
    }
    // Initial fallback if admin has not yet flagged featured items:
    return allProducts.filter((p) => Boolean(p.isFlashDeal)).slice(0, 12);
  }, [allProducts]);

  if (flashProducts.length === 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Flash Deals" className="w-full">
        <m.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative rounded-3xl border border-amber-500/25 bg-[#FFF9F2] dark:bg-[#1A130B]/90 p-4 sm:p-6 lg:p-7 shadow-[0_10px_35px_-8px_rgba(245,158,11,0.07)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]">
          {/* Header with Title, Badge, Countdown & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-amber-500/15 dark:border-amber-500/10">
            {/* Left Info: Flame Icon, Title, Live Countdown Ticker & Subtitle */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 shrink-0">
                <Flame className="h-6 w-6 fill-zinc-950 text-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Flash Deals
                  </h2>
                  {/* Live Urgency Ticker Capsule */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="font-sans text-[11px] font-semibold text-muted-foreground">
                      Ends in
                    </span>
                    <span>
                      {String(timeLeft.hours).padStart(2, "0")}:
                      {String(timeLeft.minutes).padStart(2, "0")}:
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Up to 35% discount with direct BD express courier
                </p>
              </div>
            </div>

            {/* Right Controls: Only Clean View All Link */}
            <div className="flex items-center self-start sm:self-auto">
              <Link
                href={ROUTES.FLASH_DEALS}
                className="inline-flex items-center gap-1.5 rounded-full bg-background/80 hover:bg-background border border-border/70 hover:border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-foreground transition-all duration-200 group shrink-0 shadow-xs cursor-pointer">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* Smooth Slow Marquee Track with Hover-Pause */}
          <div className="relative mt-4 sm:mt-5 overflow-hidden py-3">
            <div
              className="flex gap-4 select-none animate-marquee pb-4 pt-2"
              style={{
                animationDuration: `${Math.max(35, flashProducts.length * 8)}s`,
              }}>
              {[...flashProducts, ...flashProducts].map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="w-[210px] sm:w-[235px] md:w-[250px] shrink-0">
                  <FlashDealCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
