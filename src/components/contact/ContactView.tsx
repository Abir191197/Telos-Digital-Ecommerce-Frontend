"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Headphones,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Stable Framer Motion variants defined outside component for maximum FPS
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 260,
    },
  },
};

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: "Customer Hotline",
    badge: "Official Support",
    value: "+880 1700-000000",
    desc: "Speak directly with verified Bangladeshi hardware specialists.",
    timing: "Daily: 9:00 AM – 10:00 PM BST",
    accent: "text-amber-500",
    iconBg: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950",
    glow: "group-hover:border-amber-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(245,158,11,0.2)]",
    actionText: "Call Hotline",
    actionHref: "tel:+8801700000000",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Live Desk",
    badge: "Instant ~5m",
    value: "WhatsApp Chat",
    desc: "Send invoice photos, product verification queries, or delivery inquiries.",
    timing: "Available 7 Days a Week",
    accent: "text-emerald-500",
    iconBg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
    glow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.2)]",
    actionText: "Open WhatsApp",
    actionHref: "https://wa.me/8801700000000",
  },
  {
    icon: Mail,
    title: "Official Email",
    badge: "24h SLA",
    value: "support@teloscart.com",
    desc: "For corporate inquiries, warranty claim escalations, and bulk tenders.",
    timing: "support@teloscart.com",
    accent: "text-blue-500",
    iconBg: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white",
    glow: "group-hover:border-blue-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.2)]",
    actionText: "Send Mail",
    actionHref: "mailto:support@teloscart.com",
  },
  {
    icon: MapPin,
    title: "Corporate Experience Center",
    badge: "Gulshan-2, Dhaka",
    value: "Dhaka Flagship Hub",
    desc: "Level 6, Navana Tower, Gulshan Circle 2, Dhaka 1212, Bangladesh.",
    timing: "Open Sat – Thu: 10 AM – 8 PM",
    accent: "text-purple-500",
    iconBg: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-600 group-hover:text-white",
    glow: "group-hover:border-purple-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(168,85,247,0.2)]",
    actionText: "Google Maps View",
    actionHref: "https://maps.google.com/?q=Gulshan-2+Dhaka",
  },
];

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

export function ContactView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Status & Tracking",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Order Status & Tracking",
        message: "",
      });
    }, 1500);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-amber-500 selection:text-zinc-950">
        {/* ── Breadcrumb Bar ── */}
        <div className="border-b border-border/60 bg-muted/20 py-3">
          <div className="container px-3 sm:px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-border" />
              <span className="font-semibold text-foreground">Contact & Support</span>
            </nav>
          </div>
        </div>

        {/* ── Hero Header with Ambient Depth & Motion ── */}
        <section className="relative overflow-hidden pt-12 pb-14 sm:pt-20 sm:pb-20 border-b border-border/60">
          {/* Ambient Blurred Glow Blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent blur-3xl opacity-70 -z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 right-[15%] w-60 h-60 bg-blue-500/10 blur-3xl -z-10"
          />

          <div className="container px-4 sm:px-6">
            <m.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto text-center space-y-4"
            >
              <m.div variants={itemVariants} className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-2xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>9:00 AM – 10:00 PM BST · Instant Human Help</span>
                </div>
              </m.div>

              <m.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]"
              >
                We&apos;re Here to Support Your{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Tech Journey.
                </span>
              </m.h1>

              <m.p variants={itemVariants} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you need advice selecting a laptop, urgent courier tracking, or official warranty guidance, our Dhaka-based support team is always within reach.
              </m.p>
            </m.div>
          </div>
        </section>

        {/* ── Contact Channels Grid ── */}
        <section className="container px-4 sm:px-6 py-10 sm:py-14">
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {CONTACT_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <m.div
                  key={channel.title}
                  variants={itemVariants}
                  className={cn(
                    "group relative flex flex-col justify-between p-6 rounded-3xl bg-card border border-border/70 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300",
                    channel.glow
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110",
                          channel.iconBg
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {channel.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-sm font-bold text-muted-foreground">
                        {channel.title}
                      </h2>
                      <div className="text-base sm:text-lg font-black text-foreground tracking-tight">
                        {channel.value}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {channel.desc}
                      </p>
                      <div className="text-[11px] font-medium text-amber-500 pt-1">
                        {channel.timing}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 mt-4">
                    <a
                      href={channel.actionHref}
                      target={channel.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-secondary/80 hover:bg-amber-500 hover:text-zinc-950 px-4 py-2.5 text-xs font-bold text-foreground transition-all duration-200 active:scale-95 shadow-2xs group/btn"
                    >
                      <span>{channel.actionText}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </section>

        {/* ── Interactive Contact Form & Experience Hub ── */}
        <section className="border-y border-border/60 bg-muted/20 py-14 sm:py-20">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Form */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 rounded-3xl bg-card border border-border/80 p-6 sm:p-10 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)] space-y-6"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                    Direct Inquiry Desk
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fill out the form below. Our response team will review your inquiry and respond within 2 to 4 business hours.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Message Dispatched Successfully!</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Thank you for contacting Telos Cart. A representative has received your ticket and will follow up shortly via email or phone.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-3 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 01700-000000"
                          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. tanvir@example.com"
                          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Inquiry Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-amber-500 focus:outline-hidden transition-colors"
                        >
                          <option value="Order Status & Tracking">Order Status & Tracking</option>
                          <option value="Warranty & Technical Claim">Warranty & Technical Claim</option>
                          <option value="Product Pre-Purchase Advice">Product Pre-Purchase Advice</option>
                          <option value="Corporate & Bulk B2B Order">Corporate & Bulk B2B Order</option>
                          <option value="Return / Refund Request">Return / Refund Request</option>
                          <option value="Other Query">Other Query</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Your Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your query, including Order ID if applicable..."
                        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-7 py-3 text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </m.div>

              {/* Right Column: Experience Hub Info */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 space-y-6"
              >
                {/* Gulshan Flagship Card */}
                <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Dhaka Experience Center</h3>
                      <p className="text-[11px] text-muted-foreground">In-Person Demos & Pickups</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Test flagship devices hands-on, consult with our hardware engineers, or pick up reserved online orders at our Gulshan hub.
                  </p>

                  <div className="space-y-2 pt-1 border-t border-border/50 text-xs">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>Level 6, Navana Tower, Gulshan Circle 2, Dhaka 1212</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Saturday – Thursday: 10:00 AM – 8:00 PM</span>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Gulshan-2+Dhaka"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors pt-2"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Instant Order Tracking Direct Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-card to-card border border-amber-500/30 shadow-md space-y-3">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-zinc-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    Quick Service
                  </div>
                  <h3 className="text-base font-bold text-foreground">Looking for a Courier Update?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track the exact GPS milestone of your parcel across Dhaka and all 64 districts in real-time.
                  </p>
                  <Link
                    href={ROUTES.TRACK_ORDER}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    <span>Open Live Order Tracker</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        {/* ── Accordion FAQ Section ── */}
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
      </div>
    </LazyMotion>
  );
}
