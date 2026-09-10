"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Upload, RotateCcw, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Order, OrderItem } from "@/types/order.types";
import { cn } from "@/lib/utils";

interface ReturnRequestModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReturn: (returnTicket: ReturnTicketData) => void;
}

export interface ReturnTicketData {
  orderId: string;
  orderNumber: string;
  itemId: string;
  productName: string;
  productThumbnail: string;
  reason: string;
  conditionNotes: string;
  resolutionType: "replacement" | "refund";
  hasPhoto: boolean;
}

const RETURN_REASONS = [
  "Item has hardware defect / does not turn on",
  "Incorrect item or color variant received",
  "Physical damage incurred during courier transit",
  "Missing accessories or warranty card in box",
  "Performance does not match official specifications",
];

export function ReturnRequestModal({
  order,
  isOpen,
  onClose,
  onSubmitReturn,
}: ReturnRequestModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    order?.items[0]?.id || ""
  );
  const [reason, setReason] = useState<string>(RETURN_REASONS[0]);
  const [resolutionType, setResolutionType] = useState<"replacement" | "refund">(
    "replacement"
  );
  const [conditionNotes, setConditionNotes] = useState<string>("");
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const currentItem =
    order.items.find((i) => i.id === selectedItemId) || order.items[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReturn({
        orderId: order.id,
        orderNumber: order.orderNumber,
        itemId: currentItem.id,
        productName: currentItem.productName,
        productThumbnail: currentItem.productThumbnail,
        reason,
        conditionNotes,
        resolutionType,
        hasPhoto: mockPhotoUploaded,
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-background p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              7-Day Return & Replacement Request
            </h3>
            <p className="text-xs text-muted-foreground">
              Order: <strong className="font-mono text-foreground">#{order.orderNumber}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Item */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Select Product to Return:
            </label>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all",
                    selectedItemId === item.id
                      ? "border-amber-500 bg-amber-500/5 shadow-2xs"
                      : "border-border/70 hover:bg-muted/40"
                  )}
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0">
                    <Image
                      src={item.productThumbnail}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-[10px] text-muted-foreground">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      ৳{item.unitPrice.toLocaleString()} (Qty: {item.quantity})
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                      selectedItemId === item.id
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {selectedItemId === item.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Preferred Resolution:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResolutionType("replacement")}
                className={cn(
                  "p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer",
                  resolutionType === "replacement"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                )}
              >
                Fast Replacement
              </button>
              <button
                type="button"
                onClick={() => setResolutionType("refund")}
                className={cn(
                  "p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer",
                  resolutionType === "refund"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                )}
              >
                Full Refund
              </button>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Reason for Return:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Problem Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Describe Issue Details:
            </label>
            <textarea
              required
              rows={3}
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Please explain the issue or defect observed..."
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Photo upload mock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Attach Photos / Evidence (Optional):</span>
              {mockPhotoUploaded && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Attached (1 file)
                </span>
              )}
            </label>
            <div
              onClick={() => setMockPhotoUploaded(!mockPhotoUploaded)}
              className={cn(
                "border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all",
                mockPhotoUploaded
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border/80 hover:border-amber-500 hover:bg-muted/40"
              )}
            >
              <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs font-bold text-foreground">
                {mockPhotoUploaded ? "Photo Attached (Click to remove)" : "Click to Upload Photo or Unboxing Video"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PNG, JPG, MP4 up to 25MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border/80 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Return Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
