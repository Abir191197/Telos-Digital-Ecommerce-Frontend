"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { ROUTES } from "@/constants";
import { ManualOrderForm } from "./manual-order";

export function ManualOrderView() {
  return (
    <div className="w-full space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.DASHBOARD + "/orders"}
            className="p-2.5 rounded-xl border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                Admin Order Entry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-amber-500 shrink-0" />
              Create Manual Order
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Place orders on behalf of customers from Facebook, phone calls, or direct admin entry.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Form ── */}
      <ManualOrderForm />
    </div>
  );
}
