"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Share2,
  Server,
  UserCheck,
  HelpCircle,
  ExternalLink,
  PhoneCall,
  Mail,
  FileText,
  Search,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m } from "framer-motion";

interface PolicyClause {
  id: string;
  category: string;
  title: string;
  icon: React.ElementType;
  tag: string;
  lastUpdated: string;
  summary: string;
  clauses: {
    title: string;
    description: string;
    keyPoints?: string[];
  }[];
}

const POLICY_DATA: PolicyClause[] = [
  {
    id: "governance",
    category: "Legal Framework",
    title: "1. Institutional Governance & Regulatory Compliance",
    icon: Lock,
    tag: "Entity & Jurisdiction",
    lastUpdated: "Sept 2026",
    summary:
      "Operational mandate, legal entity registration in Bangladesh, and compliance with national cybersecurity standards.",
    clauses: [
      {
        title: "Operating Entity",
        description:
          "Telos Cart is an authorized retail e-commerce platform registered and managed by Telos Digital Commerce Ltd. (Trade License & BIN compliant) headquartered in Dhaka, Bangladesh.",
      },
      {
        title: "Statutory Law Jurisdiction",
        description:
          "All customer data capture, storage, and handling protocols strictly conform with the Information and Communication Technology (ICT) Act 2006 (amended) and statutory consumer digital guidelines issued under Bangladesh law.",
        keyPoints: [
          "Commercial trade confidentiality for all buyers",
          "Zero monetization, leasing, or selling of personal profiles",
          "Lawful cooperation restricted only to court-ordered statutory warrants",
        ],
      },
    ],
  },
  {
    id: "collection",
    category: "Data Intake",
    title: "2. Personal & Technical Data Collected",
    icon: Database,
    tag: "Required Sourcing",
    lastUpdated: "Sept 2026",
    summary:
      "Specific data points required for order fulfillment, fraud screening, and delivery route optimization.",
    clauses: [
      {
        title: "Customer & Identity Records",
        description:
          "When you register or place an order, we record your legal name, verified Bangladesh mobile number (+880), contact email, and delivery address (division, district, upazila/thana, and drop point).",
      },
      {
        title: "Sensitive Financial Information Exclusion",
        description:
          "Telos Cart never stores card primary account numbers (PAN), CVV/CVC codes, OTPs, or mobile financial service (bKash/Nagad) PINs. All payment processing occurs entirely via PCI-DSS Level 1 compliant gateway gateways (SSLCOMMERZ) over 256-bit TLS pipelines.",
      },
      {
        title: "Hardware & Device Audit Logs",
        description:
          "For purchased high-value electronics, we record IMEI numbers and manufacturer serial codes matched with your invoice for authorized warranty claim verification and anti-theft records.",
      },
    ],
  },
  {
    id: "processing",
    category: "Operations",
    title: "3. Purpose of Processing & Commercial Use",
    icon: Eye,
    tag: "Fulfillment SLA",
    lastUpdated: "Sept 2026",
    summary:
      "How customer data powers the fulfillment lifecycle from depot allocation to doorstep courier dispatch.",
    clauses: [
      {
        title: "Order Fulfillment & Logistics",
        description:
          "Your delivery address and phone number are dispatched to certified courier hubs to facilitate doorstep drops across all 64 districts of Bangladesh.",
      },
      {
        title: "Automated Dispatch Alerts",
        description:
          "We transmit automated SMS and email notifications detailing shipment milestones, consignment IDs, OTP delivery codes, and courier rider phone numbers.",
      },
      {
        title: "Distributor Warranty Registration",
        description:
          "Serial entries are relayed to authorized brand regional distributors (Apple, Samsung, Sony, Asus, etc.) solely to validate valid warranty start timestamps in service center databases.",
      },
    ],
  },
  {
    id: "disclosures",
    category: "Partnerships",
    title: "4. Third-Party Service Disclosures",
    icon: Share2,
    tag: "Strict Non-Disclosure",
    lastUpdated: "Sept 2026",
    summary:
      "Strict data isolation and limited transmission to essential logistics and financial infrastructure.",
    clauses: [
      {
        title: "National Courier Contractors",
        description:
          "Operational delivery partners (e.g., Steadfast, Pathao Courier, RedX, eCourier) receive only minimal necessary shipping tokens: recipient name, contact number, and street location.",
      },
      {
        title: "Payment Gateway Operators",
        description:
          "Online transactions are redirected to SSLCOMMERZ gateway endpoints authorized by Bangladesh Bank with end-to-end tokenization.",
      },
      {
        title: "Zero Commercial Marketing Resale",
        description:
          "We maintain a binding corporate guarantee: customer contact registries, shopping histories, and device telemetry are never shared with advertising broker networks or third-party telemarketers.",
      },
    ],
  },
  {
    id: "security",
    category: "Cybersecurity",
    title: "5. Security Infrastructure & Storage Architecture",
    icon: Server,
    tag: "256-bit TLS & RBAC",
    lastUpdated: "Sept 2026",
    summary:
      "Technical safeguards protecting customer databases from unauthorized intrusion, modification, or leakage.",
    clauses: [
      {
        title: "Encryption Standards",
        description:
          "All data in transit is encrypted using 256-bit TLS 1.3 protocol. Customer credentials and passwords are encrypted at rest using industry-standard salted hashing algorithms.",
      },
      {
        title: "Role-Based Access Controls (RBAC)",
        description:
          "Customer records are accessible only by credentialed fulfillment officers on a need-to-know basis, protected by hardware-token Multi-Factor Authentication (MFA) and automated access audit logging.",
      },
      {
        title: "Data Retention Timelines",
        description:
          "Transactional invoices and tax records are retained for mandatory statutory periods prescribed by the National Board of Revenue (NBR) before secure automated purge routines.",
      },
    ],
  },
  {
    id: "rights",
    category: "Consumer Autonomy",
    title: "6. Customer Rights & Data Management",
    icon: UserCheck,
    tag: "Data Subject Rights",
    lastUpdated: "Sept 2026",
    summary:
      "Your legal rights to access, amend, download, or erase personal profile records on Telos Cart.",
    clauses: [
      {
        title: "Right to Rectification & Access",
        description:
          "You may view and modify personal profile details, secondary phone numbers, and delivery addresses at any time through your authenticated account profile.",
      },
      {
        title: "Right to Account Erasure",
        description:
          "Customers may request permanent deletion of their account profile and marketing identifiers by contacting our data desk, subject only to non-erasable statutory financial audit records.",
      },
      {
        title: "Marketing Preferences",
        description:
          "You can opt out of non-transactional marketing communications and newsletters at any moment via your account preferences or one-click email unsubscribe links.",
      },
    ],
  },
  {
    id: "governance-desk",
    category: "Inquiries",
    title: "7. Data Protection Office & Formal Contact",
    icon: HelpCircle,
    tag: "Direct Officer",
    lastUpdated: "Sept 2026",
    summary:
      "Direct escalations for privacy inquiries, verification questions, and corporate security concerns.",
    clauses: [
      {
        title: "Official Compliance Contact",
        description:
          "For formal inquiries regarding our data protection standards or to exercise your rights under Bangladesh consumer protection guidelines, contact our dedicated legal desk.",
      },
    ],
  },
];

export default function PrivacyPolicyView() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-amber-500 selection:text-zinc-950">
        {/* Top Minimal Breadcrumb Bar */}
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
                  Privacy Policy & Governance
                </span>
              </nav>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ICT Act 2006 Compliant
                </span>
                <span>•</span>
                <span>Effective: Sept 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Body Document Flow (Clean editorial typography, no index cards) */}
        <div className="container px-4 sm:px-6 max-w-5xl mx-auto pt-10 sm:pt-14 space-y-12">
          {POLICY_DATA.map((section) => {
              const IconComponent = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-6"
                >
                  {/* Section Heading */}
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

                  {/* Summary Lead */}
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

          {/* Compliance & Contact Officer Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Statutory Contact
              </span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Data Protection Officer & Privacy Desk
              </h3>
              <p className="text-xs text-muted-foreground">
                Formal legal notices and GDPR/ICT Act inquiries can be addressed directly to our compliance officers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <Link
                href="mailto:privacy@teloscart.com"
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Privacy Desk</span>
                  <span className="text-muted-foreground text-[11px] truncate block">
                    privacy@teloscart.com
                  </span>
                </div>
              </Link>

              <Link
                href="tel:+880961000000"
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Compliance Line</span>
                  <span className="text-muted-foreground text-[11px] block">
                    +880 9610-000000
                  </span>
                </div>
              </Link>

              <Link
                href={ROUTES.TERMS}
                className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 p-3.5 text-foreground transition-colors"
              >
                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block">Terms of Service</span>
                  <span className="text-muted-foreground text-[11px] block">
                    View Commercial Terms
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
