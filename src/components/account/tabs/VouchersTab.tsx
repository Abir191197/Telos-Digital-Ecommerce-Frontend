"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ticket, Copy, Check, Sparkles, Clock, ArrowRight, Tag, Percent, Truck } from "lucide-react";
import { ROUTES } from "@/constants";

interface Voucher {
  id: string;
  code: string;
  discountTitle: string;
  description: string;
  minOrder: string;
  expiry: string;
  tag: string;
  type: "percent" | "shipping";
  highlight?: boolean;
}

const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    id: "v-1",
    code: "TELOS20",
    discountTitle: "20% OFF Entire Order",
    description: "Welcome discount for all verified accounts across electronics and gear.",
    minOrder: "No minimum spend",
    expiry: "Valid until Dec 31, 2026",
    tag: "Sitewide Deal",
    type: "percent",
    highlight: true,
  },
  {
    id: "v-2",
    code: "FREESHIP",
    discountTitle: "Free Delivery Nationwide",
    description: "Free fast parcel delivery via Steadfast / Pathao across all 64 districts.",
    minOrder: "Orders over ৳2,000",
    expiry: "Valid indefinitely",
    tag: "Delivery Promo",
    type: "shipping",
    highlight: false,
  },
  {
    id: "v-3",
    code: "TELOS1000",
    discountTitle: "৳1,000 Flat Cashback",
    description: "Instant savings voucher for high-end laptops, MacBooks and flagship phones.",
    minOrder: "Orders over ৳50,000",
    expiry: "Valid until Nov 30, 2026",
    tag: "Big Ticket Saver",
    type: "percent",
    highlight: false,
  },
];

export function VouchersTab() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2500);
      }
    } catch (err) {
      console.error("Failed to copy voucher code:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow-xs">
              <Ticket className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  My Vouchers &amp; Promo Offers
                </h3>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
                  {AVAILABLE_VOUCHERS.length} Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Copy your codes and apply at checkout for instant order deductions.
              </p>
            </div>
          </div>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-95 self-start sm:self-auto"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_VOUCHERS.map((voucher) => {
          const isCopied = copiedCode === voucher.code;

          return (
            <div
              key={voucher.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-4.5 sm:p-5 transition-all shadow-xs ${
                voucher.highlight
                  ? "border-amber-500/40 bg-gradient-to-br from-card via-card to-amber-500/10 dark:from-zinc-900/90 dark:to-amber-500/10 shadow-md shadow-amber-500/10"
                  : "border-border/60 bg-card hover:border-amber-500/20"
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <Tag className="h-3 w-3" />
                    {voucher.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{voucher.expiry}</span>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-1.5">
                  {voucher.type === "percent" ? (
                    <Percent className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Truck className="h-4 w-4 text-amber-500" />
                  )}
                  <span>{voucher.discountTitle}</span>
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {voucher.description}
                </p>
              </div>

              {/* Bottom Voucher Code Pill & Copy Button */}
              <div className="mt-4 pt-4 border-t border-dashed border-border/60 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    {voucher.minOrder}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-black tracking-wider text-foreground">
                    {voucher.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(voucher.code)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-xs ${
                    isCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black shadow-amber-500/20"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
