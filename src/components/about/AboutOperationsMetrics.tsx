"use client";

import React from "react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./aboutAnimations";
import { AnimatedStatNumber } from "./AnimatedStatNumber";

const ENTERPRISE_METRICS = [
  {
    target: 100,
    prefix: "",
    suffix: "%",
    formatComma: false,
    label: "Authorized Channel Sourcing",
    detail: "Official distributor contracts, no unofficial parallel imports",
    accent: "text-amber-500",
  },
  {
    target: 64,
    prefix: "",
    suffix: " Districts",
    formatComma: false,
    label: "Nationwide Hub Reach",
    detail: "Dedicated express secure logistics across all divisions",
    accent: "text-blue-500",
  },
  {
    target: 24,
    prefix: "<",
    suffix: "h",
    formatComma: false,
    label: "Dhaka Central Metro Dispatch",
    detail: "Average processing to door transit in capital territory",
    accent: "text-emerald-500",
  },
  {
    target: 99.8,
    prefix: "",
    suffix: "%",
    formatComma: false,
    label: "Fulfillment Accuracy",
    detail: "Double barcode inspection against brand database",
    accent: "text-purple-500",
  },
];

export function AboutOperationsMetrics() {
  return (
    <section className="border-b border-border/60 bg-muted/20 py-10 sm:py-14">
      <div className="container px-4 sm:px-6">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {ENTERPRISE_METRICS.map((metric) => (
            <m.div
              key={metric.label}
              variants={itemVariants}
              className="rounded-2xl bg-card border border-border/70 p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${metric.accent}`}>
                  <AnimatedStatNumber
                    target={metric.target}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    formatComma={metric.formatComma}
                  />
                </span>
                <h2 className="text-sm font-bold text-foreground mt-2">
                  {metric.label}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {metric.detail}
                </p>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
