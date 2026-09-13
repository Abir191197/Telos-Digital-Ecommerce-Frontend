"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Search, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { m, type Variants } from "framer-motion";
import type { SectionItem } from "./TermsSidebar";

interface PrivacySidebarProps {
  sections: SectionItem[];
  filteredSections: SectionItem[];
  activeId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollTo: (id: string) => void;
}

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

export function PrivacySidebar({
  sections,
  filteredSections,
  activeId,
  searchQuery,
  onSearchChange,
  onScrollTo,
}: PrivacySidebarProps) {
  return (
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
            {sections.length} Sections
          </span>
        </div>

        {/* Section Search Filter */}
        <div className="relative mt-3.5 mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search policy topic..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
                onClick={() => onScrollTo(sec.id)}
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
  );
}
