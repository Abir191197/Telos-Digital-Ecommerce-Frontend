"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  Database,
  Eye,
  Share2,
  Server,
  UserCheck,
  HelpCircle,
  Mail,
  PhoneCall,
  FileText,
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

export function PrivacyContentSections() {
  return (
    <main className="lg:col-span-8 space-y-6 sm:space-y-8">
      {/* Section 1: Overview */}
      <m.section
        id="overview"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 01
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Introduction & Platform Governance
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Scope
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            At <strong className="text-foreground font-semibold">Telos Cart</strong> (a venture operated by <strong className="text-foreground font-semibold">Telos Digital Ltd.</strong>), we respect and fiercely protect customer privacy. This Privacy Policy outlines the categories of personal data gathered when you visit our storefront, place orders, utilize parcel tracking, or interface with our customer support teams across Bangladesh.
          </p>
          <p>
            Our data management protocols operate in compliance with the <strong className="text-foreground font-semibold">Information and Communication Technology (ICT) Act 2006</strong> and the <strong className="text-foreground font-semibold">Digital Security Guidelines</strong> of Bangladesh. By utilizing Telos Cart services, you acknowledge the terms outlined in this document.
          </p>
          <div className="rounded-xl sm:rounded-2xl bg-muted/40 dark:bg-zinc-800/40 border border-border/60 p-3.5 sm:p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Entity Commitment</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              We treat every order detail, customer delivery address, and communication log with strict commercial confidentiality. We do not monetize, rent, or trade your personal information.
            </p>
          </div>
        </div>
      </m.section>

      {/* Section 2: Data Collection */}
      <m.section
        id="data-collection"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 02
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Personal Information We Collect
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Collection
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            To ensure seamless nationwide e-commerce fulfillment, we gather specific categories of information based on your interactions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">1. Contact Identity</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Full name, verified Bangladeshi phone number (+880), active email address.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">2. Shipping Destination</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Street address, district, thana/upazila, and local delivery drop points.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 dark:bg-zinc-800/30 p-3 sm:p-3.5 space-y-1">
              <span className="text-xs font-bold text-foreground block">3. Transaction History</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Purchased SKUs, order totals, COD tokens, and invoice download receipts.
              </p>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-muted-foreground">
            <strong className="text-foreground">Sensitive Financial Data:</strong> We never record card numbers, CVVs, or mobile banking PINs. All payment transactions take place securely on SSLCOMMERZ encrypted checkout gateways.
          </p>
        </div>
      </m.section>

      {/* Section 3: Data Usage */}
      <m.section
        id="data-usage"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 03
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                How We Utilize Customer Information
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Processing
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            All collected customer information is processed exclusively for valid commercial purposes:
          </p>
          <ul className="space-y-2 sm:space-y-2.5 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Logistics Execution:</strong> Disagreeing parcels to courier dispatch hubs and coordinating doorstep arrival across 64 districts.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Real-Time Courier SMS:</strong> Sending automated dispatch status updates, tracking numbers, and delivery PIN codes to your mobile device.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Warranty & Returns Verification:</strong> Validating IMEI numbers, serial codes, and purchase dates for official brand servicing.
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 4: Third-Party Disclosures */}
      <m.section
        id="third-party-sharing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 04
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Third-Party Disclosures & Courier Partners
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Partners
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            We never sell, rent, or trade your contact records with third-party advertisers. Information is disclosed strictly to trusted service partners under non-disclosure contracts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 dark:bg-zinc-800/30 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Logistics Carriers</span>
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">Delivery Only</span>
              </div>
              <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Steadfast, Pathao, RedX, and eCourier receive only recipient names, phone numbers, and destination addresses for delivery completion.
              </p>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 dark:bg-zinc-800/30 p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Payment Gateways</span>
                <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">PCI-DSS Certified</span>
              </div>
              <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                SSLCOMMERZ facilitates card & MFS transactions through encrypted channels authorized by Bangladesh Bank.
              </p>
            </div>
          </div>
        </div>
      </m.section>

      {/* Section 5: Security Measures */}
      <m.section
        id="security-measures"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Server className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 05
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Storage, Encryption & Cyber Security
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Protection
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            Telos Cart implements defense-in-depth infrastructure safeguards to protect customer databases from unauthorized intrusion, data breaches, or loss:
          </p>
          <ul className="space-y-2 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">End-to-End SSL/TLS Encryption:</strong> All network sessions between your browser and Telos Cart are guarded with modern 256-bit certificates.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Role-Based Access Control:</strong> Internal team access to customer records is restricted based on operational necessity and protected by multi-factor authentication (MFA).
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 6: User Rights */}
      <m.section
        id="user-rights"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardScrollVariants}
        className="scroll-mt-24 sm:scroll-mt-28 rounded-2xl sm:rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Section 06
              </span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                Your Rights & Account Data Management
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Control
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            Every customer registered on Telos Cart retains autonomy over their personal profile:
          </p>
          <ul className="space-y-2 sm:space-y-2.5 pl-1">
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Profile Review & Updates:</strong> You can edit phone numbers, secondary shipping addresses, and full names via your <Link href={ROUTES.ACCOUNT} className="text-amber-600 dark:text-amber-400 underline font-semibold">Account Dashboard</Link>.
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 sm:mt-2 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Right to Deletion:</strong> You can request permanent erasure of your account and personal identifiers by contacting our data protection team, subject to mandatory tax retention regulations under Bangladesh revenue law.
              </span>
            </li>
          </ul>
        </div>
      </m.section>

      {/* Section 7: Privacy Officer */}
      <m.section
        id="contact-officer"
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
                Privacy Officer & Support Concierge
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
            Support
          </span>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <p>
            Have questions or concerns about how your data is handled? Reach out directly to our compliance officers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="mailto:privacy@teloscart.com"
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 dark:bg-zinc-800/60 p-3.5 sm:p-4 transition-all hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="flex items-center justify-between">
                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2.5 sm:mt-3">
                <span className="text-xs font-bold text-foreground block">Privacy Desk</span>
                <span className="text-[11px] text-muted-foreground truncate block">privacy@teloscart.com</span>
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
              href={ROUTES.TERMS}
              className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-background/80 dark:bg-zinc-800/60 p-3.5 sm:p-4 transition-all hover:border-amber-500/50 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <div className="flex items-center justify-between">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="mt-2.5 sm:mt-3">
                <span className="text-xs font-bold text-foreground block">Store Terms</span>
                <span className="text-[11px] text-muted-foreground truncate block">View Terms & Conditions</span>
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
          href={ROUTES.TERMS}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 py-2 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Review Terms & Conditions</span>
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
