"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  badge: string;
  badgeIcon?: React.ElementType;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  accentColor: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
  shopName: string;
  price: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: "Bangladesh's Marketplace",
    badgeIcon: Flame,
    title: "Online Shopping in Bangladesh,",
    highlight: "All in One Place",
    subtitle: "Buy everything — pay Cash on Delivery across 64 districts with verified BD warranty.",
    ctaText: "Shop now",
    ctaLink: ROUTES.PRODUCTS,
    secondaryCtaText: "Browse categories",
    secondaryCtaLink: ROUTES.CATEGORIES,
    accentColor: "from-rose-500 via-amber-400 to-rose-400",
    tag: "Verified Sellers",
    imageSrc: "/images/hero/headset-mouse.png",
    imageAlt: "Pro Esports Gaming Headset & Audio Gear",
    shopName: "Supershop BD",
    price: "৳1,890",
  },
  {
    id: "slide-2",
    badge: "Official Tech Flagship",
    badgeIcon: Zap,
    title: "Flagship Phones, Laptops &",
    highlight: "Smart Computing",
    subtitle: "Genuine Apple, Samsung, Google & Sony devices with official Bangladesh authorized support.",
    ctaText: "Shop now",
    ctaLink: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    secondaryCtaText: "Browse categories",
    secondaryCtaLink: ROUTES.CATEGORIES,
    accentColor: "from-amber-400 via-orange-400 to-yellow-300",
    tag: "Up to 35% OFF",
    imageSrc: "/images/hero/electronics.png",
    imageAlt: "Premium Laptop, Smartphone and Wireless Headphones",
    shopName: "Official Hub BD",
    price: "৳34,999",
  },
  {
    id: "slide-3",
    badge: "Next-Gen Wearables",
    badgeIcon: Sparkles,
    title: "Smart AMOLED Watches &",
    highlight: "TWS Audio Earbuds",
    subtitle: "All-day health tracking, active noise cancellation, and seamless Bluetooth 5.4 connectivity.",
    ctaText: "Shop now",
    ctaLink: ROUTES.CATEGORY_DETAIL("smartwatches-wearables"),
    secondaryCtaText: "Browse categories",
    secondaryCtaLink: ROUTES.CATEGORIES,
    accentColor: "from-sky-400 via-blue-400 to-indigo-300",
    tag: "Free Shipping",
    imageSrc: "/images/hero/smartwatch.png",
    imageAlt: "Smartwatch with AMOLED display and wireless earbuds",
    shopName: "Gadget World BD",
    price: "৳3,450",
  },
];

interface HeroBannerProps {
  autoSwipeDurationMs?: number;
}

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Stable animation variants outside component to avoid re-creation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeCurve,
    },
  },
};

const cardSlideVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easeCurve,
      delay: 0.25,
    },
  },
};

const sideCardVariants: Variants = {
  hidden: { opacity: 0, x: 20, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.3 + i * 0.12,
      ease: easeCurve,
    },
  }),
};

export function HeroBanner({ autoSwipeDurationMs = 3800 }: HeroBannerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, autoSwipeDurationMs);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, autoSwipeDurationMs]);

  const activeSlide = SLIDES[currentSlideIndex];

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full pt-3 sm:pt-4">
        <div className="container px-3 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch justify-center">
            {/* ── Main Big Featured Hero Card (Flex-1, Borderless) ── */}
            <m.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex-1 min-w-0 relative flex flex-col justify-between overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#fbf8f3]/80 dark:bg-zinc-900/70 backdrop-blur-xl text-zinc-900 dark:text-white p-6 sm:p-9 lg:p-10 shadow-xl border-0 transition-all"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Continuous Ambient Breathing Glow 1 */}
              <m.div
                aria-hidden="true"
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.18, 0.32, 0.18],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-amber-400/25 dark:bg-amber-500/15 blur-[90px]"
              />

              {/* Continuous Ambient Breathing Glow 2 */}
              <m.div
                aria-hidden="true"
                animate={{
                  scale: [1.15, 1, 1.15],
                  opacity: [0.25, 0.12, 0.25],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-rose-400/20 dark:bg-rose-500/15 blur-[90px]"
              />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center h-full">
                {/* Left Content */}
                <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left">
                  {/* Top Badge */}
                  <m.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300 backdrop-blur-md shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="tracking-wider uppercase text-[10px] font-extrabold text-amber-800 dark:text-amber-300">
                      BANGLADESH'S MARKETPLACE
                    </span>
                  </m.div>

                  {/* Main Heading */}
                  <m.h1 variants={itemVariants} className="text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-zinc-950 dark:text-white">
                    Next-Gen Shopping <br className="hidden sm:inline" />
                    with{" "}
                    <m.span
                      animate={{
                        backgroundPosition: ["200% 0%", "-200% 0%"],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                      style={{
                        backgroundSize: "200% auto",
                      }}
                      className="bg-[linear-gradient(110deg,#b45309_0%,#d97706_25%,#fde68a_50%,#d97706_75%,#b45309_100%)] dark:bg-[linear-gradient(110deg,#d97706_0%,#f59e0b_25%,#fef3c7_50%,#f59e0b_75%,#d97706_100%)] bg-clip-text text-transparent inline-block drop-shadow-xs font-black"
                    >
                      Telos Cart
                    </m.span>
                  </m.h1>

                  {/* Subtitle */}
                  <m.p variants={itemVariants} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed font-medium">
                    Authentic Tech, Curated Lifestyle & Instant COD Delivery across 64 districts
                  </m.p>

                  {/* Trust Guarantee Badges */}
                  <m.div variants={itemVariants} className="flex items-center gap-4 sm:gap-5 pt-1">
                    <div>
                      <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none">
                        COD
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
                        PAY ON DELIVERY
                      </div>
                    </div>
                    <div className="h-7 w-[1.5px] bg-amber-500/30" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none">
                        Verified
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
                        SELLERS ONLY
                      </div>
                    </div>
                    <div className="h-7 w-[1.5px] bg-amber-500/30" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none">
                        7-day
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pt-1">
                        EASY RETURNS
                      </div>
                    </div>
                  </m.div>

                  {/* CTA Action Buttons */}
                  <m.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={ROUTES.PRODUCTS}
                      className="relative overflow-hidden inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-black pl-5 pr-2 py-2 text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all group"
                    >
                      {/* Ambient Sheen Sweep across CTA button */}
                      <m.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatDelay: 3.5,
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                        className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12"
                      />

                      <span className="relative z-10">Shop now</span>
                      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5 shadow-sm">
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                    </Link>

                    <Link
                      href={ROUTES.CATEGORIES}
                      className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-zinc-900 dark:text-zinc-100 font-bold px-5 py-2.5 text-xs sm:text-sm shadow-xs backdrop-blur-md active:scale-95 transition-all"
                    >
                      <span>Browse categories</span>
                    </Link>
                  </m.div>
                </div>

              {/* Right Showcase: Floating 3D Glassmorphism Showcase (High-transparency crystal glass) */}
              <div className="md:col-span-5 flex justify-center">
                <m.div
                  variants={cardSlideVariants}
                  className="relative w-full max-w-[320px] rounded-[32px] bg-white/40 dark:bg-zinc-900/45 backdrop-blur-2xl p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 dark:border-white/15 transition-all hover:shadow-[0_25px_70px_-12px_rgba(245,158,11,0.25)] hover:bg-white/50 dark:hover:bg-zinc-900/55 group"
                >
                  {/* Ambient Glow Pedestal behind product */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-gradient-to-tr from-amber-400/30 to-rose-400/20 blur-2xl group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Top Bar: Live Store Badge & Slide Pill Indicators */}
                  <div className="relative z-10 flex items-center justify-between gap-2 pb-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-800 px-3 py-1 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-xs border border-zinc-200/60 dark:border-zinc-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activeSlide.shopName}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold px-2.5 py-0.5 text-[10px]">
                      <Sparkles className="h-3 w-3" />
                      <span>{activeSlide.tag}</span>
                    </span>
                  </div>

                  {/* Floating Product Stage (Clean, borderless, no arrows) */}
                  <div className="relative aspect-[1.15/1] w-full flex items-center justify-center">
                    <Image
                      src={activeSlide.imageSrc}
                      alt={activeSlide.imageAlt}
                      fill
                      sizes="320px"
                      className="object-contain drop-shadow-[0_18px_25px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                    />
                  </div>

                  {/* Glass Info & Action Strip */}
                  <div className="relative z-10 mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-400 truncate">
                        {activeSlide.imageAlt}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">
                          {activeSlide.price}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          In Stock
                        </span>
                      </div>
                    </div>

                    <Link
                      href={activeSlide.ctaLink}
                      aria-label="View product details"
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold px-4 py-2 text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 group/btn"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 stroke-[2.5]" />
                    </Link>
                  </div>

                  {/* Thumbnail / Indicator Dots Bar */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 pt-3">
                    {SLIDES.map((slide, i) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlideIndex(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                          i === currentSlideIndex
                            ? "w-6 bg-amber-500"
                            : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                        )}
                      />
                    ))}
                  </div>
                </m.div>
              </div>
            </div>
          </m.div>

          {/* ── Right Side 2 Cards (Compact 2-col on Mobile/Tablet, Stacked 1:1 Squares with Ambient Floating Motion) ── */}
          <div className="w-full lg:w-auto grid grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4 shrink-0">
            {/* Top Pink/Rose Soft Tinted Card: 100% Cash on Delivery */}
            <m.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={sideCardVariants}
              className="lg:w-[235px] lg:aspect-square"
            >
              <m.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative h-full w-full flex flex-col justify-between overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-[#fef0f2] to-[#fde2e6] dark:from-[#2e181d] dark:to-[#221014] p-3.5 sm:p-5 lg:p-6 border-0 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
              >
                {/* Subtle background glow blob on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-rose-500/15 blur-xl group-hover:scale-125 transition-transform duration-500"
                />

                <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="space-y-0.5 sm:space-y-1.5">
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Zero Risk
                    </span>
                    <h2 className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-100 leading-tight">
                      Cash on <br className="hidden xs:inline" /> Delivery
                    </h2>
                    <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight sm:leading-snug font-medium line-clamp-2">
                      Inspect first, pay at door
                    </p>
                  </div>

                  <m.div
                    animate={{
                      y: [0, -3, 0],
                      rotate: [0, 2, -1, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 group-hover:scale-110 transition-all duration-300"
                  >
                    <Banknote className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.4]" />
                  </m.div>
                </div>

                <div className="relative z-10 pt-2.5 sm:pt-2">
                  <Link
                    href={ROUTES.PRODUCTS}
                    className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 border-0 transition-all duration-200 active:scale-95 group/btn"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </m.div>
            </m.div>

            {/* Bottom Sky/Blue Soft Tinted Card: Nationwide Delivery */}
            <m.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sideCardVariants}
              className="lg:w-[235px] lg:aspect-square"
            >
              <m.div
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="relative h-full w-full flex flex-col justify-between overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-br from-[#eff6ff] to-[#e1effe] dark:from-[#132338] dark:to-[#0d1827] p-3.5 sm:p-5 lg:p-6 border-0 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
              >
                {/* Subtle background glow blob on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-blue-500/15 blur-xl group-hover:scale-125 transition-transform duration-500"
                />

                <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-2">
                  <div className="space-y-0.5 sm:space-y-1.5">
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      64 Districts
                    </span>
                    <h2 className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-100 leading-tight">
                      Express <br className="hidden xs:inline" /> Delivery
                    </h2>
                    <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight sm:leading-snug font-medium line-clamp-2">
                      Fast 24-72h door transit
                    </p>
                  </div>

                  <m.div
                    animate={{
                      y: [0, -3, 0],
                      rotate: [0, -2, 1, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    className="shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 group-hover:scale-110 transition-all duration-300"
                  >
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.4]" />
                  </m.div>
                </div>

                <div className="relative z-10 pt-2.5 sm:pt-2">
                  <Link
                    href={ROUTES.TRACKING}
                    className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 shadow-sm hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 border-0 transition-all duration-200 active:scale-95 group/btn"
                  >
                    <span>Track Area</span>
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </m.div>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  </LazyMotion>
  );
}
