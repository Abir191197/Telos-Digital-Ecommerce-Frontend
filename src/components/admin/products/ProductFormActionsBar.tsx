"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Save, Sparkles } from "lucide-react";

interface ProductFormActionsBarProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

export function ProductFormActionsBar({
  isEditMode,
  isSubmitting,
  onSubmit,
}: ProductFormActionsBarProps) {
  return (
    <>
      {/* Desktop Action Card */}
      <div className="hidden sm:flex items-center justify-between p-4.5 rounded-3xl border border-border/60 bg-card shadow-xs">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-foreground">
            {isEditMode ? "Ready to update?" : "Ready to publish?"}
          </h4>
          <p className="text-[11px] text-muted-foreground">
            {isEditMode
              ? "Ensure all pricing, specs, and gallery changes are accurate."
              : "Listing will become instantly active on storefront."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="px-4 py-2.5 rounded-xl border border-border/70 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
            ) : isEditMode ? (
              <Save className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Listing"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Pill (Above Mobile Bottom Nav) */}
      <div className="fixed bottom-18 left-0 right-0 z-40 sm:hidden flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center justify-between gap-2.5 w-full max-w-[330px] px-3 py-1.5 rounded-full border border-white/10 dark:border-amber-500/25 bg-zinc-950/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Link
            href="/dashboard/products"
            className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white transition-all active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 text-[11px] font-black text-zinc-950 hover:from-amber-400 hover:to-amber-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin text-zinc-950" />
            ) : isEditMode ? (
              <Save className="h-3 w-3" />
            ) : (
              <Sparkles className="h-3 w-3 fill-zinc-950" />
            )}
            <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Product"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
