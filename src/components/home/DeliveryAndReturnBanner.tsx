"use client";

import React from "react";
import Link from "next/link";
import { Truck, RotateCcw, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

const bannerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const bannerCardVariants: Variants = {
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

export function DeliveryAndReturnBanner() {
  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Express Delivery and Hassle-Free Returns" className="w-full">
        <m.div
          variants={bannerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Card 1: Fast Delivery Banner */}
          <m.div
            variants={bannerCardVariants}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_14px_32px_-8px_rgba(59,130,246,0.18)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7)] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                <Truck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="rounded-full bg-blue-600/15 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Dhaka & Nationwide
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Express 24-48h Doorstep Courier
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Same-day dispatch in Dhaka metro, with live SMS tracking and insured transit to all 64 districts in Bangladesh.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Free delivery over ৳2,000
              </span>
              <Link
                href={ROUTES.TRACKING}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 dark:hover:text-white shadow-xs transition-all duration-200 group/btn"
              >
                <span>Track Orders</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </m.div>

          {/* Card 2: 7-Day Replacement & Return Banner */}
          <m.div
            variants={bannerCardVariants}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_14px_32px_-8px_rgba(245,158,11,0.18)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7)] transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20 transition-transform duration-300 group-hover:scale-105">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Zero Risk Policy
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  7-Day Easy Return & Instant Swap
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Received a defective or mismatched product? Instant pickup from your doorstep and replacement without complicated paperwork.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Hassle-free guarantee
              </span>
              <Link
                href={ROUTES.TERMS}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 hover:text-white px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 dark:hover:text-zinc-950 shadow-xs transition-all duration-200 group"
              >
                <span>Return Policy</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </m.div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
