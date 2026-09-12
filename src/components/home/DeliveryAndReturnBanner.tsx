"use client";

import React from "react";
import Link from "next/link";
import { Truck, RotateCcw, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { ROUTES } from "@/constants";

export function DeliveryAndReturnBanner() {
  return (
    <section aria-label="Express Delivery and Hassle-Free Returns" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Fast Delivery Banner */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-sky-500/5 to-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Truck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="rounded-full bg-blue-600/15 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Dhaka & Nationwide
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Express 24-48h Doorstep Courier
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Same-day dispatch in Dhaka metro, with live SMS tracking and insured transit to all 64 districts in Bangladesh.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Free delivery over ৳2,000
            </span>
            <Link
              href={ROUTES.TRACKING}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 dark:hover:text-white shadow-xs transition-all duration-200 group"
            >
              <span>Track Orders</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: 7-Day Replacement & Return Banner */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Zero Risk Policy
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                7-Day Easy Return & Instant Swap
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Received a defective or mismatched product? Instant pickup from your doorstep and replacement without complicated paperwork.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Hassle-free guarantee
            </span>
            <Link
              href={ROUTES.TERMS}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 hover:text-white px-3.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 dark:hover:text-zinc-950 shadow-xs transition-all duration-200 group"
            >
              <span>Return Policy</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
