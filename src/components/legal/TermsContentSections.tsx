"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Mail,
  PhoneCall,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { m, type Variants } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardScrollVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeCurve,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeCurve,
    },
  },
};

export function TermsContentSections() {
  return (
    <main className="lg:col-span-8 space-y-6 sm:space-y-8">
      {/* Section 1: Agreement to Terms */}
      <m.section
        id="agreement"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 01
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Agreement to Terms & Legal Framework
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Binding
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            By accessing, browsing, registering an account, or purchasing merchandise through <strong className="text-foreground font-semibold">Telos Cart</strong> (an e-commerce platform operated by <strong className="text-foreground font-semibold">Telos Digital Ltd.</strong>), you confirm that you have read, comprehended, and unconditionally agreed to be governed by these Terms & Conditions.
          </p>
          <p>
            These terms are established in full alignment with the <strong className="text-foreground font-semibold">Digital Commerce Operation Guidelines 2021</strong> and the <strong className="text-foreground font-semibold">Consumer Rights Protection Act 2009</strong> of the People’s Republic of Bangladesh. If you do not consent to any part of these operational guidelines, you must discontinue platform usage immediately.
          </p>
          <div className="rounded-xl sm:rounded-2xl bg-muted/40 dark:bg-zinc-800/40 border border-border/60 p-3.5 sm:p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Eligibility & Legal Capacity</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              You must be at least 18 years of age or possess legal parental/guardian authority under Bangladesh Contract Law to enter into binding financial transactions or execute Cash on Delivery agreements.
            </p>
          </div>
        </div>
      </m.section>

      {/* Section 2: Orders & Pricing */}
      <m.section
        id="pricing-orders"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 02
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Orders, Inventory & BDT Pricing
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Financial
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            All listed retail prices are quoted strictly in <strong className="text-foreground font-semibold">Bangladeshi Taka (BDT / ৳)</strong> and are inclusive of standard Value Added Tax (VAT) unless explicitly stated otherwise on specific commercial invoices.
          </p>
          <ul className="space-y-2 sm:space-y-2.5 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Order Acceptance:</strong> Receiving an electronic order confirmation email or automated SMS does not signify our final acceptance. Telos Cart reserves the legal right to decline, adjust, or cancel orders due to stock depletion, technical pricing errors, or fraud detection flags.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Sudden Price Corrections:</strong> In rare cases where an item is accidentally priced incorrectly due to human or technical glitches, our concierge will notify the buyer prior to dispatch to either approve the revised invoice or process an instant full refund.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Advance Payment Verification:</strong> For high-value electronics and custom pre-orders, Telos Cart may request partial confirmation advance via secure MFS gateways (bKash, Nagad) or bank cards via SSLCOMMERZ.
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 3: Shipping & Delivery */}
      <m.section
        id="shipping-dispatch"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 03
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Shipping & Nationwide Delivery Timelines
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Logistics
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            We partner with premier logistics networks (Steadfast, Pathao, RedX, eCourier) to provide rapid door-to-door transit spanning all 64 districts in Bangladesh.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 dark:bg-zinc-800/30 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Dhaka Metropolitan</span>
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">24 – 48 Hours</span>
              </div>
              <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Same-day dispatch available for orders confirmed before 2:00 PM. Express doorstep courier delivery.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 dark:bg-zinc-800/30 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Outside Dhaka (Nationwide)</span>
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">48 – 72 Hours</span>
              </div>
              <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Full district hub coverage with live SMS status alerts and door parcel verification.
              </p>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 p-3.5 sm:p-4">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Critical Package Inspection Guideline</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-800/90 dark:text-amber-200/90 mt-1 leading-relaxed">
              Customers must visually inspect the exterior tamper-evident security tape before accepting receipt. If the security seal appears broken, pierced, or crushed, refuse the shipment immediately and notify Telos Cart Dispatch Concierge.
            </p>
          </div>
        </div>
      </m.section>

      {/* Section 4: Return & Replacement */}
      <m.section
        id="returns-replacements"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 04
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                7-Day Return & Replacement Policy
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Buyer Protection
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            We stand behind authentic customer satisfaction. Customers can request a reverse replacement or refund within <strong className="text-foreground font-semibold">7 calendar days</strong> from doorstep delivery under the following conditions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">1. Transit Damage</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Physical defect or crushed enclosure evident right upon unboxing.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">2. Model Mismatch</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Color, variant, or hardware specs differ from catalog invoice.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">3. Dead On Arrival</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Device refuses to power on due to verifiable factory defect.
              </p>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-muted-foreground">
            <strong className="text-foreground">Required Conditions:</strong> Merchandise must be returned with complete original packaging, intact barcodes/IMEI stickers, all bundled cables, user manuals, and free gifts. Returns with missing serial stickers will be disqualified.
          </p>
        </div>
      </m.section>

      {/* Section 5: Official Warranty */}
      <m.section
        id="warranty-service"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 05
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Official Brand Warranty & Servicing
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Official
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            All brand-flagged electronics sold on Telos Cart carry <strong className="text-foreground font-semibold">100% genuine manufacturer warranties</strong> backed by verified regional brand representatives in Bangladesh.
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Authorized Service Centers:</strong> Buyers may present their digital Telos Cart invoice directly to official brand repair facilities (e.g. Apple, Samsung, Xiaomi, Anker authorized centers) across Dhaka, Chattogram, Sylhet, and other metropolitan hubs.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Void Warranties:</strong> Physical water immersion, third-party unapproved motherboard tampering, unauthorized software jailbreaking, or crushed displays are excluded from warranty repair under brand standards.
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 6: User Conduct */}
      <m.section
        id="user-obligations"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 06
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                User Conduct & Fair Use Obligations
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Conduct
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            To safeguard both authentic buyers and verified merchants across Bangladesh, platform members must adhere to fair usage standards:
          </p>
          <ul className="space-y-2 sm:space-y-2.5 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Accurate Delivery Credentials:</strong> Providing active Bangladeshi mobile numbers capable of receiving courier phone calls and SMS OTPs is strictly required.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Repeated COD Refusals:</strong> Customers who intentionally refuse cash-on-delivery parcels at the doorstep without valid physical defect cause may have COD privileges suspended and will be required to pre-pay future orders.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Prohibition of Bot Automations:</strong> Scraping prices or utilizing unauthorized checkout bot scripts is strictly forbidden and subject to automated IP restriction.
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 7: Dispute Concierge */}
      <m.section
        id="support-concierge"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card dark:from-amber-500/10 dark:via-zinc-900/90 dark:to-zinc-900/90 backdrop-blur-xl p-4 sm:p-8 shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/30">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 07
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Dispute Concierge & Customer Care
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Support
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            Have questions about an ongoing order, delivery checkpoint, or return authorization? Our Dhaka concierge team is available to assist you 7 days a week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="mailto:support@teloscart.com"
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 dark:bg-zinc-800/60 p-3.5 sm:p-4 transition-all hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="flex items-center justify-between">
                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2.5 sm:mt-3">
                <span className="text-xs font-bold text-foreground block">Email Support</span>
                <span className="text-[11px] text-muted-foreground truncate block">support@teloscart.com</span>
              </div>
            </Link>

            <Link
              href="tel:+8809612345678"
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 dark:bg-zinc-800/60 p-3.5 sm:p-4 transition-all hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="flex items-center justify-between">
                <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2.5 sm:mt-3">
                <span className="text-xs font-bold text-foreground block">Hotline Care</span>
                <span className="text-[11px] text-muted-foreground truncate block">+880 9612-345678</span>
              </div>
            </Link>

            <Link
              href={ROUTES.TRACK_ORDER}
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 dark:bg-zinc-800/60 p-3.5 sm:p-4 transition-all hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="flex items-center justify-between">
                <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="mt-2.5 sm:mt-3">
                <span className="text-xs font-bold text-foreground block">Live Tracking</span>
                <span className="text-[11px] text-muted-foreground truncate block">Check parcel status</span>
              </div>
            </Link>
          </div>
        </div>
      </m.section>

      {/* Bottom Quick Navigation Strip */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/60"
      >
        <Link
          href={ROUTES.PRIVACY_POLICY}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 py-2 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Review Privacy Policy</span>
        </Link>

        <Link
          href={ROUTES.HOME}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-black px-6 py-2.5 text-xs shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <span>Return to Shopping</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </Link>
      </m.div>
    </main>
  );
}
