"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  severityFilter: string;
  setSeverityFilter: (sev: string) => void;
  sortBy: "date-desc" | "date-asc";
  setSortBy: (sort: "date-desc" | "date-asc") => void;
  onResetPage: () => void;
}

const CATEGORIES = [
  { id: "all", label: "All Audit Categories" },
  { id: "auth", label: "Authentication" },
  { id: "catalog", label: "Catalog & Products" },
  { id: "orders", label: "Orders & Shipping" },
  { id: "payments", label: "Payments" },
  { id: "security", label: "Security & TLS" },
  { id: "settings", label: "Store Settings" },
];

const SEVERITIES = [
  { id: "all", label: "All Severities" },
  { id: "info", label: "Informational" },
  { id: "success", label: "Success / Reconciled" },
  { id: "warning", label: "Warning / Policy" },
  { id: "danger", label: "High Alert / Threat" },
];

const SORTS = [
  { id: "date-desc", label: "Latest Events First" },
  { id: "date-asc", label: "Oldest Events First" },
];

export function ActivityMobileFilterModal({
  isOpen,
  onClose,
  categoryFilter,
  setCategoryFilter,
  severityFilter,
  setSeverityFilter,
  sortBy,
  setSortBy,
  onResetPage,
}: ActivityMobileFilterModalProps) {
  if (!isOpen) return null;

  const handleReset = () => {
    setCategoryFilter("all");
    setSeverityFilter("all");
    setSortBy("date-desc");
    onResetPage();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card border-t border-border/80 p-5 space-y-6 animate-in slide-in-from-bottom duration-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div>
            <h3 className="text-base font-black text-foreground">Filter Activity Logs</h3>
            <p className="text-[11px] text-muted-foreground">Select criteria to filter audit events</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.id);
                  onResetPage();
                }}
                className={cn(
                  "p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer",
                  categoryFilter === cat.id
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <span>{cat.label}</span>
                {categoryFilter === cat.id && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Severity
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SEVERITIES.map((sev) => (
              <button
                key={sev.id}
                type="button"
                onClick={() => {
                  setSeverityFilter(sev.id);
                  onResetPage();
                }}
                className={cn(
                  "p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer",
                  severityFilter === sev.id
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <span>{sev.label}</span>
                {severityFilter === sev.id && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Sort Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSortBy(s.id as "date-desc" | "date-asc");
                  onResetPage();
                }}
                className={cn(
                  "p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer",
                  sortBy === s.id
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <span>{s.label}</span>
                {sortBy === s.id && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border/40 flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
