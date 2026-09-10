import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "About Us | Telos Cart Bangladesh",
  description:
    "Learn about Telos Cart, Bangladesh's next-generation authentic digital & tech commerce platform.",
};

const STATS = [
  { value: "50,000+", label: "Happy Shoppers Nationwide" },
  { value: "100%", label: "Authentic & Genuine Products" },
  { value: "24-48 hrs", label: "Fast Dhaka Delivery" },
  { value: "7 Days", label: "Hassle-Free Return Guarantee" },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Authenticity",
    desc: "We source directly from authorized regional distributors, verified brand houses, and direct manufacturers with verifiable serial numbers.",
  },
  {
    icon: Truck,
    title: "Nationwide Express Logistics",
    desc: "Integrated with top-tier courier hubs across 64 districts in Bangladesh with live GPS milestone tracking for every package.",
  },
  {
    icon: Headphones,
    title: "Dedicated Human Support",
    desc: "Our bilingual Bangladesh customer care team is available 9 AM to 10 PM daily via hotline, WhatsApp, and live chat.",
  },
  {
    icon: RotateCcw,
    title: "Transparent Return & Refund",
    desc: "Zero runarounds. 7-day straightforward returns and instant bKash/bank account reversal for any damaged or non-conforming items.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/50 via-background to-background py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="container px-4 sm:px-6 text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>A Telos Digital Commerce Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
            Redefining Authentic Retail & Digital Shopping in Bangladesh
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Telos Cart was founded to bridge the trust gap in Bangladesh’s tech retail ecosystem. We bring world-class hardware, creator tools, smart home gear, and software to your doorstep with zero friction.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-border/60 bg-muted/20 py-10">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-amber-500">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission & Vision ── */}
      <section className="container px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Our Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Empowering consumers with authentic products and verified transparency.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              In an e-commerce landscape cluttered with counterfeit electronics and uncertain deliveries, Telos Cart stands on one core principle: unquestionable authenticity. Every smartphone, gaming console, laptop, or audio peripheral we dispatch is verified with authorized warranty protection.
            </p>
            <div className="pt-2 space-y-2.5">
              {[
                "Direct authorized regional distribution networks",
                "Official brand warranty and customer support coverage",
                "Instant cashless payments via bKash, Nagad, cards & COD",
                "Live real-time courier tracking across all 64 districts",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CORE_VALUES.map((val) => (
              <div
                key={val.title}
                className="rounded-xl border border-border/70 bg-card p-5 space-y-2.5 transition-all hover:border-amber-500/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <val.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">{val.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="container px-4 sm:px-6 pt-6">
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 dark:from-zinc-900 dark:to-zinc-950 p-8 sm:p-12 text-center space-y-5 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to explore genuine gear?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Browse our top categories including flagship smartphones, high-performance laptops, and esports gaming peripherals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-6 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
