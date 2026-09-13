"use client";

import React from "react";
import { Lock, Fingerprint, ShieldCheck, CheckCircle2 } from "lucide-react";
import { m, type Variants } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeCurve,
    },
  },
};

export function PrivacyHeaderHero() {
  return (
    <header className="relative border-b border-border/60 bg-muted/25 dark:bg-zinc-950/40 backdrop-blur-xl pt-8 pb-10 sm:pt-16 sm:pb-18">
      <div className="container px-3.5 sm:px-6 max-w-6xl mx-auto">
        <m.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-3.5 sm:space-y-4"
        >
          {/* Badge */}
          <m.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 shadow-2xs backdrop-blur-md"
          >
            <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Security & Privacy Protocol</span>
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            <span className="font-semibold text-amber-800/80 dark:text-amber-200/80">
              Updated Sept 2026
            </span>
          </m.div>

          {/* Title */}
          <m.h1
            variants={itemVariants}
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.18]"
          >
            Privacy Policy of{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
              Telos Cart
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            variants={itemVariants}
            className="text-xs sm:text-base text-muted-foreground max-w-3xl leading-relaxed font-normal"
          >
            We value your trust. Learn how Telos Cart safeguards your customer identity, encrypts digital transactions via SSLCOMMERZ, manages logistics data, and protects personal rights nationwide across Bangladesh.
          </m.p>

          {/* Quick Metadata Pill Strip */}
          <m.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs text-muted-foreground"
          >
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
              <Fingerprint className="h-3.5 w-3.5 text-amber-500" />
              <span>
                Encrypted: <strong className="text-foreground font-semibold">256-bit TLS</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Strictly <strong className="text-foreground font-semibold">Zero Data Selling</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
              <span>
                Complies with <strong className="text-foreground font-semibold">ICT Act BD</strong>
              </span>
            </div>
          </m.div>
        </m.div>
      </div>
    </header>
  );
}
