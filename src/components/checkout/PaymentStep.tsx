"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "@/validations/checkout.schema";
import {
  Banknote,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common";

interface PaymentStepProps {
  form: UseFormReturn<CheckoutFormValues>;
  totalAmount: number;
  onBack: () => void;
  isSubmitting: boolean;
}

export function PaymentStep({
  form,
  totalAmount,
  onBack,
  isSubmitting,
}: PaymentStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMethod = watch("paymentMethod");

  const paymentOptions = [
    {
      id: "cod" as const,
      title: "Cash on Delivery (COD)",
      desc: "Pay in cash when order arrives at your doorstep",
      badge: "Most Popular in BD",
      icon: Banknote,
      highlightColor: "border-amber-500",
    },
    {
      id: "bkash" as const,
      title: "bKash Direct / Merchant",
      desc: "Instant payment via bKash personal or merchant wallet",
      badge: "Instant 1.5% Cashback (Demo)",
      icon: Smartphone,
      highlightColor: "border-pink-500",
    },
    {
      id: "nagad" as const,
      title: "Nagad MFS Payment",
      desc: "Instant Bangladesh Post Office Nagad wallet payment",
      badge: "Direct MFS",
      icon: Smartphone,
      highlightColor: "border-orange-500",
    },
    {
      id: "upay" as const,
      title: "Upay / Rocket",
      desc: "UCB Upay digital financial service transfer",
      badge: "MFS Option",
      icon: Smartphone,
      highlightColor: "border-blue-500",
    },
    {
      id: "card" as const,
      title: "Credit / Debit Card (SSLCommerz)",
      desc: "Visa, Mastercard, Amex, UnionPay with 3D Secure OTP",
      badge: "Zero Surcharge",
      icon: CreditCard,
      highlightColor: "border-emerald-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-500" />
              <span>Select Payment Method</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Zero surcharge across all payment channels. Cash on delivery available nationwide.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            Open-Box Check Allowed
          </span>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-2.5">
          {paymentOptions.map((option) => {
            const isSelected = currentMethod === option.id;
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                onClick={() => setValue("paymentMethod", option.id, { shouldValidate: true })}
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40 shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/30 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isSelected
                        ? "bg-amber-500 text-zinc-950 shadow-xs"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-foreground">
                        {option.title}
                      </span>
                      {option.badge && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {option.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-3">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-zinc-950" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conditional Details based on selected payment */}
        {currentMethod === "cod" && (
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 flex items-start gap-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">Doorstep Inspection Policy:</p>
              <p className="leading-relaxed">
                Please have exact amount ready (<strong>৳{totalAmount.toLocaleString()}</strong>). You can open the outer courier bag and inspect the product box seal with the delivery agent before completing cash handover.
              </p>
            </div>
          </div>
        )}

        {["bkash", "nagad", "upay"].includes(currentMethod) && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                  Direct MFS Payment ({currentMethod.toUpperCase()})
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Send Money or Make Payment to Telos Merchant Account:
                </p>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-foreground bg-background px-3 py-1.5 rounded-xl border border-border/80 self-start sm:self-auto">
                01712-345678 (Merchant)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Your {currentMethod.toUpperCase()} Account Number *
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  {...register("mfsNumber")}
                  className={cn(
                    "w-full h-11 px-3 rounded-xl border bg-background text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                    errors.mfsNumber ? "border-rose-500" : "border-border/80"
                  )}
                />
                {errors.mfsNumber && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.mfsNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9J82KD4L"
                  {...register("trxId")}
                  className={cn(
                    "w-full h-11 px-3 rounded-xl border bg-background text-sm font-mono uppercase transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                    errors.trxId ? "border-rose-500" : "border-border/80"
                  )}
                />
                {errors.trxId && (
                  <p className="text-[11px] font-semibold text-rose-500">
                    {errors.trxId.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              💡 Demo tip: Type any active 11-digit BD number and 8-character TrxID (e.g. 01711122233 / DEMO8492).
            </p>
          </div>
        )}

        {currentMethod === "card" && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-bold text-foreground">
                  SSLCommerz Secured Payment Gateway
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-background border border-border">VISA</span>
                <span className="px-2 py-0.5 rounded bg-background border border-border">Mastercard</span>
                <span className="px-2 py-0.5 rounded bg-background border border-border">AMEX</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Upon clicking Place Order, a simulated 3D Secure gateway will process your payment securely with bank-grade encryption.
            </p>
          </div>
        )}

        {/* Buttons (Back & Submit) */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto h-12 px-5 font-semibold rounded-2xl shrink-0"
          >
            ← Back to Address
          </Button>

          <Button
            type="submit"
            variant="amber"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-12 h-auto py-3 px-6 font-bold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-transform text-xs sm:text-sm"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <span className="flex items-center justify-center gap-2 text-center">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Confirm & Place Order (৳{totalAmount.toLocaleString()})</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
