"use client";

import * as React from "react";
import {
  Lock,
  Database,
  Eye,
  Share2,
  Server,
  UserCheck,
  HelpCircle,
  ArrowUp,
} from "lucide-react";
import { LazyMotion, domAnimation, m, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { PrivacyHeaderHero } from "./PrivacyHeaderHero";
import { PrivacySidebar } from "./PrivacySidebar";
import { PrivacyContentSections } from "./PrivacyContentSections";
import type { SectionItem } from "./TermsSidebar";

export const PRIVACY_SECTIONS: SectionItem[] = [
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

      const sectionElements = PRIVACY_SECTIONS.map((sec) =>
        document.getElementById(sec.id)
      );
      const scrollPos = currentScrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(PRIVACY_SECTIONS[i].id);
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
    if (!searchQuery.trim()) return PRIVACY_SECTIONS;
    const q = searchQuery.toLowerCase();
    return PRIVACY_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-background text-foreground pb-24 selection:bg-amber-500/25 selection:text-amber-900 dark:selection:text-amber-200">
        {/* Top Scroll Progress Bar */}
        <m.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 origin-left z-50 shadow-xs"
        />

        {/* Ambient Background Glow Orbs */}
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

        {/* Hero Header */}
        <PrivacyHeaderHero />

        {/* Main Layout Body */}
        <div className="container px-3.5 sm:px-6 max-w-6xl mx-auto pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Policy Table of Contents */}
            <PrivacySidebar
              sections={PRIVACY_SECTIONS}
              filteredSections={filteredSections}
              activeId={activeId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onScrollTo={scrollTo}
            />

            {/* Policy Clauses Sections */}
            <PrivacyContentSections />
          </div>
        </div>

        {/* Floating Back to Top FAB */}
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
