"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateFilterPreset =
  | "all_time"
  | "today"
  | "yesterday"
  | "last_7_days"
  | "this_month"
  | "custom";

export interface DateFilterValue {
  preset: DateFilterPreset;
  startDate?: string;
  endDate?: string;
}

interface DashboardDateFilterProps {
  value: DateFilterValue;
  onChange: (val: DateFilterValue) => void;
  className?: string;
}

const PRESETS: { key: DateFilterPreset; label: string }[] = [
  { key: "all_time", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_7_days", label: "Last 7 Days" },
  { key: "this_month", label: "This Month" },
  { key: "custom", label: "Custom Range" },
];

export function DashboardDateFilter({
  value,
  onChange,
  className,
}: DashboardDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.startDate || "");
  const [customEnd, setCustomEnd] = useState(value.endDate || "");
  const [isCustomMode, setIsCustomMode] = useState(value.preset === "custom");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (preset: DateFilterPreset) => {
    if (preset === "custom") {
      setIsCustomMode(true);
      return;
    }
    setIsCustomMode(false);
    onChange({ preset });
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      onChange({
        preset: "custom",
        startDate: customStart,
        endDate: customEnd,
      });
      setIsOpen(false);
    }
  };

  const currentLabel =
    value.preset === "custom" && value.startDate && value.endDate
      ? `${value.startDate.slice(5)} to ${value.endDate.slice(5)}`
      : PRESETS.find((p) => p.key === value.preset)?.label || "All Time";

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground border border-border/40 transition-all shadow-2xs cursor-pointer select-none"
      >
        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="truncate max-w-[110px]">{currentLabel}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-card/95 backdrop-blur-md border border-border/60 shadow-xl z-50 p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-2 py-1 border-b border-border/30 mb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Filter by Date Range
            </p>
          </div>

          <div className="space-y-0.5">
            {PRESETS.map((p) => {
              const isSelected = value.preset === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleSelectPreset(p.key)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left",
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <span>{p.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Custom Date Form */}
          {isCustomMode && (
            <form onSubmit={handleApplyCustom} className="pt-2 mt-1.5 border-t border-border/40 space-y-2 p-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground">From</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded-md bg-muted/60 border border-border/60 text-foreground font-mono focus:outline-hidden focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground">To</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-xs px-2 py-1 rounded-md bg-muted/60 border border-border/60 text-foreground font-mono focus:outline-hidden focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!customStart || !customEnd}
                className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                <span>Apply Date</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
