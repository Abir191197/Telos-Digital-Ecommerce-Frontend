"use client";

import React from "react";
import Link from "next/link";
import { Phone, Tag, Truck, Info } from "lucide-react";
import { ROUTES } from "@/constants";

export function TopUtilityBar() {
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
            className="font-medium text-zinc-100 hover:text-amber-400 transition-colors"
          >
            +880 1700-000000
          </a>
        </div>

        {/* Center: Discount Promotion Announcement */}
        <div className="hidden md:flex items-center gap-2 overflow-hidden text-center truncate text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 tracking-wide">
            <Tag className="h-3 w-3" />
            HOT DEAL
          </span>
          <span className="truncate text-zinc-200">
            Free delivery on orders over ৳2,000 | Use code{" "}
            <strong className="text-amber-400 font-mono tracking-wider underline underline-offset-2">
              TELOS20
            </strong>{" "}
            for 20% OFF
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-300">
          <Link
            href={ROUTES.TRACKING}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Truck className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Track Order</span>
          </Link>
          <span className="h-3 w-px bg-zinc-800" />
          <Link
            href={ROUTES.ABOUT}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">About Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
