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
} from "lucide-react";
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
  lightBg: string;
  darkBg: string;
  accentColor: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: "Pro Gaming Gear",
    badgeIcon: Flame,
    title: "Esports Gaming Headsets &",
    highlight: "RGB Precision Mice",
    subtitle:
      "Dominate every match with immersive 7.1 surround sound audio, low-latency wireless optical sensors, and ergonomic esports comfort.",
    ctaText: "Shop Gaming Gear",
    ctaLink: `${ROUTES.HOME}?category=electronics`,
    secondaryCtaText: "View Gear",
    secondaryCtaLink: `${ROUTES.HOME}?category=electronics`,
    lightBg: "from-rose-50/90 via-purple-50/30 to-background",
    darkBg: "dark:from-zinc-950 dark:via-zinc-900 dark:to-rose-950/30",
    accentColor: "from-rose-600 to-orange-500 dark:from-rose-400 dark:to-orange-400",
    tag: "Hot Gaming Deals",
    imageSrc: "/images/hero/headset-mouse.png",
    imageAlt: "Pro Esports Gaming Headset and RGB Wireless Gaming Mouse",
  },
  {
    id: "slide-2",
    badge: "Flagship Tech Launch",
    badgeIcon: Zap,
    title: "Ultra Laptops, Phones &",
    highlight: "Hi-Fi Audio",
    subtitle:
      "Experience cutting-edge performance with genuine Apple, Samsung, and Sony gear. Official warranty & instant 24h delivery nationwide.",
    ctaText: "Explore Tech",
    ctaLink: `${ROUTES.HOME}?category=electronics`,
    secondaryCtaText: "Flash Deals",
    secondaryCtaLink: `${ROUTES.HOME}?filter=deals`,
    lightBg: "from-amber-50/90 via-orange-50/40 to-background",
    darkBg: "dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950/40",
    accentColor: "from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500",
    tag: "Up to 35% OFF",
    imageSrc: "/images/hero/electronics.png",
    imageAlt: "Premium Laptop, Smartphone and Wireless Headphones",
  },
  {
    id: "slide-3",
    badge: "Next-Gen Wearables",
    badgeIcon: Sparkles,
    title: "Smart AMOLED Watches &",
    highlight: "TWS Earbuds",
    subtitle:
      "All-day health tracking, active noise cancellation, and seamless Bluetooth 5.4 connectivity for everyday mobility.",
    ctaText: "Shop Wearables",
    ctaLink: `${ROUTES.HOME}?category=electronics`,
    secondaryCtaText: "Top Rated",
    secondaryCtaLink: `${ROUTES.HOME}?category=electronics`,
    lightBg: "from-blue-50/90 via-cyan-50/40 to-background",
    darkBg: "dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950/40",
    accentColor: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400",
    tag: "Free Shipping",
    imageSrc: "/images/hero/smartwatch.png",
    imageAlt: "Smartwatch with AMOLED display and wireless earbuds",
  },
];

interface HeroBannerProps {
  autoSwipeDurationMs?: number;
}

export function HeroBanner({ autoSwipeDurationMs = 2800 }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, autoSwipeDurationMs);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, autoSwipeDurationMs]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div
      role="region"
      aria-label="Hero Promotion Slider"
      className="relative w-full overflow-hidden border-b border-border/60 bg-background transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides viewport */}
      <div
        className="flex transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {SLIDES.map((slide) => {
          const BadgeIcon = slide.badgeIcon;
          return (
            <div
              key={slide.id}
              className={cn(
                "relative min-w-full flex-shrink-0 bg-gradient-to-br py-10 sm:py-14 lg:py-16 transition-colors",
                slide.lightBg,
                slide.darkBg
              )}
            >
              {/* Centered container */}
              <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Text & CTA */}
                  <div className="lg:col-span-7 relative z-10 space-y-4 sm:space-y-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-foreground shadow-xs backdrop-blur-md">
                        {BadgeIcon && (
                          <BadgeIcon className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        {slide.badge}
                      </span>
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                        {slide.tag}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                      {slide.title}{" "}
                      <span
                        className={cn(
                          "bg-gradient-to-r bg-clip-text text-transparent",
                          slide.accentColor
                        )}
                      >
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-sm transition-all hover:bg-amber-400 hover:scale-105 active:scale-95"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      {slide.secondaryCtaText && slide.secondaryCtaLink && (
                        <Link
                          href={slide.secondaryCtaLink}
                          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-muted hover:border-border"
                        >
                          <span>{slide.secondaryCtaText}</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right: Floating Transparent Hero Product Visual */}
                  <div className="lg:col-span-5 flex items-center justify-center relative">
                    <div className="relative w-full max-w-[360px] sm:max-w-[440px] aspect-square">
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 440px"
                        className="object-contain transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-background hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-background hover:scale-110 active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isActive
                  ? "w-7 bg-amber-500"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
