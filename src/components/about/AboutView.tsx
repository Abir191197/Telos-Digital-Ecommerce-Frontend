"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation } from "framer-motion";
import { AboutHero } from "./AboutHero";
import { AboutStatsGrid } from "./AboutStatsGrid";
import { AboutPillarsGrid } from "./AboutPillarsGrid";
import { AboutStandardsStory } from "./AboutStandardsStory";
import { AboutCtaBanner } from "./AboutCtaBanner";

export function AboutView() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-amber-500 selection:text-zinc-950">
        {/* Breadcrumb Bar */}
        <div className="border-b border-border/60 bg-muted/20 py-3">
          <div className="container px-3 sm:px-6">
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
                About Telos Cart
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section with Ambient Lights & Motion */}
        <AboutHero />

        {/* Key Numbers Grid */}
        <AboutStatsGrid />

        {/* Four Core Pillars */}
        <AboutPillarsGrid />

        {/* Editorial Story & Verification Checklist */}
        <AboutStandardsStory />

        {/* High-Impact Dark CTA Banner */}
        <AboutCtaBanner />
      </div>
    </LazyMotion>
  );
}
