"use client";

import React from "react";
import { CreditCard, X } from "lucide-react";
import type { AdminPaymentTransaction } from "@/stores";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentBadges";

interface PaymentInspectModalProps {
  transaction: AdminPaymentTransaction | null;
  onClose: () => void;
  onVerify: (id: string, status: "verified" | "rejected") => void;
}

export function PaymentInspectModal({
  transaction,
  onClose,
  onVerify,
}: PaymentInspectModalProps) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pb-20 sm:pb-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border/50 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-sm">
                Transaction Details
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground">
                ID: {transaction.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Key Values List */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Associated Order:</span>
            <span className="font-mono font-bold text-foreground">
              #{transaction.orderNumber}
            </span>
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Payer Name:</span>
            <span className="font-bold text-foreground">{transaction.customerName}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Payer Phone:</span>
            <span className="font-mono font-bold text-foreground">
              {transaction.customerPhone}
            </span>
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Payment Method:</span>
            <PaymentMethodBadge method={transaction.method} />
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Transaction ID (TrxID):</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {transaction.trxId || "N/A (Cash on Delivery)"}
            </span>
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Recorded Amount:</span>
            <span className="font-mono font-black text-sm text-foreground">
              ৳{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Status:</span>
            <PaymentStatusBadge status={transaction.status} />
          </div>
          <div className="flex justify-between p-2.5 rounded-2xl bg-muted/40">
            <span className="text-muted-foreground">Date:</span>
            <span className="text-muted-foreground">
              {new Date(transaction.date).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions for Pending Verification */}
        {transaction.status === "pending_verification" && (
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
            <button
              type="button"
              onClick={() => {
                onVerify(transaction.id, "rejected");
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-500/20 text-rose-600 hover:bg-rose-500/10 font-bold text-xs cursor-pointer"
            >
              Reject Payment
            </button>
            <button
              type="button"
              onClick={() => {
                onVerify(transaction.id, "verified");
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Approve &amp; Settle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
