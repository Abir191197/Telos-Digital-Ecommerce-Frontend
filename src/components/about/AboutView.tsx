"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { LazyMotion, domAnimation } from "framer-motion";
import { AboutOperationsMetrics } from "./AboutOperationsMetrics";
import { AboutAuthorizedBrands } from "./AboutAuthorizedBrands";
import { AboutInspectionPipeline } from "./AboutInspectionPipeline";
import { AboutCorporateGovernance } from "./AboutCorporateGovernance";
import { AboutCorporateCta } from "./AboutCorporateCta";

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
                About Telos Digital Commerce Ltd.
              </span>
            </nav>
          </div>
        </div>

        {/* Concrete Operational Metrics */}
        <AboutOperationsMetrics />

        {/* Tier-1 Direct Brand Partnerships Registry */}
        <AboutAuthorizedBrands />

        {/* 5-Stage Authenticity & QA Protocol */}
        <AboutInspectionPipeline />

        {/* Consumer Charter & Corporate B2B Solutions */}
        <AboutCorporateGovernance />

        {/* Corporate Inquiry & Physical Office Contact */}
        <AboutCorporateCta />
      </div>
    </LazyMotion>
  );
}

