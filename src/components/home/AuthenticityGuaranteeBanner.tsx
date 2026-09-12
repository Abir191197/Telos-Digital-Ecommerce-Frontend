"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { m, LazyMotion, domAnimation, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";

const bannerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function AuthenticityGuaranteeBanner() {
  return (
    <LazyMotion features={domAnimation}>
      <m.section
        variants={bannerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        aria-label="100% Genuine Guarantee"
        className="group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/8 to-secondary/40 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_30px_-6px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_-10px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Ambient radial blur backlight */}
        <div
          aria-hidden="true"
          className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Authorized Guarantee
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  100% Genuine Devices
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-foreground">
                Official Manufacturer Warranty Across Bangladesh
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Every device on Telos Cart includes verifiable official serials, authentic retail packaging, and direct replacement assurance from authorized brand centers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <Link
              href={ROUTES.ABOUT}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Learn Authenticity Pledge</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </m.section>
    </LazyMotion>
  );
}

