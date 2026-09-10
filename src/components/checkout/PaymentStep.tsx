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
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-sm space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-500" />
            <span>Select Payment Method</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose your preferred payment method. Cash on Delivery is default for Bangladesh orders.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-3">
          {paymentOptions.map((option) => {
            const isSelected = currentMethod === option.id;
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                onClick={() => setValue("paymentMethod", option.id, { shouldValidate: true })}
                className={cn(
                  "relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer gap-2 sm:gap-4",
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500 shadow-xs"
                    : "border-border/80 bg-card hover:bg-muted/40 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-foreground">
                        {option.title}
                      </span>
                      {option.badge && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {option.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conditional Details based on selected payment */}
        {currentMethod === "cod" && (
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 flex items-start gap-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Cash on Delivery Instructions:</p>
              <p className="mt-0.5">
                Please keep exact cash ready (৳{totalAmount.toLocaleString()}) upon parcel arrival. Our delivery agent will allow opening the outer packaging in their presence to verify authentic product seal before collecting payment.
              </p>
            </div>
          </div>
        )}

        {["bkash", "nagad", "upay"].includes(currentMethod) && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                  Direct MFS Simulation ({currentMethod.toUpperCase()})
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Send Money or Merchant Pay to Telos BD Account:
                </p>
              </div>
              <div className="text-right font-mono font-bold text-xs sm:text-sm text-foreground bg-background px-3 py-1 rounded-xl border border-border/80">
                01712-345678 (Merchant)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Your {currentMethod.toUpperCase()} Wallet Number *
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  {...register("mfsNumber")}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-background text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                    errors.mfsNumber ? "border-rose-500" : "border-border/80"
                  )}
                />
                {errors.mfsNumber && (
                  <p className="text-[11px] font-medium text-rose-500">
                    {errors.mfsNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9J82KD4L"
                  {...register("trxId")}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl border bg-background text-sm font-mono uppercase transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                    errors.trxId ? "border-rose-500" : "border-border/80"
                  )}
                />
                {errors.trxId && (
                  <p className="text-[11px] font-medium text-rose-500">
                    {errors.trxId.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Tip for demo: Enter any active 11-digit number and 8-character TrxID (e.g. 01711122233 / DEMO8492).
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
                <span className="px-1.5 py-0.5 rounded bg-background border border-border">VISA</span>
                <span className="px-1.5 py-0.5 rounded bg-background border border-border">Mastercard</span>
                <span className="px-1.5 py-0.5 rounded bg-background border border-border">AMEX</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Upon clicking Place Order, a simulated 3D Secure gateway will process your payment securely with bank-grade encryption.
            </p>
          </div>
        )}

        {/* Buttons (Back & Submit) */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 h-12 rounded-2xl border border-border/80 hover:bg-muted text-foreground text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            ← Back to Delivery Address
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Confirm & Place Order (৳{totalAmount.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
