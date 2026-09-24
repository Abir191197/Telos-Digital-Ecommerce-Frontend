"use client";

import React from "react";
import { Globe, Phone, ShieldCheck } from "lucide-react";
import { OrderSource } from "@/types/order.types";
import { cn } from "@/lib/utils";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface OrderSourceBadgeProps {
  source?: OrderSource;
  className?: string;
}

export function OrderSourceBadge({ source, className }: OrderSourceBadgeProps) {
  const s = source || "WEBSITE";

  if (s === "FACEBOOK") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-xs",
          className
        )}
      >
        <FacebookIcon className="h-3.5 w-3.5 shrink-0" />
        Facebook Order
      </span>
    );
  }

  if (s === "PHONE") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs",
          className
        )}
      >
        <Phone className="h-3.5 w-3.5 shrink-0" />
        Phone Call Order
      </span>
    );
  }

  if (s === "ADMIN") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs",
          className
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        Direct Admin Entry
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-xs",
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 shrink-0" />
      Website Storefront
    </span>
  );
}
