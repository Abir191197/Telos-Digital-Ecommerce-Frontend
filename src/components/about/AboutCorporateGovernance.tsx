"use client";

import React from "react";
import { Scale, Users2, Landmark, Check } from "lucide-react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./aboutAnimations";

const RIGHTS = [
  "Complete disclosure of regional warranty terms before checkout",
  "Explicit indication of official distributor vs brand international warranty",
  "Right to inspect sealed packaging condition prior to cash on delivery sign-off",
  "Dedicated concierge support for manufacturer warranty claim escalation",
  "Zero undisclosed hidden duties, carrier surcharges, or payment gateway fees",
];

const B2B_SOLUTIONS = [
  "Enterprise hardware fleet supply for corporate startups and IT setups",
  "Official VAT Challan (Mushak 6.3) issued with tax compliance",
  "Bulk serial registration for institutional asset management",
  "Priority warranty RMA turnaround for commercial client accounts",
];

export function AboutCorporateGovernance() {
  return (
    <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >
        {/* Left: Consumer Protection Charter */}
        <m.div
          variants={itemVariants}
          className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Consumer Protection Charter
              </h3>
              <p className="text-xs text-muted-foreground">
                Our Institutional Commitment to Every Buyer
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            In an electronics market filled with deceptive refurbished tags and unauthorized repairs, Telos Cart adheres strictly to consumer transparency laws and distributor ethics.
          </p>

          <div className="space-y-3">
            {RIGHTS.map((right) => (
              <div key={right} className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{right}</span>
              </div>
            ))}
          </div>
        </m.div>

        {/* Right: Institutional & Enterprise Fleet Services */}
        <m.div
          variants={itemVariants}
          className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Enterprise & Institutional Procurement
              </h3>
              <p className="text-xs text-muted-foreground">
                B2B Hardware Supply, Laptops & Workstations
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We supply high-growth tech firms, creative agencies, and financial institutions across Dhaka with bulk workstations, MacBooks, developer monitors, and enterprise peripherals.
          </p>

          <div className="space-y-3">
            {B2B_SOLUTIONS.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs text-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Need bulk company procurement?</span>
            <span className="font-semibold text-foreground">corporate@teloscart.com</span>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
