"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { m, type Variants } from "framer-motion";

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

interface HeroSlideShowcaseProps {
  activeSlide: HeroSlide;
  slides: HeroSlide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
}

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

export function HeroSlideShowcase({
  activeSlide,
  slides,
  currentSlideIndex,
  onSelectSlide,
}: HeroSlideShowcaseProps) {
  return (
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

        {/* Floating Product Stage */}
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
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelectSlide(i)}
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
  );
}
