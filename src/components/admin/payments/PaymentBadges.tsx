"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, Smartphone, CreditCard } from "lucide-react";
import type { AdminPaymentTransaction } from "@/stores";

export function PaymentMethodBadge({
  method,
}: {
  method: AdminPaymentTransaction["method"];
}) {
  switch (method) {
    case "bkash":
      return (
        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
          <Smartphone className="h-3 w-3" />
          bKash
        </span>
      );
    case "nagad":
      return (
        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          <Smartphone className="h-3 w-3" />
          Nagad
        </span>
      );
    case "card":
      return (
        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <CreditCard className="h-3 w-3" />
          Card / Gateway
        </span>
      );
    case "cod":
      return (
        <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
          Cash on Delivery
        </span>
      );
    default:
      return (
        <span className="font-mono text-xs text-foreground uppercase">
          {method}
        </span>
      );
  }
}

export function PaymentStatusBadge({
  status,
}: {
  status: AdminPaymentTransaction["status"];
}) {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </span>
      );
    case "pending_verification":
      return (
        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[11px] bg-amber-500/15 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <Clock className="h-3 w-3 animate-pulse" />
          Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-[11px] bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
  }
}
