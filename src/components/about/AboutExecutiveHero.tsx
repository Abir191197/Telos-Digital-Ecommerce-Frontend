"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Building2, ArrowRight, FileCheck2, Award } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";
import { containerVariants, itemVariants } from "./aboutAnimations";

const CREDENTIALS = [
  {
    icon: Building2,
    title: "Registered Legal Entity",
    subtitle: "Telos Digital Commerce Ltd. · Dhaka",
  },
  {
    icon: FileCheck2,
    title: "BTRC & Customs Compliant",
    subtitle: "100% Legal Import Documentation",
  },
  {
    icon: ShieldCheck,
    title: "Tier-1 Distributor Network",
    subtitle: "Direct Authorized Regional Supply",
  },
  {
    icon: Award,
    title: "Manufacturer Warranties",
    subtitle: "Direct Service Center Claims",
  },
];

export function AboutExecutiveHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-background via-muted/15 to-background py-16 sm:py-24">
      {/* Subtle grid background for high-tech institutional look */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 -z-10"
      />

      <div className="container px-4 sm:px-6">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-7"
        >
          {/* Institutional Badge */}
          <m.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Corporate Overview & Official Governance</span>
            </div>
          </m.div>

          {/* Heading */}
          <m.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]"
          >
            Setting the Benchmark for Authentic Tech Commerce in Bangladesh.
          </m.h1>

          {/* Mission Subtitle */}
          <m.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal"
          >
            Telos Digital Commerce operates as an authorized premier tech supply bridge, connecting verified global consumer electronics manufacturers to individuals, professionals, and enterprise fleets across Bangladesh with uncompromising warranty governance.
          </m.p>

          {/* Corporate CTA Actions */}
          <m.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-98 transition-all"
            >
              <span>Explore Verified Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.BRANDS}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/80 active:scale-98 transition-all"
            >
              <span>Authorized Brand Partners</span>
            </Link>
          </m.div>

          {/* Enterprise Credential Badges */}
          <m.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 text-left border-t border-border/60"
          >
            {CREDENTIALS.map((cred) => {
              const Icon = cred.icon;
              return (
                <div
                  key={cred.title}
                  className="rounded-2xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-amber-500/30"
                >
                  <Icon className="h-5 w-5 text-amber-500 mb-2.5" />
                  <p className="text-xs font-bold text-foreground leading-snug">
                    {cred.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    {cred.subtitle}
                  </p>
                </div>
              );
            })}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
