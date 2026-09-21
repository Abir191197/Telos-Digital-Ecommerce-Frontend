"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  AlertCircle,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";
import { useAdjustStockMutation } from "@/services/api/inventory/inventoryApi";
import { StockPreviewPanel } from "./StockPreviewPanel";
import {
  StockAdjustmentControls,
  INCREASE_REASONS,
  DECREASE_REASONS,
} from "./StockAdjustmentControls";

interface ManageStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onStockUpdated: (message: string) => void;
}

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

        {/* Two-Column Form */}
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column: Product Snapshot & Real-Time Math Trajectory */}
            <StockPreviewPanel
              product={product}
              currentStock={currentStock}
              actionType={actionType}
              quantity={quantity}
              resultingStock={resultingStock}
              isInvalidReduction={isInvalidReduction}
              note={note}
              setNote={setNote}
            />

            {/* Right Column: Adjustment Type, Quantity Stepper, & Reasons */}
            <StockAdjustmentControls
              actionType={actionType}
              onActionChange={handleActionChange}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedReason={selectedReason}
              setSelectedReason={setSelectedReason}
              customReasonText={customReasonText}
              setCustomReasonText={setCustomReasonText}
            />
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
