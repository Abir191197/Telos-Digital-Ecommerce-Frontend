"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BadgeCheck,
  Building2,
  HeartHandshake,
  ChevronRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation, m, useInView, animate, type Variants } from "framer-motion";

// Landing animated number component with scroll viewport trigger
function AnimatedStatNumber({
  target,
  prefix = "",
  suffix = "",
  formatComma = false,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  formatComma?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // snappy cinematic spring out
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, target]);

  const formatted = formatComma
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// Stable Framer Motion variants defined outside component per framer-motion performance skill
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
  hidden: { opacity: 0, y: 22 },
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

const STATS = [
  {
    target: 100,
    prefix: "",
    suffix: "%",
    formatComma: false,
    label: "Genuine Authenticity",
    detail: "Official brand seals & serial verification",
    gradient: "from-amber-500/20 to-amber-500/5",
    accent: "text-amber-500",
  },
  {
    target: 50000,
    prefix: "",
    suffix: "+",
    formatComma: true,
    label: "Satisfied Customers",
    detail: "Tech creators, pros & enthusiasts",
    gradient: "from-blue-500/20 to-blue-500/5",
    accent: "text-blue-500",
  },
  {
    target: 24,
    prefix: "",
    suffix: "-48h",
    formatComma: false,
    label: "Express Courier",
    detail: "Swift Dhaka metro & 64 districts hub",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    accent: "text-emerald-500",
  },
  {
    target: 7,
    prefix: "",
    suffix: " Days",
    formatComma: false,
    label: "Hassle-Free Return",
    detail: "Doorstep pickup & direct refund",
    gradient: "from-purple-500/20 to-purple-500/5",
    accent: "text-purple-500",
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Authenticity",
    tag: "Zero Counterfeits",
    tagColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    iconBg: "bg-emerald-500 text-white",
    cardGlow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.22)]",
    description:
      "We source directly from manufacturer-authorized regional distributors. Every device carries verifiable serials, pristine retail seals, and valid distributor warranties across Bangladesh.",
  },
  {
    icon: Truck,
    title: "Nationwide Express Logistics",
    tag: "64 Districts",
    tagColor: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-500 text-white",
    cardGlow: "group-hover:border-blue-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.22)]",
    description:
      "Integrated with high-speed logistics channels with protective air-cushioned packaging. Live SMS tracking and dispatch alerts keep you in command of your order every kilometer.",
  },
  {
    icon: Headphones,
    title: "Dedicated Human Support",
    tag: "9 AM - 10 PM",
    tagColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-500 text-white",
    cardGlow: "group-hover:border-amber-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.22)]",
    description:
      "No automated robotic runarounds. Our bilingual customer experience team provides tailored hardware advice, compatibility checks, and instant after-sales warranty claim guidance.",
  },
  {
    icon: RotateCcw,
    title: "Transparent Return & Refund",
    tag: "Zero Friction",
    tagColor: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
    iconBg: "bg-purple-500 text-white",
    cardGlow: "group-hover:border-purple-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.22)]",
    description:
      "If you experience a genuine technical fault or non-conformance within 7 days, our team arranges immediate doorstep replacement or instantaneous reversal to your bKash, Nagad, or bank card.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Genesis",
    desc: "Founded by a collective of Bangladeshi tech engineers and hardware enthusiasts tired of the grey-market roulette.",
  },
  {
    year: "2025",
    title: "Authorized Distributor Partnerships",
    desc: "Forged direct tier-1 supply agreements with Apple, Samsung, Google, Sony, Asus, Xiaomi, and premium audio manufacturers.",
  },
  {
    year: "2026",
    title: "Next-Gen Digital Platform",
    desc: "Pioneering the modern web experience: ultra-low latency catalog, instantaneous checkout, real-time tracking, and express nationwide delivery.",
  },
];

const STANDARDS = [
  "Direct authorized regional distribution agreements",
  "Factory sealed packaging with uncompromised tamper seals",
  "Official IMEI / Serial barcode warranty coverage",
  "Transparent pricing with inclusive tax & duties",
  "Instant cashless transactions via bKash, Nagad & Cards",
  "Dedicated warranty claims concierge support",
];

export function AboutView() {
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
              <span className="font-semibold text-foreground">About Telos Cart</span>
            </nav>
          </div>
        </div>

        {/* ── Hero Section with Ambient Lights & Motion ── */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/60">
          {/* Ambient Blurred Glow Blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent blur-3xl opacity-70 -z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 right-[10%] w-72 h-72 bg-blue-500/10 blur-3xl -z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 left-[10%] w-72 h-72 bg-emerald-500/10 blur-3xl -z-10"
          />

          <div className="container px-4 sm:px-6">
            <m.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <m.div variants={itemVariants} className="flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The Benchmark in Bangladesh Tech Retail</span>
                </div>
              </m.div>

              <m.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]"
              >
                Zero Grey-Market Uncertainty.{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  100% Genuine Tech.
                </span>
              </m.h1>

              <m.p
                variants={itemVariants}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              >
                Telos Cart was engineered to eliminate the trust deficit in Bangladesh’s electronics market.
                We bridge premier global hardware brands directly to your doorstep with guaranteed authenticity,
                transparent warranties, and unmatched delivery speeds.
              </m.p>

              <m.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>Explore Verified Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ROUTES.CONTACT}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-md px-6 py-3 text-sm font-bold text-foreground hover:bg-muted/80 active:scale-95 transition-all duration-200"
                >
                  <span>Speak With Our Team</span>
                </Link>
              </m.div>
            </m.div>
          </div>
        </section>

        {/* ── Key Numbers Grid ── */}
        <section className="border-b border-border/60 bg-muted/20 py-8 sm:py-12">
          <div className="container px-4 sm:px-6">
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {STATS.map((stat) => (
                <m.div
                  key={stat.label}
                  variants={itemVariants}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border border-border/60 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />
                  <div className="relative z-10">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${stat.accent}`}>
                      <AnimatedStatNumber
                        target={stat.target}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        formatComma={stat.formatComma}
                      />
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-foreground mt-1">
                      {stat.label}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {stat.detail}
                    </p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Four Core Pillars ── */}
        <section className="container px-4 sm:px-6 py-14 sm:py-20">
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-10"
          >
            <m.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
                Core Foundations
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                Why Consumers Trust Telos Cart
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We believe that purchasing high-end tech should be secure, transparent, and completely delightful.
              </p>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <m.div
                    key={pillar.title}
                    variants={itemVariants}
                    className={`group relative flex flex-col justify-between rounded-3xl bg-card border border-border/70 p-6 sm:p-7 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300 ${pillar.cardGlow}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-105 ${pillar.iconBg}`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${pillar.tagColor}`}
                        >
                          {pillar.tag}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </m.div>
        </section>

        {/* ── Editorial Story & Verification Checklist ── */}
        <section className="border-y border-border/60 bg-muted/20 py-14 sm:py-20">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative */}
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="lg:col-span-7 space-y-6"
              >
                <m.div variants={itemVariants} className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                    <BadgeCheck className="h-4 w-4" />
                    <span>The Verification Standard</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
                    Every Single Package Dispatched Meets Strict Quality Protocols.
                  </h2>
                </m.div>

                <m.p variants={itemVariants} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  In Bangladesh, counterfeit accessories and tampered device boxes are an unfortunate reality of the unorganized retail sector. Telos Cart was built as the antidote: a tech-first retailer that inspects serial numbers against official brand databases prior to dispatch.
                </m.p>

                <m.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {STANDARDS.map((standard) => (
                    <div
                      key={standard}
                      className="flex items-start gap-2.5 rounded-2xl bg-card border border-border/60 p-3 shadow-2xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-foreground leading-tight">
                        {standard}
                      </span>
                    </div>
                  ))}
                </m.div>
              </m.div>

              {/* Right Column: Timeline Card */}
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)] space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Our Journey</h3>
                      <p className="text-[11px] text-muted-foreground">From Vision to Pioneer</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    Milestones
                  </span>
                </div>

                <div className="space-y-6 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                  {TIMELINE.map((item) => (
                    <div key={item.year} className="relative space-y-1">
                      <span className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-amber-500 bg-background" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-500 font-mono">
                          {item.year}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={ROUTES.PRODUCTS}
                    className="flex items-center justify-center gap-2 w-full rounded-2xl bg-secondary/80 hover:bg-secondary py-2.5 text-xs font-bold text-foreground transition-all duration-200 group"
                  >
                    <span>Browse Official Inventory</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-500" />
                  </Link>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        {/* ── High-Impact Dark CTA Banner ── */}
        <section className="container px-4 sm:px-6 pt-12 sm:pt-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-12 text-center text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]"
          >
            {/* Ambient Background Accents */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none group-hover:bg-amber-500/30 transition-all duration-500"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-amber-400 border border-white/10">
                <HeartHandshake className="h-3.5 w-3.5" />
                <span>Join Over 50,000+ Happy Creators & Tech Enthusiasts</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Ready to Experience True Authentic Retail?
              </h2>

              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto">
                Explore our flagship smartphone selections, creator computing rigs, studio headphones, and genuine accessories with guaranteed Bangladesh official warranty.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/25 transition-all duration-200"
                >
                  <span>Shop Catalog Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ROUTES.CONTACT}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-200"
                >
                  <span>Contact Care Team</span>
                </Link>
              </div>
            </div>
          </m.div>
        </section>
      </div>
    </LazyMotion>
  );
}
