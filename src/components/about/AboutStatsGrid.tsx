"use client";

import React from "react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./aboutAnimations";
import { AnimatedStatNumber } from "./AnimatedStatNumber";

const STATS = [
  {
    target: 100,
    prefix: "",
    suffix: "%",
    formatComma: false,
    label: "Genuine Authenticity",
    detail: "Official brand seals & serial verification",
    gradient: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-500",
  },
  {
    target: 50000,
    prefix: "",
    suffix: "+",
    formatComma: true,
    label: "Satisfied Customers",
    detail: "Tech creators, pros & enthusiasts",
    gradient: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
  },
  {
    target: 24,
    prefix: "",
    suffix: "-48h",
    formatComma: false,
    label: "Express Courier",
    detail: "Swift Dhaka metro & 64 districts hub",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-500",
  },
  {
    target: 7,
    prefix: "",
    suffix: " Days",
    formatComma: false,
    label: "Hassle-Free Return",
    detail: "Doorstep pickup & direct refund",
    gradient: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-500",
  },
];

export function AboutStatsGrid() {
  return (
    <section className="border-b border-border/60 bg-muted/20 py-8 sm:py-12">
      <div className="container px-4 sm:px-6">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS.map((stat) => (
            <m.div
              key={stat.label}
              variants={itemVariants}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border border-border/60 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />
              <div className="relative z-10">
                <span className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.accent}`}>
                  <AnimatedStatNumber
                    target={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    formatComma={stat.formatComma}
                  />
                </span>
                <h2 className="text-sm sm:text-base font-bold text-foreground mt-1">
                  {stat.label}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {stat.detail}
                </p>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
