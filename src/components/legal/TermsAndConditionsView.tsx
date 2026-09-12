"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Search,
  Scale,
  CreditCard,
  AlertTriangle,
  Mail,
  PhoneCall,
  ArrowUp,
} from "lucide-react";
import { LazyMotion, domAnimation, m, useScroll, useSpring, AnimatePresence, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

interface SectionItem {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  summary: string;
}

const SECTIONS: SectionItem[] = [
  {
    id: "agreement",
    number: "01",
    title: "Agreement to Terms & Legal Framework",
    icon: Scale,
    tag: "Binding",
    summary: "Contractual adherence under Bangladesh E-Commerce Guidelines & Digital Commerce Policy.",
  },
  {
    id: "pricing-orders",
    number: "02",
    title: "Orders, Inventory & BDT Pricing",
    icon: CreditCard,
    tag: "Financial",
    summary: "Currency valuation, VAT inclusion, order cancellation clauses & stock discrepancy policies.",
  },
  {
    id: "shipping-dispatch",
    number: "03",
    title: "Shipping & Nationwide Delivery Timelines",
    icon: Truck,
    tag: "Logistics",
    summary: "Dhaka Metro 24-48h dispatch, nationwide 64-district delivery, and package inspection rights.",
  },
  {
    id: "returns-replacements",
    number: "04",
    title: "7-Day Return & Replacement Policy",
    icon: RotateCcw,
    tag: "Buyer Protection",
    summary: "Unboxing guidelines, physical defect reports, wrong item arrival & reverse doorstep courier.",
  },
  {
    id: "warranty-service",
    number: "05",
    title: "Official Brand Warranty & Servicing",
    icon: ShieldCheck,
    tag: "Coverage",
    summary: "Authorized regional service centers, IMEI warranty coverage, and manufacturer-guaranteed claims.",
  },
  {
    id: "user-obligations",
    number: "06",
    title: "User Conduct & Fair Use Obligations",
    icon: AlertTriangle,
    tag: "Conduct",
    summary: "Fraud prevention, cash-on-delivery cancellation limits, authentic customer account details.",
  },
  {
    id: "support-concierge",
    number: "07",
    title: "Dispute Concierge & Customer Care",
    icon: HelpCircle,
    tag: "Assistance",
    summary: "Direct mediation channels, live order ticket tracking, Dhaka hotline & WhatsApp support.",
  },
];

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Stable animation variants outside component to avoid re-creation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.25,
      ease: easeCurve,
    },
  },
};

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

export default function TermsAndConditionsView() {
  const [activeId, setActiveId] = React.useState("agreement");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  // Smooth Reading Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBackToTop(currentScrollY > 400);

      const sectionElements = SECTIONS.map((sec) =>
        document.getElementById(sec.id)
      );
      const scrollPos = currentScrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSectionObj = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-background text-foreground pb-24 selection:bg-amber-500/25 selection:text-amber-900 dark:selection:text-amber-200">
        {/* ── Top Scroll Progress Bar ── */}
        <m.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 origin-left z-50 shadow-xs"
        />

        {/* ── Ambient Background Glow Orbs ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <m.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.08, 0.16, 0.08],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-12 left-1/4 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-amber-500/20 dark:bg-amber-500/10 blur-[100px] sm:blur-[130px]"
          />
          <m.div
            animate={{
              scale: [1.12, 1, 1.12],
              opacity: [0.12, 0.06, 0.12],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute top-1/2 right-4 sm:right-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-rose-500/15 dark:bg-rose-500/10 blur-[90px] sm:blur-[120px]"
          />
        </div>

        {/* ── Hero Header with Landing Animation ── */}
        <header className="relative border-b border-border/60 bg-muted/25 dark:bg-zinc-950/40 backdrop-blur-xl pt-8 pb-10 sm:pt-16 sm:pb-18">
          <div className="container px-3.5 sm:px-6 max-w-6xl mx-auto">
            <m.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-3.5 sm:space-y-4"
            >
              {/* Badge */}
              <m.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 px-3 py-1 text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 shadow-2xs backdrop-blur-md">
                <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Storefront Governance</span>
                <span className="h-1 w-1 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-800/80 dark:text-amber-200/80">
                  v2026.2
                </span>
              </m.div>

              {/* Title */}
              <m.h1
                variants={itemVariants}
                className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.18]"
              >
                Terms & Conditions of{" "}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
                  Telos Cart
                </span>
              </m.h1>

              {/* Subtitle */}
              <m.p
                variants={itemVariants}
                className="text-xs sm:text-base text-muted-foreground max-w-3xl leading-relaxed font-normal"
              >
                Clear, transparent, and legally binding operational terms for all retail purchases, digital transactions, 64-district delivery, and authorized manufacturer warranties across Bangladesh.
              </m.p>

              {/* Quick Metadata Pill Strip */}
              <m.div variants={itemVariants} className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <span>Effective: <strong className="text-foreground font-semibold">Sept 2026</strong></span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Complies with <strong className="text-foreground font-semibold">Commerce BD</strong></span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Binding for <strong className="text-foreground font-semibold">All Buyers</strong></span>
                </div>
              </m.div>
            </m.div>
          </div>
        </header>

        {/* ── Main Layout Body (Sticky Nav on Desktop, Content-Only on Mobile) ── */}
        <div className="container px-3.5 sm:px-6 max-w-6xl mx-auto pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Table of Contents (Sticky on Desktop, Hidden on Mobile in favor of Top Bar) */}
            <m.aside
              initial="hidden"
              animate="visible"
              variants={sidebarVariants}
              className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4"
            >
              <div className="rounded-3xl border border-border/70 bg-card/90 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      Document Index
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {SECTIONS.length} Sections
                  </span>
                </div>

                {/* Section Search Filter */}
                <div className="relative mt-3.5 mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search clause or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-muted/50 dark:bg-zinc-800/50 border border-border/60 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>

                {/* Nav Links */}
                <nav className="mt-3 space-y-1 max-h-[58vh] overflow-y-auto pr-1">
                  {filteredSections.map((sec) => {
                    const isSelected = activeId === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollTo(sec.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all group cursor-pointer",
                          isSelected
                            ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold shadow-2xs border border-amber-500/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black transition-colors",
                            isSelected
                              ? "bg-amber-500 text-zinc-950 shadow-xs"
                              : "bg-muted text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          {sec.number}
                        </div>
                        <span className="truncate flex-1">{sec.title}</span>
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 shrink-0 transition-transform duration-200",
                            isSelected
                              ? "text-amber-600 dark:text-amber-400 translate-x-0.5"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        />
                      </button>
                    );
                  })}
                </nav>

                {/* Fast Action Card */}
                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3.5 text-left">
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                      Need custom corporate terms?
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                      B2B bulk orders and institutional procurement agreements.
                    </p>
                    <Link
                      href={ROUTES.CONTACT}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Inquire with Business Desk</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </m.aside>

            {/* Right Column: Comprehensive Terms Clauses with Scroll Viewport Triggers */}
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
          </div>
        </div>

        {/* ── Floating Mobile / Tablet Quick Back to Top FAB ── */}
        <AnimatePresence>
          {showBackToTop && (
            <m.button
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 16 }}
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="fixed bottom-6 right-4 sm:right-6 z-40 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-lg shadow-amber-500/30 transition-transform active:scale-90"
            >
              <ArrowUp className="h-5 w-5 stroke-[2.5]" />
            </m.button>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
