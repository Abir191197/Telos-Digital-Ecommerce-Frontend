"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface CategoryHeaderProps {
  isEditMode: boolean;
  categoryName?: string;
  successToast: boolean;
  lastCreatedCategory: string;
  onResetForm: () => void;
}

export function CategoryHeader({
  isEditMode,
  categoryName,
  successToast,
  lastCreatedCategory,
  onResetForm,
}: CategoryHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shadow-2xs"
            title="Back to Categories"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Admin Catalog
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Hierarchy & Taxonomies</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              {isEditMode ? `Edit Category: ${categoryName || "Category"}` : "Create Category"}
            </h1>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="rounded-2xl border-none bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <div className="text-xs">
              <strong className="font-bold">
                {isEditMode ? "Category Updated!" : "Category Created!"}
              </strong>{" "}
              &ldquo;{lastCreatedCategory}&rdquo; {isEditMode ? "changes saved successfully." : "added to store catalog navigation."}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                type="button"
                onClick={onResetForm}
                className="text-xs font-bold underline hover:no-underline cursor-pointer"
              >
                Add Another
              </button>
            )}
            <Link
              href="/dashboard/categories"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer"
            >
              View Catalog
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
