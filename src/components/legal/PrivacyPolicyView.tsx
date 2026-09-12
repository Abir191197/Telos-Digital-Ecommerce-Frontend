"use client";

import * as React from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Eye,
  Database,
  Share2,
  UserCheck,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Search,
  Mail,
  PhoneCall,
  Server,
  ArrowUp,
  Fingerprint,
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
    id: "overview",
    number: "01",
    title: "Introduction & Platform Governance",
    icon: Lock,
    tag: "Scope",
    summary: "Scope of privacy compliance, legal entities, and customer data commitments in Bangladesh.",
  },
  {
    id: "data-collection",
    number: "02",
    title: "Personal Information We Collect",
    icon: Database,
    tag: "Collection",
    summary: "Account credentials, transaction records, shipping addresses, and technical browser logs.",
  },
  {
    id: "data-usage",
    number: "03",
    title: "How We Utilize Customer Information",
    icon: Eye,
    tag: "Processing",
    summary: "Order dispatch, courier routing, courier SMS tracking, fraud checks, and warranty verification.",
  },
  {
    id: "third-party-sharing",
    number: "04",
    title: "Third-Party Disclosures & Courier Partners",
    icon: Share2,
    tag: "Partners",
    summary: "Zero data selling guarantee. Strictly logistics (Pathao, Steadfast) & payment gateways (SSLCOMMERZ).",
  },
  {
    id: "security-measures",
    number: "05",
    title: "Storage, Encryption & Cyber Security",
    icon: Server,
    tag: "Protection",
    summary: "256-bit TLS encryption, PCI-DSS compliance, restricted admin access, and automated audits.",
  },
  {
    id: "user-rights",
    number: "06",
    title: "Your Rights & Account Data Management",
    icon: UserCheck,
    tag: "Control",
    summary: "Right of access, profile updates, account deletion requests, and promotional opt-outs.",
  },
  {
    id: "contact-officer",
    number: "07",
    title: "Privacy Officer & Support Concierge",
    icon: HelpCircle,
    tag: "Direct Care",
    summary: "Dhaka compliance officer contact, rapid response channel, email and telephone support.",
  },
];

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

export default function PrivacyPolicyView() {
  const [activeId, setActiveId] = React.useState("overview");
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
            className="absolute top-1/2 right-4 sm:right-10 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-blue-500/15 dark:bg-blue-500/10 blur-[90px] sm:blur-[120px]"
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
              <m.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 shadow-2xs backdrop-blur-md">
                <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Security & Privacy Protocol</span>
                <span className="h-1 w-1 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-800/80 dark:text-amber-200/80">
                  Updated Sept 2026
                </span>
              </m.div>

              {/* Title */}
              <m.h1
                variants={itemVariants}
                className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.18]"
              >
                Privacy Policy of{" "}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-200 bg-clip-text text-transparent">
                  Telos Cart
                </span>
              </m.h1>

              {/* Subtitle */}
              <m.p
                variants={itemVariants}
                className="text-xs sm:text-base text-muted-foreground max-w-3xl leading-relaxed font-normal"
              >
                We value your trust. Learn how Telos Cart safeguards your customer identity, encrypts digital transactions via SSLCOMMERZ, manages logistics data, and protects personal rights nationwide across Bangladesh.
              </m.p>

              {/* Quick Metadata Pill Strip */}
              <m.div variants={itemVariants} className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <Fingerprint className="h-3.5 w-3.5 text-amber-500" />
                  <span>Encrypted: <strong className="text-foreground font-semibold">256-bit TLS</strong></span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Strictly <strong className="text-foreground font-semibold">Zero Data Selling</strong></span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 dark:bg-zinc-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-border/70 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Complies with <strong className="text-foreground font-semibold">ICT Act BD</strong></span>
                </div>
              </m.div>
            </m.div>
          </div>
        </header>

        {/* ── Main Layout Body (Sticky Nav on Desktop, Hidden on Mobile) ── */}
        <div className="container px-3.5 sm:px-6 max-w-6xl mx-auto pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Table of Contents (Sticky on Desktop, Hidden on Mobile) */}
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
                      Policy Index
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
                    placeholder="Search policy topic..."
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

                {/* Security Verification Box */}
                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3.5 text-left">
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                      Payment Data Protection
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                      Card numbers and bKash/Nagad PINs are processed via SSLCOMMERZ and never recorded.
                    </p>
                    <Link
                      href={ROUTES.CONTACT}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Contact Security Team</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </m.aside>

            {/* Right Column: Comprehensive Policy Clauses */}
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
