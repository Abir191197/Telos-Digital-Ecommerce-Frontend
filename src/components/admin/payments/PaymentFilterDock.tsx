"use client";

import React from "react";
import { Search, X, ChevronDown, Check, CreditCard, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  methodFilter: string;
  setMethodFilter: (method: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
  setSortBy: (sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc") => void;
  openDropdown: "method" | "status" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"method" | "status" | "sort" | null>>;
  onResetPage: () => void;
}

const PAYMENT_METHODS = [
  { id: "all", label: "All Payment Methods" },
  { id: "bkash", label: "bKash MFS" },
  { id: "nagad", label: "Nagad MFS" },
  { id: "card", label: "Card / Online Gateway" },
  { id: "cod", label: "Cash on Delivery (COD)" },
];

const PAYMENT_STATUSES = [
  { id: "all", label: "All Verification Statuses" },
  { id: "verified", label: "Verified & Settled" },
  { id: "pending_verification", label: "Pending Verification" },
  { id: "rejected", label: "Rejected / Flagged" },
];

const SORT_OPTIONS = [
  { id: "date-desc", label: "Latest Transaction" },
  { id: "date-asc", label: "Oldest Transaction" },
  { id: "amount-desc", label: "Amount: High to Low" },
  { id: "amount-asc", label: "Amount: Low to High" },
];

export function PaymentFilterDock({
  searchQuery,
  setSearchQuery,
  methodFilter,
  setMethodFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  openDropdown,
  setOpenDropdown,
  onResetPage,
}: PaymentFilterDockProps) {
  return (
    <div className="hidden md:flex sticky top-16 z-20 px-4 py-3 bg-card/90 backdrop-blur-xl border rounded-2xl border-border/50 shadow-xs items-center justify-between gap-3 transition-all">
      {/* Desktop Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by Order #, TrxID, customer name or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onResetPage();
          }}
          className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Thematic Dropdowns */}
      <div className="flex items-center gap-2.5">
        {/* Method Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "method" ? null : "method")}
            aria-label="Filter transactions by payment method"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "method"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : methodFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Method:</span>
            <span className="max-w-[110px] truncate">
              {PAYMENT_METHODS.find((m) => m.id === methodFilter)?.label || "All Methods"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "method" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "method" && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Filter By Method
              </div>
              <div className="py-1 space-y-0.5">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setMethodFilter(method.id);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      methodFilter === method.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{method.label}</span>
                    {methodFilter === method.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
            aria-label="Filter transactions by status"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "status"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : statusFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Status:</span>
            <span className="max-w-[110px] truncate">
              {PAYMENT_STATUSES.find((s) => s.id === statusFilter)?.label.split(" ")[0] || "All"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "status" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "status" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Filter By Status
              </div>
              <div className="py-1 space-y-0.5">
                {PAYMENT_STATUSES.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status.id);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      statusFilter === status.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{status.label}</span>
                    {statusFilter === status.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            aria-label="Sort transactions"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "sort"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : sortBy !== "date-desc"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="max-w-[100px] truncate">
              {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Sort"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "sort" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Sort Transactions
              </div>
              <div className="py-1 space-y-0.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id as any);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      sortBy === opt.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && (
                      <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
