"use client";

import React from "react";
import { CheckCircle2, QrCode, ShieldCheck, Box, Truck } from "lucide-react";
import { m } from "framer-motion";
import { containerVariants, itemVariants } from "./aboutAnimations";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Authorized Intake",
    subtitle: "Manufacturer Depots",
    icon: ShieldCheck,
    desc: "Shipments arrive exclusively through customs-cleared authorized regional brand channels with certified commercial documentation.",
  },
  {
    step: "02",
    title: "IMEI & Serial Audit",
    subtitle: "Database Verification",
    icon: QrCode,
    desc: "Every unit barcode is checked against official manufacturer registry databases to confirm genuine brand authenticity and active warranty status.",
  },
  {
    step: "03",
    title: "Tamper-Proof Sealing",
    subtitle: "Security Holograms",
    icon: CheckCircle2,
    desc: "Device packaging is visually inspected. Official factory shrink-wraps and holographic security stickers must be 100% untampered.",
  },
  {
    step: "04",
    title: "Cushioned Fulfillment",
    subtitle: "Shockproof Enclosure",
    icon: Box,
    desc: "Orders are secured in multi-layered air cushioning and heavy-gauge corrugated cartons designed to withstand regional transport transit.",
  },
  {
    step: "05",
    title: "Chain-of-Custody Dispatch",
    subtitle: "Live Barcode Tracking",
    icon: Truck,
    desc: "Express couriers collect parcels under individual tracking consignment IDs, updating customer SMS and portal logs every kilometer to door.",
  },
];

export function AboutInspectionPipeline() {
  return (
    <section className="container px-4 sm:px-6 py-14 sm:py-20 border-b border-border/60">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="space-y-12"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Standard Operating Procedure
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            5-Stage Authenticity Protocol
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            How Telos Cart eliminates retail tampering and delivers flawless factory-fresh consumer electronics.
          </p>
        </div>

        {/* Pipeline Horizontal Flow on Large, Vertical on Small */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <m.div
                key={step.title}
                variants={itemVariants}
                className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-border transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      {step.step}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground font-mono flex items-center justify-between">
                  <span>QA Stage {idx + 1}/5</span>
                  <span className="text-emerald-500 font-semibold">Passed</span>
                </div>
              </m.div>
            );
          })}
        </div>
      </m.div>
    </section>
  );
}
