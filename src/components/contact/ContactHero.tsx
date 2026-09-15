"use client";

import React from "react";
import { Clock } from "lucide-react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./contactAnimations";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-14 sm:pt-20 sm:pb-20 border-b border-border/60">
      {/* Ambient Blurred Glow Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent blur-3xl opacity-70 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-[15%] w-60 h-60 bg-blue-500/10 blur-3xl -z-10"
      />

      <div className="container px-4 sm:px-6">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <m.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-2xs">
              <Clock className="h-3.5 w-3.5" />
              <span>9:00 AM – 10:00 PM BST · Instant Human Help</span>
            </div>
          </m.div>

          <m.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
          >
            We&apos;re Here to Support Your{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Tech Journey.
            </span>
          </m.h1>

          <m.p
            variants={itemVariants}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            Whether you need advice selecting a laptop, urgent courier tracking, or official warranty guidance, our Dhaka-based support team is always within reach.
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
