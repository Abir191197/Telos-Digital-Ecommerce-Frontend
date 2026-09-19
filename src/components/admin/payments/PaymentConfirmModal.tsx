"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ShieldCheck,
  CreditCard,
  Phone,
  User,
  Hash,
} from "lucide-react";
import type { AdminPaymentTransaction } from "@/stores";
import { PaymentMethodBadge } from "./PaymentBadges";

export interface PaymentConfirmModalProps {
  isOpen: boolean;
  action: "verified" | "rejected" | null;
  transaction: AdminPaymentTransaction | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (id: string, status: "verified" | "rejected", note?: string) => Promise<void>;
}

export function PaymentConfirmModal({
  isOpen,
  action,
  transaction,
  isLoading,
  onClose,
  onConfirm,
}: PaymentConfirmModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen || !transaction || !action) return null;

  const isApprove = action === "verified";

  const handleConfirm = async () => {
    await onConfirm(transaction.id, action, note.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border/60 shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={
                "flex h-10 w-10 items-center justify-center rounded-2xl " +
                (isApprove
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400")
              }
            >
              {isApprove ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-sm sm:text-base">
                {isApprove ? "Confirm Payment Approval" : "Confirm Payment Rejection"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {isApprove
                  ? "Verify this transaction and update order payment"
                  : "Flag or decline this payment transaction"}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-muted-foreground/80" />
              Order Number
            </span>
            <span className="font-mono font-bold text-foreground">
              #{transaction.orderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground/80" />
              Customer
            </span>
            <span className="font-semibold text-foreground truncate max-w-[180px]">
              {transaction.customerName}
            </span>
          </div>

          {transaction.customerPhone && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground/80" />
                Phone
              </span>
              <span className="font-mono text-muted-foreground">
                {transaction.customerPhone}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground/80" />
              Method & TrxID
            </span>
            <div className="flex items-center gap-1.5">
              <PaymentMethodBadge method={transaction.method} />
              {transaction.trxId && (
                <span className="font-mono font-bold text-[11px] text-amber-600 dark:text-amber-400">
                  {transaction.trxId}
                </span>
              )}
            </div>
          </div>

          <div className="pt-1.5 border-t border-border/40 flex items-center justify-between">
            <span className="text-muted-foreground font-bold">Transaction Amount</span>
            <span className="font-mono font-black text-sm text-foreground">
              ৳{transaction.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Confirmation Notice */}
        <div
          className={
            "p-3 rounded-2xl text-xs font-medium leading-relaxed " +
            (isApprove
              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20")
          }
        >
          {isApprove ? (
            <p>
              Are you sure you want to approve this payment? This will mark the transaction as{" "}
              <strong>Verified</strong> and update the parent order payment status to{" "}
              <strong>PAID</strong>.
            </p>
          ) : (
            <p>
              Are you sure you want to reject this payment? This will mark the transaction as{" "}
              <strong>Rejected</strong> and update the parent order payment status to{" "}
              <strong>FAILED</strong>.
            </p>
          )}
        </div>

        {/* Optional Note Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-note"
            className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
          >
            {isApprove ? "Verification Note (Optional)" : "Rejection Reason (Optional)"}
          </label>
          <input
            id="confirm-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading}
            placeholder={
              isApprove
                ? "e.g. Verified via MFS merchant statement"
                : "e.g. TrxID invalid, payment not received"
            }
            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 border border-border/50 focus:border-amber-500 focus:outline-none focus:ring-1.5 focus:ring-amber-500/30"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border/50">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border/70 text-foreground font-bold text-xs hover:bg-muted/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={
              "px-4 py-2.5 rounded-xl text-white font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-60 " +
              (isApprove
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700")
            }
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {isLoading
                ? (isApprove ? "Approving..." : "Rejecting...")
                : (isApprove ? "Yes, Approve Payment" : "Yes, Reject Payment")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
