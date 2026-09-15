"use client";

import React from "react";
import { ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./aboutAnimations";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Authenticity",
    tag: "Zero Counterfeits",
    tagColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    iconBg: "bg-emerald-500 text-white",
    cardGlow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.22)]",
    description:
      "We source directly from manufacturer-authorized regional distributors. Every device carries verifiable serials, pristine retail seals, and valid distributor warranties across Bangladesh.",
  },
  {
    icon: Truck,
    title: "Nationwide Express Logistics",
    tag: "64 Districts",
    tagColor: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-500 text-white",
    cardGlow: "group-hover:border-blue-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.22)]",
    description:
      "Integrated with high-speed logistics channels with protective air-cushioned packaging. Live SMS tracking and dispatch alerts keep you in command of your order every kilometer.",
  },
  {
    icon: Headphones,
    title: "Dedicated Human Support",
    tag: "9 AM - 10 PM",
    tagColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-500 text-white",
    cardGlow: "group-hover:border-amber-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.22)]",
    description:
      "No automated robotic runarounds. Our bilingual customer experience team provides tailored hardware advice, compatibility checks, and instant after-sales warranty claim guidance.",
  },
  {
    icon: RotateCcw,
    title: "Transparent Return & Refund",
    tag: "Zero Friction",
    tagColor: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
    iconBg: "bg-purple-500 text-white",
    cardGlow: "group-hover:border-purple-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.22)]",
    description:
      "If you experience a genuine technical fault or non-conformance within 7 days, our team arranges immediate doorstep replacement or instantaneous reversal to your bKash, Nagad, or bank card.",
  },
];

export function AboutPillarsGrid() {
  return (
    <section className="container px-4 sm:px-6 py-14 sm:py-20">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-10"
      >
        <m.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
            Core Foundations
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Why Consumers Trust Telos Cart
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We believe that purchasing high-end tech should be secure, transparent, and completely delightful.
          </p>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <m.div
                key={pillar.title}
                variants={itemVariants}
                className={`group relative flex flex-col justify-between rounded-3xl bg-card border border-border/70 p-6 sm:p-7 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300 ${pillar.cardGlow}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-105 ${pillar.iconBg}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${pillar.tagColor}`}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </m.div>
    </section>
  );
}
