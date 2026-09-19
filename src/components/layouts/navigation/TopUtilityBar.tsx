"use client";

import { ROUTES } from "@/constants";
import { Check, Copy, Info, Phone, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TopUtilityBar() {
  const [copied, setCopied] = useState(false);
  const VOUCHER_CODE = "TELOS20";

  const handleCopyVoucher = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(VOUCHER_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy voucher code:", err);
    }
  };

  return (
    <div className="border-b border-zinc-800 bg-[#0c0d0e] text-xs text-zinc-300 dark:bg-[#08090a] dark:border-zinc-800/80 transition-colors">
      <div className="container flex h-9 items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: BD Support / Hotline */}
        <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
          <Phone className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden xs:inline text-zinc-400 font-normal">
            Support Hotline:
          </span>
          <a
            href="tel:+8801700000000"
            className="font-medium text-zinc-100 hover:text-amber-400 transition-colors">
            +880 1700-000000
          </a>
        </div>

        {/* Center: Discount Promotion Announcement with Click-to-Copy Voucher */}
        <div className="hidden md:flex items-center gap-2 overflow-hidden text-center truncate text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 tracking-wide">
            <Tag className="h-3 w-3" />
            HOT DEAL
          </span>
          <span className="truncate text-zinc-200 flex items-center gap-1.5">
            Free delivery on orders over ৳2,000 | Use code
            <button
              type="button"
              onClick={handleCopyVoucher}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold tracking-wider text-xs transition-all cursor-pointer select-none bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 active:scale-95">
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400 stroke-[2.5]" />
                  <span className="text-emerald-400 font-sans text-[11px] font-bold">
                    COPIED!
                  </span>
                </>
              ) : (
                <>
                  <span className="underline underline-offset-2">
                    {VOUCHER_CODE}
                  </span>
                  <Copy className="h-2.5 w-2.5 opacity-80" />
                </>
              )}
            </button>
            for 20% OFF
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-300">
          <Link
            href={ROUTES.TRACKING}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Truck className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Track Order</span>
          </Link>
          <span className="h-3 w-px bg-zinc-800" />
          <Link
            href={ROUTES.ABOUT}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">About Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
