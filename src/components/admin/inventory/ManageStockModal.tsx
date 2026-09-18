"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";
import { useAdjustStockMutation } from "@/services/api/inventory/inventoryApi";

interface ManageStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onStockUpdated: (message: string) => void;
}

const INCREASE_REASONS = [
  "New Stock Received / Restock",
  "Supplier Purchase / Buy",
  "Customer Return",
  "Inventory Count Correction",
  "Custom / Other",
];

const DECREASE_REASONS = [
  "Damaged / Defective Goods",
  "Stolen / Lost Inventory",
  "Expired Goods",
  "Internal Store Use / Sample",
  "Inventory Count Correction",
  "Custom / Other",
];

const QUICK_INCREMENTS = [1, 5, 10, 25, 50, 100];

export function ManageStockModal({
  product,
  isOpen,
  onClose,
  onStockUpdated,
}: ManageStockModalProps) {
  const [actionType, setActionType] = useState<"INCREASE" | "DECREASE">("INCREASE");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string>(INCREASE_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [adjustStockMutation, { isLoading: isAdjusting }] = useAdjustStockMutation();

  useEffect(() => {
    if (product) {
      setActionType("INCREASE");
      setQuantity(1);
      setSelectedReason(INCREASE_REASONS[0]);
      setCustomReasonText("");
      setNote("");
      setErrorMsg(null);
    }
  }, [product]);

  // When switching actionType, update default reason
  const handleActionChange = (newType: "INCREASE" | "DECREASE") => {
    setActionType(newType);
    setSelectedReason(newType === "INCREASE" ? INCREASE_REASONS[0] : DECREASE_REASONS[0]);
    setErrorMsg(null);
  };

  if (!isOpen || !product) return null;

  const currentStock = Number(product.stock) || 0;
  const delta = actionType === "INCREASE" ? quantity : -quantity;
  const resultingStock = currentStock + delta;
  const isInvalidReduction = actionType === "DECREASE" && quantity > currentStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setErrorMsg("Quantity must be at least 1 unit.");
      return;
    }

    if (isInvalidReduction) {
      setErrorMsg(
        `Cannot reduce ${quantity} units. Available stock is only ${currentStock} units.`
      );
      return;
    }

    const finalReason =
      selectedReason === "Custom / Other"
        ? customReasonText.trim() || "Custom Adjustment"
        : selectedReason;

    try {
      setErrorMsg(null);
      await adjustStockMutation({
        productId: product.id,
        actionType,
        quantity,
        reason: finalReason,
        note: note.trim() || undefined,
      }).unwrap();

      onStockUpdated(
        `Stock for "${product.name}" ${
          actionType === "INCREASE" ? "increased" : "reduced"
        } by ${quantity} units. Audit log recorded.`
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to adjust stock. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div
        className="w-full max-w-4xl rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-foreground">Adjust Product Stock</h2>
              <p className="text-xs text-muted-foreground">
                All additions and reductions are logged in the immutable audit trail
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Two-Column Form for Clean Single-Page Layout */}
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column: Product Snapshot & Real-Time Math Trajectory */}
            <div className="md:col-span-5 space-y-3.5">
              {/* Product Snapshot */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/50">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/40">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                      No Pic
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-muted-foreground font-mono">
                    <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                      SKU: {product.sku || "N/A"}
                    </span>
                    {product.categoryName && (
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                        {product.categoryName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Math Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/60 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Balance Trajectory</span>
                  <span className="text-[10px] font-normal text-muted-foreground">Preview</span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center text-center">
                  {/* Current */}
                  <div className="p-2 rounded-xl bg-background/80 border border-border/50">
                    <p className="text-[10px] text-muted-foreground font-semibold">Current</p>
                    <p className="text-base font-black font-mono text-foreground mt-0.5">
                      {currentStock}
                    </p>
                  </div>

                  {/* Delta */}
                  <div
                    className={cn(
                      "p-2 rounded-xl border font-mono font-black text-sm",
                      actionType === "INCREASE"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    <p className="text-[10px] font-semibold opacity-80">Change</p>
                    <p className="mt-0.5">
                      {actionType === "INCREASE" ? `+${quantity}` : `-${quantity}`}
                    </p>
                  </div>

                  {/* Resulting */}
                  <div
                    className={cn(
                      "p-2 rounded-xl border",
                      resultingStock < 0
                        ? "bg-rose-500/15 border-rose-500/40"
                        : "bg-background/80 border-border/50"
                    )}
                  >
                    <p className="text-[10px] text-muted-foreground font-semibold">New Total</p>
                    <p
                      className={cn(
                        "text-base font-black font-mono mt-0.5",
                        resultingStock < 0
                          ? "text-rose-600"
                          : resultingStock <= (product.lowStockThreshold || 5)
                          ? "text-amber-500"
                          : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {resultingStock}
                    </p>
                  </div>
                </div>

                {isInvalidReduction && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Exceeds available stock ({currentStock} units)</span>
                  </div>
                )}
              </div>

              {/* Optional Reference Note */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Note / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO #1042 or damaged box receipt"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1.5 focus:ring-amber-500/40 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Right Column: Adjustment Type, Quantity Stepper, & Reasons */}
            <div className="md:col-span-7 space-y-3.5">
              {/* Action Type Toggle: INCREASE (+) vs DECREASE (-) */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted/40 border border-border/50">
                  <button
                    type="button"
                    onClick={() => handleActionChange("INCREASE")}
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
                    onClick={() => handleActionChange("DECREASE")}
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
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 mt-3.5 p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 mt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdjusting || isInvalidReduction}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                actionType === "INCREASE"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              )}
            >
              {isAdjusting ? (
                <span>Recording Audit...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>
                    Confirm {actionType === "INCREASE" ? "Addition (+)" : "Reduction (-)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
