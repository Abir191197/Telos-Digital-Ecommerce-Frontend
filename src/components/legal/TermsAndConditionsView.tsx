"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Scale,
  CreditCard,
  Truck,
  RotateCcw,
  AlertTriangle,
  HelpCircle,
  Mail,
  PhoneCall,
  FileText,
  Search,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation } from "framer-motion";

interface TermsClause {
  id: string;
  category: string;
  title: string;
  icon: React.ElementType;
  tag: string;
  summary: string;
  clauses: {
    title: string;
    description: string;
    keyPoints?: string[];
  }[];
}

const TERMS_DATA: TermsClause[] = [
  {
    id: "agreement",
    category: "Legal Framework",
    title: "1. Agreement to Terms & Statutory Framework",
    icon: Scale,
    tag: "Binding Contract",
    summary:
      "Contractual adherence under Bangladesh Digital Commerce Operation Guidelines 2021 & Consumer Rights Protection Act 2009.",
    clauses: [
      {
        title: "Platform Ownership & Scope",
        description:
          "By accessing, creating an account, or purchasing merchandise on Telos Cart (operated by Telos Digital Commerce Ltd.), you unconditionally accept to be governed by these Terms & Conditions.",
      },
      {
        title: "Eligibility & Capacity to Contract",
        description:
          "You must be at least 18 years of age or possess legal parental authority under Bangladesh Contract Law to execute binding transactions or Cash on Delivery (COD) orders.",
        keyPoints: [
          "Mandatory accuracy of submitted contact credentials (+880 phone & address)",
          "Strict prohibition of automated bot orders or artificial scraping",
          "Compliance with consumer trade directives of the Ministry of Commerce",
        ],
      },
    ],
  },
  {
    id: "pricing-orders",
    category: "Commercial Terms",
    title: "2. Orders, Inventory & BDT Pricing",
    icon: CreditCard,
    tag: "Taxes & Payments",
    summary:
      "All product pricing, tax inclusions, payment channels, and order cancellation clauses.",
    clauses: [
      {
        title: "Pricing Transparency & VAT",
        description:
          "All prices listed on Telos Cart are denominated in Bangladeshi Taka (BDT) and inclusive of statutory Value Added Tax (VAT) under National Board of Revenue rules unless explicitly marked otherwise.",
      },
      {
        title: "Payment Channels & Verification",
        description:
          "We accept Cash on Delivery (COD) nationwide, alongside SSLCOMMERZ gateway payments (bKash, Nagad, Rocket, Upay, VISA, MasterCard, Amex). Prepaid orders receive instant digital confirmation.",
      },
      {
        title: "Order Cancellation & Stock Outages",
        description:
          "In the rare event of inventory discrepancy or manufacturer recall, Telos Cart reserves the right to void an order and initiate an immediate 100% refund to the original payment channel within 48 hours.",
      },
    ],
  },
  {
    id: "shipping-dispatch",
    category: "Logistics",
    title: "3. Shipping, Delivery & Doorstep Inspection",
    icon: Truck,
    tag: "64 Districts Reach",
    summary:
      "Transit timeframes across Dhaka metro and divisional hubs, delivery PIN security, and buyer inspection rights.",
    clauses: [
      {
        title: "Delivery Turnaround Times",
        description:
          "Dhaka Metropolitan orders are dispatched within 24 to 48 hours. Nationwide deliveries spanning all 64 districts arrive within 48 to 72 hours via premium courier networks with milestone SMS updates.",
      },
      {
        title: "Pre-Payment Security Inspection",
        description:
          "For Cash on Delivery orders, you are entitled to inspect external security seal integrity and parcel conditions in the presence of the delivery rider prior to handing over payment.",
        keyPoints: [
          "Factory tamper-evident holographic seal must be intact",
          "Box barcode & serial must match SMS dispatch advisory",
          "Immediate refusal allowed if external carton shows severe transit damage",
        ],
      },
    ],
  },
  {
    id: "returns-replacements",
    category: "Buyer Protection",
    title: "4. 7-Day Return & Replacement Policy",
    icon: RotateCcw,
    tag: "Doorstep Pickup",
    summary:
      "Fault verification, unboxing evidence protocols, and direct reverse logistics.",
    clauses: [
      {
        title: "7-Day Replacement Guarantee",
        description:
          "If a product arrives dead on arrival (DOA), defective, or misaligned with advertised specifications, submit an RMA claim within 7 calendar days of physical delivery.",
      },
      {
        title: "Mandatory Unboxing Video Protocol",
        description:
          "For premium devices (smartphones, laptops, precision audio), a clear, uninterrupted video recording of box seal opening and initial boot-up serves as immediate proof for claim approval.",
      },
      {
        title: "Reversal & Refund Timelines",
        description:
          "Approved returns initiate doorstep courier pickup. Digital refunds to bKash, Nagad, or bank accounts are cleared within 3 to 5 business days following technical warehouse verification.",
      },
    ],
  },
  {
    id: "warranty-service",
    category: "Warranty SLAs",
    title: "5. Official Brand Warranty & Servicing",
    icon: ShieldCheck,
    tag: "Authorized Service Centers",
    summary:
      "IMEI database warranty coverage, authorized brand repair networks, and exclusions.",
    clauses: [
      {
        title: "Authorized Regional Distribution Warranty",
        description:
          "Every device carries authentic manufacturer warranty coverage valid across official brand service centers in Bangladesh (e.g., Apple, Samsung, Sony, Asus, Xiaomi).",
      },
      {
        title: "Warranty Exclusions",
        description:
          "Manufacturer warranties do not cover accidental liquid immersion, physical cracked screen damage, unauthorized hardware tampering, or software flashing non-official ROMs.",
      },
    ],
  },
  {
    id: "disputes-liability",
    category: "Legal Framework",
    title: "6. Limitation of Liability & Dispute Arbitration",
    icon: AlertTriangle,
    tag: "Jurisdiction Dhaka",
    summary:
      "Limitation caps, force majeure exclusions, and legal venue governing commercial disputes.",
    clauses: [
      {
        title: "Liability Cap",
        description:
          "To the maximum extent permitted by Bangladesh law, Telos Cart's aggregate liability for any order shall not exceed the actual purchase price paid for the specific item in dispute.",
      },
      {
        title: "Arbitration & Governing Law",
        description:
          "Any unresolved commercial dispute shall be referred to amicable settlement first, and failing that, submitted to arbitration in Dhaka under the Arbitration Act 2001 of Bangladesh.",
      },
    ],
  },
  {
    id: "support-desk",
    category: "Support",
    title: "7. Customer Care & Store Support Desks",
    icon: HelpCircle,
    tag: "Direct Assistance",
    summary:
      "Direct communication lines for legal escalations, dispute inquiries, and consumer queries.",
    clauses: [
      {
        title: "Official Communication Channels",
        description:
          "For any inquiry concerning these Terms & Conditions or order disputes, contact our dedicated legal and support desk during business hours.",
      },
    ],
  },
];

export default function TermsAndConditionsView() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-amber-500 selection:text-zinc-950">
        {/* Minimal Breadcrumb & Regulatory Compliance Bar */}
        <div className="border-b border-border/60 bg-muted/20 py-3">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <Link
                  href={ROUTES.HOME}
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-border" />
                <span className="font-semibold text-foreground">
                  Terms & Conditions
                </span>
              </nav>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Digital Commerce Guidelines 2021
                </span>
                <span>•</span>
                <span>Jurisdiction: Dhaka, BD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Body Flow */}
        <div className="container px-4 sm:px-6 max-w-5xl mx-auto pt-10 sm:pt-14 space-y-12">
          {TERMS_DATA.map((section) => {
              const IconComponent = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-6"
                >
                  {/* Article Heading */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                          {section.category}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <span className="inline-flex self-start sm:self-auto text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-md">
                      {section.tag}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {section.summary}
                  </p>

                  {/* Clause Sub-items */}
                  <div className="space-y-4 pt-2">
                    {section.clauses.map((clause) => (
                      <div
                        key={clause.title}
                        className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2"
                      >
                        <h3 className="text-xs sm:text-sm font-bold text-foreground">
                          {clause.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {clause.description}
                        </p>

                        {clause.keyPoints && (
                          <ul className="space-y-1.5 pt-2">
                            {clause.keyPoints.map((point) => (
                              <li
                                key={point}
                                className="flex items-start gap-2 text-xs text-foreground"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}

          {/* Legal Compliance & Support Desk Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Customer Support & Legal Concierge
              </span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Questions Regarding Terms & Orders
              </h3>
              <p className="text-xs text-muted-foreground">
                Our support desk is accessible daily to resolve order disputes, warranty inquiries, or return questions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <Link
                href="mailto:support@teloscart.com"
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Support Desk</span>
                  <span className="text-muted-foreground text-[11px] truncate block">
                    support@teloscart.com
                  </span>
                </div>
              </Link>

              <Link
                href="tel:+880961000000"
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Customer Care</span>
                  <span className="text-muted-foreground text-[11px] block">
                    +880 9610-000000
                  </span>
                </div>
              </Link>

              <Link
                href={ROUTES.PRIVACY_POLICY}
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Privacy Policy</span>
                  <span className="text-muted-foreground text-[11px] block">
                    Data & Security Protocol
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
