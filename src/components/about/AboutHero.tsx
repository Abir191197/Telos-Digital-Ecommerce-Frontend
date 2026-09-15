"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";
import { containerVariants, itemVariants } from "./aboutAnimations";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/60">
      {/* Ambient Blurred Glow Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent blur-3xl opacity-70 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 right-[10%] w-72 h-72 bg-blue-500/10 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-[10%] w-72 h-72 bg-emerald-500/10 blur-3xl -z-10"
      />

      <div className="container px-4 sm:px-6">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <m.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Benchmark in Bangladesh Tech Retail</span>
            </div>
          </m.div>

          <m.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
          >
            Zero Grey-Market Uncertainty.{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              100% Genuine Tech.
            </span>
          </m.h1>

          <m.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Telos Cart was engineered to eliminate the trust deficit in Bangladesh’s electronics market.
            We bridge premier global hardware brands directly to your doorstep with guaranteed authenticity,
            transparent warranties, and unmatched delivery speeds.
          </m.p>

          <m.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Explore Verified Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-md px-6 py-3 text-sm font-bold text-foreground hover:bg-muted/80 active:scale-95 transition-all duration-200"
            >
              <span>Speak With Our Team</span>
            </Link>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
