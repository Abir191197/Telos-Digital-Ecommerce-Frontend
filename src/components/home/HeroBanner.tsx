"use client";

import React, { useState, useCallback, useEffect } from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { Flame, Zap, Sparkles } from "lucide-react";
import { HeroSlideShowcase, type HeroSlide } from "./HeroSlideShowcase";
import { HeroContentBlock } from "./HeroContentBlock";
import { HeroSidePromoCards } from "./HeroSidePromoCards";

export type { HeroSlide };

export const HERO_SLIDES: HeroSlide[] = [
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

export function HeroBanner({ autoSwipeDurationMs = 3800 }: HeroBannerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, autoSwipeDurationMs);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, autoSwipeDurationMs]);

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full pt-3 sm:pt-4">
        <div className="container px-3 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch justify-center">
            {/* Main Featured Hero Card */}
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
                {/* Left Content Column */}
                <HeroContentBlock />

                {/* Right Showcase: Floating Glass Product Stage */}
                <HeroSlideShowcase
                  activeSlide={activeSlide}
                  slides={HERO_SLIDES}
                  currentSlideIndex={currentSlideIndex}
                  onSelectSlide={(index) => setCurrentSlideIndex(index)}
                />
              </div>
            </m.div>

            {/* Right Side 2 Action & Guarantee Cards */}
            <HeroSidePromoCards />
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
