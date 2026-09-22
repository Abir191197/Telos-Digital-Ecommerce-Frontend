"use client";

import React from "react";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

interface CheckoutLoadingOverlayProps {
  isSubmitting: boolean;
  totalPayable?: number;
  itemCount?: number;
}

export function CheckoutLoadingOverlay({
  isSubmitting,
  totalPayable,
  itemCount,
}: CheckoutLoadingOverlayProps) {
  if (!isSubmitting) return null;

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-live="assertive"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/85 dark:bg-zinc-950/85 backdrop-blur-md select-none cursor-wait transition-all duration-300 animate-in fade-in"
      style={{ pointerEvents: "all" }}
    >
      {/* Background warm ambient glowing orb */}
      <div className="pointer-events-none absolute w-96 h-96 rounded-full bg-amber-500/15 dark:bg-amber-400/10 blur-3xl animate-pulse" />

      {/* Center Modal Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl border border-border/80 bg-card/90 dark:bg-zinc-900/90 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Animated Icon Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 dark:border-amber-400/20 flex items-center justify-center" />
          <Loader2 className="w-20 h-20 absolute text-amber-500 animate-spin stroke-[2.5]" />
          <div className="absolute w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
            Finalizing Purchase
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Placing Your Order...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Please wait while we secure warehouse inventory, assign your courier, and generate your invoice.
          </p>
        </div>

        {/* Order Details Badge if provided */}
        {totalPayable !== undefined && (
          <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/60 bg-muted/40 text-xs font-medium text-foreground">
            <span className="text-muted-foreground">
              {itemCount ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "Items"}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-sm">
              BDT {totalPayable.toLocaleString()}
            </span>
          </div>
        )}

        {/* Protective Warning */}
        <div className="w-full flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium pt-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span>Please do not refresh, close, or click back.</span>
        </div>

        {/* Security Footer Pill */}
        <div className="pt-2 border-t border-border/50 w-full flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>256-Bit SSL Encrypted   TLS 1.3 Certified</span>
        </div>

      </div>
    </div>
  );
}
