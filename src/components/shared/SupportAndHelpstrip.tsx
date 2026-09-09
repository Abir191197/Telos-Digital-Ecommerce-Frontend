"use client";

import React from "react";
import Link from "next/link";
import { Headphones, PhoneCall, MessageCircle, Clock } from "lucide-react";
import { ROUTES } from "@/constants";

export function SupportAndHelpstrip() {
  return (
    <section aria-label="Customer Support Hub" className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 text-white shadow-lg">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-md">
              <Headphones className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 text-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Always Here For You
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                  <Clock className="h-3 w-3 text-amber-400" />
                  9 AM – 10 PM Everyday
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Need Help Choosing The Right Product?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Connect directly with our Dhaka-based technical support team via hotline or instant chat for product verification, warranty check, and order updates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-3 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <PhoneCall className="h-4 w-4" />
              <span>+880 1700-000000</span>
            </a>

            <Link
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-amber-400" />
              <span>Chat / FAQ</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
