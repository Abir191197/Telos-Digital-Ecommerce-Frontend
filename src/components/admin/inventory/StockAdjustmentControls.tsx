"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const INCREASE_REASONS = [
  "New Stock Received / Restock",
  "Supplier Purchase / Buy",
  "Customer Return",
  "Inventory Count Correction",
  "Custom / Other",
];

export const DECREASE_REASONS = [
  "Damaged / Defective Goods",
  "Stolen / Lost Inventory",
  "Expired Goods",
  "Internal Store Use / Sample",
  "Inventory Count Correction",
  "Custom / Other",
];

export const QUICK_INCREMENTS = [1, 5, 10, 25, 50, 100];

interface StockAdjustmentControlsProps {
  actionType: "INCREASE" | "DECREASE";
  onActionChange: (newType: "INCREASE" | "DECREASE") => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  customReasonText: string;
  setCustomReasonText: (text: string) => void;
}

export function StockAdjustmentControls({
  actionType,
  onActionChange,
  quantity,
  setQuantity,
  selectedReason,
  setSelectedReason,
  customReasonText,
  setCustomReasonText,
}: StockAdjustmentControlsProps) {
  return (
    <div className="md:col-span-7 space-y-3.5">
      {/* Action Type Toggle */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
          Adjustment Type
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted/40 border border-border/50">
          <button
            type="button"
            onClick={() => onActionChange("INCREASE")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              actionType === "INCREASE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Add Stock (+)</span>
          </button>
          <button
            type="button"
            onClick={() => onActionChange("DECREASE")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              actionType === "DECREASE"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingDown className="h-4 w-4" />
            <span>Remove Stock (-)</span>
          </button>
        </div>
      </div>

      {/* Quantity Controls & Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Adjustment Quantity
          </label>
          <span className="text-[10px] text-muted-foreground font-mono">
            Units to {actionType === "INCREASE" ? "add" : "deduct"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            className="h-10 w-10 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-10 w-full rounded-xl bg-background border-2 border-border/70 text-center font-mono font-black text-base text-foreground focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted-foreground">
              units
            </span>
          </div>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="h-10 w-10 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Increment Chips */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] text-muted-foreground font-semibold mr-1">Quick:</span>
          {QUICK_INCREMENTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setQuantity(amt)}
              className={cn(
                "px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors border cursor-pointer",
                quantity === amt
                  ? "bg-amber-500 text-zinc-950 border-amber-500"
                  : "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted hover:text-foreground"
              )}
            >
              {amt}
            </button>
          ))}
        </div>
      </div>

      {/* Reason Selection */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
          Reason for {actionType === "INCREASE" ? "Addition (+)" : "Reduction (-)"}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(actionType === "INCREASE" ? INCREASE_REASONS : DECREASE_REASONS).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedReason(r)}
              className={cn(
                "px-2.5 py-2 rounded-xl text-left text-[11px] font-semibold transition-all border cursor-pointer truncate",
                selectedReason === r
                  ? actionType === "INCREASE"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 font-bold"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40 font-bold"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:text-foreground"
              )}
              title={r}
            >
              {r}
            </button>
          ))}
        </div>

        {selectedReason === "Custom / Other" && (
          <input
            type="text"
            placeholder="Specify custom reason..."
            value={customReasonText}
            onChange={(e) => setCustomReasonText(e.target.value)}
            className="h-9 w-full mt-2 rounded-xl bg-background border border-border/70 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1.5 focus:ring-amber-500/40 placeholder:text-muted-foreground/60"
            required
          />
        )}
      </div>
    </div>
  );
}
