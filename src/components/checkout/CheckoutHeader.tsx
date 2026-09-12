import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { ShieldCheck, Lock, ChevronLeft, Sparkles, PhoneCall } from "lucide-react";

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container py-3.5 flex items-center justify-between">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.CART}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-amber-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Return to Cart</span>
          </Link>

          <div className="h-4 w-px bg-border/80 hidden sm:block" />

          <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:bg-amber-600 transition-colors">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-foreground leading-none">
                TELOS<span className="text-amber-500">DIGITAL</span>
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider font-semibold">
                SECURE CHECKOUT
              </span>
            </div>
          </Link>
        </div>

        {/* Security & Support Indicators (Hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <PhoneCall className="h-3.5 w-3.5 text-amber-500" />
            <span>Assistance: </span>
            <span className="font-bold text-foreground">+880 1700-000000</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Lock className="h-3 w-3" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </header>
  );
}
