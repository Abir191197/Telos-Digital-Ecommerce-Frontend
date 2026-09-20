"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "@/validations/checkout.schema";
import {
  CreditCard,
  ShieldCheck,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStepProps {
  form: UseFormReturn<CheckoutFormValues>;
  totalAmount?: number;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export function PaymentStep({
  form,
  totalAmount = 0,
}: PaymentStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMethod = watch("paymentMethod");
  const [copied, setCopied] = useState(false);
  const merchantNumber = "01712-345678";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentOptions = [
    {
      id: "cod" as const,
      title: "Cash on Delivery",
      badge: "Cash",
      logo: null,
      isCod: true,
    },
    {
      id: "bkash" as const,
      title: "bKash",
      badge: "Instant",
      logo: "/images/payment-partners/bkash.png",
      isCod: false,
    },
    {
      id: "nagad" as const,
      title: "Nagad",
      badge: "Instant",
      logo: "/images/payment-partners/nagad.png",
      isCod: false,
    },
    {
      id: "upay" as const,
      title: "Rocket",
      badge: "Instant",
      logo: "/images/payment-partners/rocket.webp",
      isCod: false,
    },
    {
      id: "card" as const,
      title: "Credit / Debit Card",
      badge: "Secured",
      logo: "/images/payment-partners/sslcommerz.png",
      secondaryLogos: [
        "/images/payment-partners/visa.png",
        "/images/payment-partners/amex.png",
      ],
      isCod: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-5">
        {/* Header */}
        <div className="border-b border-border/50 pb-3.5">
          <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-500" />
            <span>Select Payment Method</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Zero surcharge across all payment channels. Cash on delivery available nationwide.
          </p>
        </div>

        {/* Compact Payment Methods Grid (2-columns on sm+, Cards full width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {paymentOptions.map((option) => {
            const isSelected = currentMethod === option.id;
            const isCard = option.id === "card";

            return (
              <div
                key={option.id}
                onClick={() => setValue("paymentMethod", option.id, { shouldValidate: true })}
                className={cn(
                  "group relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer",
                  isCard && "sm:col-span-2",
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40 shadow-xs"
                    : "border-border/70 bg-background/50 hover:bg-muted/30 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail / Logo Container */}
                  <div
                    className={cn(
                      "flex h-10 w-13 shrink-0 items-center justify-center rounded-xl transition-colors border overflow-hidden p-1",
                      isSelected
                        ? "bg-white border-amber-500/30 shadow-xs"
                        : "bg-white border-border/70 group-hover:border-border"
                    )}
                  >
                    {option.isCod ? (
                      <div className="flex h-full w-full flex-col items-center justify-center text-center leading-none select-none">
                        <span className="text-[8px] font-bold text-[#002D62] tracking-tight">
                          Cash on
                        </span>
                        <span className="text-[8px] font-black text-[#D12053] tracking-tight mt-0.5">
                          Delivery
                        </span>
                      </div>
                    ) : option.logo ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={option.logo}
                          alt={option.title}
                          fill
                          sizes="56px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-foreground">
                        {option.title}
                      </span>
                      {option.badge && (
                        <span className="text-[9px] font-semibold text-muted-foreground bg-muted/80 border border-border/70 px-1.5 py-0.5 rounded-md">
                          {option.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pl-2">
                  {option.secondaryLogos && (
                    <div className="hidden sm:flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-border/60">
                      {option.secondaryLogos.map((sLogo, idx) => (
                        <div key={idx} className="relative h-3.5 w-6">
                          <Image
                            src={sLogo}
                            alt="Card logo"
                            fill
                            sizes="24px"
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-500"
                        : "border-muted-foreground/30 bg-background"
                    )}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />}
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
                  Direct MFS Payment ({currentMethod === "upay" ? "ROCKET" : currentMethod.toUpperCase()})
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Send Money or Make Payment to Telos Merchant Account:
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="flex items-center gap-1.5 font-mono font-bold text-xs text-foreground bg-background px-3 py-1.5 rounded-xl border border-border/80 hover:bg-muted/40 transition-colors self-start sm:self-auto cursor-pointer"
                title="Click to copy number"
              >
                <span>{merchantNumber} (Merchant)</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Your {currentMethod === "upay" ? "Rocket" : currentMethod.toUpperCase()} Account Number *
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
                    "w-full h-10 px-3 rounded-xl border bg-background text-sm font-mono uppercase transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
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
      </div>
    </div>
  );
}
