"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";
import { containerVariants, itemVariants } from "./aboutAnimations";

const TIMELINE = [
  {
    year: "2024",
    title: "The Genesis",
    desc: "Founded by a collective of Bangladeshi tech engineers and hardware enthusiasts tired of the grey-market roulette.",
  },
  {
    year: "2025",
    title: "Authorized Distributor Partnerships",
    desc: "Forged direct tier-1 supply agreements with Apple, Samsung, Google, Sony, Asus, Xiaomi, and premium audio manufacturers.",
  },
  {
    year: "2026",
    title: "Next-Gen Digital Platform",
    desc: "Pioneering the modern web experience: ultra-low latency catalog, instantaneous checkout, real-time tracking, and express nationwide delivery.",
  },
];

const STANDARDS = [
  "Direct authorized regional distribution agreements",
  "Factory sealed packaging with uncompromised tamper seals",
  "Official IMEI / Serial barcode warranty coverage",
  "Transparent pricing with inclusive tax & duties",
  "Instant cashless transactions via bKash, Nagad & Cards",
  "Dedicated warranty claims concierge support",
];

export function AboutStandardsStory() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-14 sm:py-20">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Narrative */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <m.div variants={itemVariants} className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                <BadgeCheck className="h-4 w-4" />
                <span>The Verification Standard</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
                Every Single Package Dispatched Meets Strict Quality Protocols.
              </h2>
            </m.div>

            <m.p variants={itemVariants} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In Bangladesh, counterfeit accessories and tampered device boxes are an unfortunate reality of the unorganized retail sector. Telos Cart was built as the antidote: a tech-first retailer that inspects serial numbers against official brand databases prior to dispatch.
            </m.p>

            <m.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {STANDARDS.map((standard) => (
                <div
                  key={standard}
                  className="flex items-start gap-2.5 rounded-2xl bg-card border border-border/60 p-3 shadow-2xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {standard}
                  </span>
                </div>
              ))}
            </m.div>
          </m.div>

          {/* Right Column: Timeline Card */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)] space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Our Journey</h3>
                  <p className="text-[11px] text-muted-foreground">From Vision to Pioneer</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                Milestones
              </span>
            </div>

            <div className="space-y-6 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative space-y-1">
                  <span className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-amber-500 bg-background" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-500 font-mono">
                      {item.year}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={ROUTES.PRODUCTS}
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-secondary/80 hover:bg-secondary py-2.5 text-xs font-bold text-foreground transition-all duration-200 group"
              >
                <span>Browse Official Inventory</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
              </Link>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
