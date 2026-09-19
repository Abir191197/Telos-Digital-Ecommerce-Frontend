"use client";

import React from "react";
import { AlertTriangle, PackageX, ArrowRight, ShoppingBag } from "lucide-react";
import type { StockIssue } from "@/services/api/orders/orderApi";

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: StockIssue[];
  remainingCount: number;
}

export function StockAlertModal({
  isOpen,
  onClose,
  issues,
  remainingCount,
}: StockAlertModalProps) {
  if (!isOpen || issues.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-rose-500/30 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
            <PackageX className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground tracking-tight">
              Stock Availability Alert
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Some items in your cart are no longer available in the requested quantity.
            </p>
          </div>
        </div>

        {/* Removed Items List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {issues.map((issue, idx) => (
            <div
              key={`${issue.productId}-${idx}`}
              className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-foreground leading-snug">
                  {issue.productName}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
                  {issue.issueType === "OUT_OF_STOCK"
                    ? "Out of Stock"
                    : issue.issueType === "INACTIVE"
                    ? "Unavailable"
                    : "Low Stock"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {issue.message}
              </p>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            {remainingCount > 0
              ? `Unavailable items have been removed. You have ${remainingCount} item(s) ready to checkout.`
              : "All unavailable items have been removed from your shopping bag."}
          </span>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
          >
            {remainingCount > 0 ? (
              <>
                <span>Continue With Remaining Items</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Return To Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
