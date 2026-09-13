"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { m, type Variants } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

export function HeroContentBlock() {
  return (
    <div className="md:col-span-7 space-y-4 sm:space-y-6 text-left">
      {/* Top Badge */}
      <m.div
        variants={itemVariants}
        className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300 backdrop-blur-md shadow-2xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="tracking-wider uppercase text-[10px] font-extrabold text-amber-800 dark:text-amber-300">
          BANGLADESH&apos;S MARKETPLACE
        </span>
      </m.div>

      {/* Main Heading */}
      <m.h1
        variants={itemVariants}
        className="text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-zinc-950 dark:text-white"
      >
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
      <m.p
        variants={itemVariants}
        className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed font-medium"
      >
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
  );
}
