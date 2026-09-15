"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "./contactAnimations";

const FAQS = [
  {
    q: "How fast will my order arrive in Dhaka vs outside Dhaka?",
    a: "Within Dhaka Metropolitan Area, express orders are delivered within 24 to 48 hours. Nationwide deliveries across all 64 districts arrive within 48 to 72 hours via premium courier networks with milestone tracking.",
  },
  {
    q: "Are devices guaranteed 100% authentic with warranty?",
    a: "Yes. Every single smartphone, laptop, audio device, and gadget is sourced exclusively from official authorized regional brand distributors with valid manufacturer warranty coverage across Bangladesh.",
  },
  {
    q: "How do I claim a return or refund under the 7-day guarantee?",
    a: "If you detect a manufacturing defect or receive a mismatched product, simply message our WhatsApp desk or hotline within 7 days. We dispatch a doorstep courier pickup and process immediate replacement or digital refund.",
  },
  {
    q: "What payment methods are supported on Telos Cart?",
    a: "We support Cash on Delivery (COD), bKash, Nagad, Rocket, Upay, as well as VISA, MasterCard, and American Express cards secured via SSLCOMMERZ 256-bit encryption.",
  },
  {
    q: "Can I inspect the package before paying the courier?",
    a: "Yes. For Cash on Delivery orders, you may inspect the external security seal and outer package integrity in the presence of the courier rider before handing over payment.",
  },
];

export function ContactFaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section className="container px-4 sm:px-6 py-14 sm:py-20">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <m.div variants={itemVariants} className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
            Help & Clarifications
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything you need to know about deliveries, payment channels, and official warranties.
          </p>
        </m.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <m.div
                key={faq.q}
                variants={itemVariants}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-foreground hover:text-amber-500 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 pr-2">
                    <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-amber-500"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </m.div>
            );
          })}
        </div>
      </m.div>
    </section>
  );
}
