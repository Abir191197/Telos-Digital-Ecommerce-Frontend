"use client";

import React from "react";
import { Sparkles, Loader2, Save } from "lucide-react";

interface CategoryFormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  hasName: boolean;
  onReset: () => void;
}

export function CategoryFormActions({
  isEditMode,
  isSubmitting,
  hasName,
  onReset,
}: CategoryFormActionsProps) {
  return (
    <>
      {/* Desktop Actions */}
      <div className="pt-2 hidden sm:flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl border-none bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs"
        >
          {isEditMode ? "Reset Changes" : "Reset Form"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !hasName}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Save Category Changes"
              : "Publish Category"}
          </span>
        </button>
      </div>

      {/* Mobile Floating Action Pill (Above Mobile Bottom Nav) */}
      <div className="fixed bottom-18 left-0 right-0 z-40 sm:hidden flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center justify-between gap-2.5 w-full max-w-[330px] px-3 py-1.5 rounded-full border border-white/10 dark:border-amber-500/25 bg-zinc-950/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            {isEditMode ? "Reset" : "Discard"}
          </button>
          <button
            type="submit"
            form="category-create-form"
            disabled={isSubmitting || !hasName}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 text-[11px] font-black text-zinc-950 hover:from-amber-400 hover:to-amber-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin text-zinc-950" />
            ) : isEditMode ? (
              <Save className="h-3 w-3" />
            ) : (
              <Sparkles className="h-3 w-3 fill-zinc-950" />
            )}
            <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Publish Category"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
