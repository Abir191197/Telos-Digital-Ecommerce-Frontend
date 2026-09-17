"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  /**
   * Layout mode:
   * - "page": Centered in the middle of the viewport/page (min-h-[60vh])
   * - "card": Centered inside a rounded card container (min-h-[360px])
   * - "inline": Compact spinner for buttons or badges
   */
  variant?: "page" | "card" | "inline";
  /** Main heading text */
  title?: string;
  /** Subtitle or contextual explanation */
  description?: string;
  /** Top pill badge text (e.g. "Live Catalog", "Admin Portal") */
  badgeText?: string;
  /** Spinner size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Fallback simple text for backwards compatibility */
  text?: string;
  /** Additional container classes */
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * Universal Polished Loading Component
 * Supports middle-of-the-page viewport loading, card/table container loading, and inline spinners.
 */
export function Loader({
  variant = "inline",
  title,
  description,
  badgeText,
  size = "md",
  text,
  className,
}: LoaderProps) {
  // ── 1. Inline Variant (Simple spinner for buttons/badges) ─────────────
  if (variant === "inline") {
    return (
      <div className={cn("inline-flex items-center justify-center gap-2", className)}>
        <Loader2 className={cn("animate-spin text-amber-500", sizeMap[size])} />
        {(text || title) && (
          <span className="text-xs font-semibold text-muted-foreground">
            {text || title}
          </span>
        )}
      </div>
    );
  }

  // ── 2. Page & Card Variants (Centered in the middle of the page) ──────
  const displayTitle = title || text || "Loading content...";
  const displayDesc =
    description || "Synchronizing with Telos Cart live servers. Please wait...";

  const isPage = variant === "page";

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center text-center p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 select-none",
        isPage
          ? "min-h-[60vh] py-16 sm:py-24"
          : "min-h-[360px] rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm my-4",
        className
      )}
    >
      {/* Optional Top Pill Badge */}
      {badgeText && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-5 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* Luxury Animated Double-Ring Spinner */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer ambient glow pulse */}
        <div className="absolute h-16 w-16 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
        {/* Soft rotating outer gradient track */}
        <div className="h-14 w-14 rounded-full border-2 border-amber-500/20 border-t-amber-500 border-r-amber-500/60 animate-spin" />
        {/* Inner spinning brand icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-xs">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          </div>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="max-w-sm space-y-1.5 px-4">
        <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {displayDesc}
        </p>
      </div>
    </div>
  );
}

/**
 * Dedicated PageLoader helper: automatically defaults to variant="page"
 * Taking the center/middle of the viewport.
 */
export function PageLoader(props: Omit<LoaderProps, "variant">) {
  return <Loader variant="page" {...props} />;
}
