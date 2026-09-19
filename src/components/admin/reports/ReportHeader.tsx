"use client";

import React, { useState } from "react";
import {
  Calendar,
  Search,
  Printer,
  ChevronDown,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { ReportDatePreset } from "@/services/api/reports/reportApi";

interface ReportHeaderProps {
  title: string;
  description: string;
  badge?: string;
  dateRange: ReportDatePreset;
  setDateRange: (range: ReportDatePreset) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  search: string;
  setSearch: (search: string) => void;
  onExportPdf: () => void;
  isExporting: boolean;
  extraFilters?: React.ReactNode;
}

const PRESET_OPTIONS: { label: string; value: ReportDatePreset }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Custom Date", value: "custom" },
  { label: "All Time", value: "all_time" },
];

export function ReportHeader({
  title,
  description,
  badge = "Super Admin",
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  search,
  setSearch,
  onExportPdf,
  isExporting,
  extraFilters,
}: ReportHeaderProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);

  return (
    <div className="space-y-4 print:hidden">
      {/* Top Banner & PDF Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Preparing PDF...</span>
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/40 shadow-xs">
        {/* Preset Date Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground ml-1 mr-1 shrink-0" />
          {PRESET_OPTIONS.map((opt) => {
            const isActive = dateRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setDateRange(opt.value);
                  if (opt.value === "custom") {
                    setShowCustomModal(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Search & Custom Extra Filters */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[240px] justify-end">
          {extraFilters}

          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search report..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-8 rounded-xl bg-muted/40 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Range Indicators if active */}
      {dateRange === "custom" && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
          <span className="font-bold text-amber-600 dark:text-amber-400">
            Active Custom Range:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-border bg-background text-foreground text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-border bg-background text-foreground text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
