"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2, Award } from "lucide-react";
import { ROUTES } from "@/constants";

export function AuthenticityGuaranteeBanner() {
  return (
    <section
      aria-label="100% Genuine Guarantee"
      className="relative w-full overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-background p-6 sm:p-8 shadow-sm"
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Authorized Guarantee
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                100% Genuine Devices
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-foreground">
              Official Manufacturer Warranty Across Bangladesh
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Every device on Telos Cart includes verifiable official serials, authentic retail packaging, and direct replacement assurance from authorized brand centers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <Link
            href={ROUTES.ABOUT}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <span>Learn Authenticity Pledge</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
