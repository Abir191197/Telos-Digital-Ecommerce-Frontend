"use client";

import React from "react";
import { CreditCard, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "upay" | "card";

export interface PaymentInfo {
  paymentMethod: PaymentMethod;
  trxId: string;
  mfsNumber: string;
  amount: string;
}

interface PaymentDetailsSectionProps {
  payment: PaymentInfo;
  onPaymentChange: (payment: PaymentInfo) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; color: string }[] = [
  { value: "cod", label: "Cash on Delivery", color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
  { value: "bkash", label: "bKash", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20" },
  { value: "nagad", label: "Nagad", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  { value: "upay", label: "Upay", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { value: "card", label: "Card", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
];

export function PaymentDetailsSection({ payment, onPaymentChange }: PaymentDetailsSectionProps) {
  const needsMfsField = payment.paymentMethod !== "cod" && payment.paymentMethod !== "card";
  const needsCardField = payment.paymentMethod === "card";

  const update = (partial: Partial<PaymentInfo>) =>
    onPaymentChange({ ...payment, ...partial });

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10">
          <CreditCard className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Payment Details</h3>
      </div>

      {/* Method Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              type="button"
              id={`payment-method-${method.value}`}
              onClick={() => update({ paymentMethod: method.value })}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                payment.paymentMethod === method.value
                  ? method.color + " shadow-xs scale-[1.02]"
                  : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60"
              )}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional: MFS Number (bKash/Nagad/Upay) */}
      {needsMfsField && (
        <div className="space-y-1.5">
          <label htmlFor="mfs-number-input" className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Hash className="h-3 w-3" />
            MFS Number (Sender)
          </label>
          <input
            id="mfs-number-input"
            type="text"
            value={payment.mfsNumber}
            onChange={(e) => update({ mfsNumber: e.target.value })}
            placeholder="01XXXXXXXXX"
            className={cn(
              "h-10 w-full rounded-xl bg-muted/40 border border-border/50 px-3.5 text-sm font-mono font-medium text-foreground",
              "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
              "placeholder:text-muted-foreground/50 placeholder:font-normal"
            )}
          />
        </div>
      )}

      {/* Transaction ID */}
      {payment.paymentMethod !== "cod" && (
        <div className="space-y-1.5">
          <label htmlFor="trx-id-input" className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Hash className="h-3 w-3" />
            Transaction ID {needsCardField ? "(Authorization Code)" : "(TrxID)"}
          </label>
          <input
            id="trx-id-input"
            type="text"
            value={payment.trxId}
            onChange={(e) => update({ trxId: e.target.value })}
            placeholder={needsCardField ? "Auth code" : "e.g. 3AG8HTXY6N"}
            className={cn(
              "h-10 w-full rounded-xl bg-muted/40 border border-border/50 px-3.5 text-sm font-mono font-medium text-foreground",
              "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
              "placeholder:text-muted-foreground/50 placeholder:font-normal"
            )}
          />
        </div>
      )}

      {/* Payment Amount */}
      <div className="space-y-1.5">
        <label htmlFor="payment-amount-input" className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <CreditCard className="h-3 w-3" />
          Amount Paid (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">৳</span>
          <input
            id="payment-amount-input"
            type="number"
            min={0}
            value={payment.amount}
            onChange={(e) => update({ amount: e.target.value })}
            placeholder="0"
            className={cn(
              "h-10 w-full rounded-xl bg-muted/40 border border-border/50 pl-7 pr-3.5 text-sm font-mono font-bold text-foreground",
              "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
              "placeholder:text-muted-foreground/40 placeholder:font-normal"
            )}
          />
        </div>
      </div>
    </div>
  );
}
