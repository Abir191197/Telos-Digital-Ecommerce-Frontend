"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancelOrderModalProps {
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (orderNumber: string, reason: string) => void;
}

const CANCEL_REASONS = [
  "Found a cheaper price elsewhere",
  "Changed my mind / No longer needed",
  "Ordered by mistake / duplicate order",
  "Need to modify delivery address or phone",
  "Delivery timeframe is too long",
  "Other personal reason",
];

export function CancelOrderModal({
  orderNumber,
  isOpen,
  onClose,
  onConfirmCancel,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const finalReason =
        selectedReason === "Other personal reason" && customNotes
          ? `Other: ${customNotes}`
          : selectedReason;
      onConfirmCancel(orderNumber, finalReason);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 sm:p-7 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Cancel Order</h3>
            <p className="text-xs text-muted-foreground">
              Order reference: <strong className="font-mono text-foreground">#{orderNumber}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          Order cancellation is immediate. If you paid online via bKash, Nagad, or Card, refund processing takes 24–48 hours to your original method.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Please select reason for cancellation:
            </label>
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all",
                    selectedReason === reason
                      ? "border-amber-500 bg-amber-500/5 font-semibold text-foreground shadow-2xs"
                      : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                      selectedReason === reason
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-muted-foreground/50"
                    )}
                  >
                    {selectedReason === reason && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Other personal reason" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Additional Comments
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Describe your cancellation reason..."
                className="mt-1 w-full rounded-xl border border-border/80 bg-background p-2.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
