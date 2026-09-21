"use client";

import React from "react";
import { Truck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartFreeShippingBarProps {
  freeShippingRemaining: number;
  freeShippingProgress: number;
  perksUnlocked: {
    stickers: boolean;
    freeDelivery: boolean;
    extendedWarranty: boolean;
  };
}

export function CartFreeShippingBar({
  freeShippingRemaining,
  freeShippingProgress,
  perksUnlocked,
}: CartFreeShippingBarProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-6 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-all">
      {/* Subtle ambient light gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl"
      />

      <div className="relative z-10 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
                freeShippingRemaining === 0
                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-muted/80 text-muted-foreground border border-border/60"
              )}
            >
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              {freeShippingRemaining === 0 ? (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-black tracking-tight text-foreground">
                    Free Delivery Qualified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <Check className="h-2.5 w-2.5" /> ৳0 Shipping
                  </span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Add{" "}
                  <span className="text-amber-500 font-black">
                    ৳{freeShippingRemaining.toLocaleString()}
                  </span>{" "}
                  for Free Delivery
                </p>
              )}
              <p className="text-[11px] text-muted-foreground pt-0.5 hidden xs:block">
                Express courier coverage across all 64 districts
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs sm:text-sm font-black tabular-nums text-foreground">
              {freeShippingProgress}%
            </span>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">
              Goal ৳5,000
            </p>
          </div>
        </div>

        {/* Track & Fill */}
        <div className="relative h-2 w-full rounded-full bg-muted/70 p-0.5 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out shadow-xs",
              freeShippingRemaining === 0
                ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "bg-linear-to-r from-amber-600/80 to-amber-400"
            )}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>

        {/* Tiered Milestone Indicators */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-border/50 text-[10px] sm:text-[11px]">
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 transition-colors truncate",
              perksUnlocked.stickers
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                perksUnlocked.stickers
                  ? "bg-amber-500 ring-2 ring-amber-500/30"
                  : "bg-muted-foreground/40"
              )}
            />
            <span className="truncate">৳2k Freebie</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 justify-center transition-colors truncate",
              perksUnlocked.freeDelivery
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                perksUnlocked.freeDelivery
                  ? "bg-amber-500 ring-2 ring-amber-500/30"
                  : "bg-muted-foreground/40"
              )}
            />
            <span className="truncate">৳5k Delivery</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 justify-end transition-colors truncate",
              perksUnlocked.extendedWarranty
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                perksUnlocked.extendedWarranty
                  ? "bg-amber-500 ring-2 ring-amber-500/30"
                  : "bg-muted-foreground/40"
              )}
            />
            <span className="truncate">৳15k VIP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
