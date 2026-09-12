"use client";

import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";

const trustContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const trustItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 280,
    },
  },
};

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    desc: "Direct authorized warranty across Bangladesh",
  },
  {
    icon: Truck,
    title: "Fast Express Delivery",
    desc: "Within 24h in Dhaka, 48h nationwide",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Return",
    desc: "Instant replacement & verified refund guarantee",
  },
  {
    icon: Headphones,
    title: "Dedicated BD Support",
    desc: "9 AM - 10 PM daily hotline & prompt chat",
  },
];

export function TrustBadgesSection() {
  return (
    <LazyMotion features={domAnimation}>
      <section aria-label="Customer Guarantees" className="w-full">
        <div className="rounded-3xl bg-card p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
          <m.div
            variants={trustContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/40"
          >
            {TRUST_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.title}
                  variants={trustItemVariants}
                  className={`group flex items-start gap-3 transition-transform duration-200 hover:-translate-y-0.5 ${idx > 0 ? "pt-3 sm:pt-0 sm:pl-4" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-zinc-950 shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
