"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import {
  RotateCcw,
  Home,
  ShoppingBag,
  AlertTriangle,
  Headphones,
  LifeBuoy,
} from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporter
    console.error("Application Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="h-80 w-80 translate-x-32 -translate-y-20 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-xl text-center space-y-8">
        {/* Error Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-600 border border-rose-500/30 shadow-lg shadow-rose-500/10">
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>

        {/* Heading & Information */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            <span>Temporary Technical Glitch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Something went wrong while loading this page
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our systems hit an unexpected hiccup. Your cart items and account details remain safe and untouched in your local session.
          </p>

          {/* Digest or error detail for debugging */}
          {error?.digest && (
            <p className="font-mono text-[10px] text-muted-foreground bg-muted/60 rounded-lg px-2.5 py-1 inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Priority Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again / Reload</span>
          </button>

          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-foreground/10 hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card hover:bg-muted/60 text-foreground px-5 py-3.5 text-xs sm:text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-amber-500" />
            <span>Go to Catalog</span>
          </Link>
        </div>

        {/* Support Hotline Strip */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Still experiencing trouble? Our support team is ready.</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8801700000000"
              className="font-bold text-foreground hover:text-amber-600 transition-colors"
            >
              +880 1700-000000
            </a>
            <span className="text-border">•</span>
            <Link
              href={ROUTES.CONTACT}
              className="font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Help Center</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
