"use client";

import React from "react";
import { MapPin, Package, Check } from "lucide-react";
import { AppImage } from "@/components/shared";
import type { CustomerUser } from "@/stores";
import type { AccountTabKey } from "../accountNavData";

interface OverviewQuickCardsGridProps {
  user: CustomerUser;
  onSelectTab: (tab: AccountTabKey) => void;
}

export function OverviewQuickCardsGrid({ user, onSelectTab }: OverviewQuickCardsGridProps) {
  const primaryAddress = user.addresses[0];

  return (
    <div className="order-3 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Address Book Snapshot */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Primary Delivery Address
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("addresses")}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-1.5">
            {primaryAddress ? (
              <>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {primaryAddress.name}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">
                    {primaryAddress.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {primaryAddress.street}, {primaryAddress.area},{" "}
                  {primaryAddress.city} - {primaryAddress.postalCode}
                </p>
                <p className="text-xs text-foreground font-mono font-medium">
                  Phone: {primaryAddress.phone}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                No default delivery address configured yet.
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Courier Availability</span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Steadfast & Pathao
          </span>
        </div>
      </div>

      {/* 2. Saved Payment Methods Snapshot */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Default Payment Method
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("payments")}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-14 rounded-xl bg-white dark:bg-white/95 p-1 flex items-center justify-center border border-border/40 shadow-2xs shrink-0 overflow-hidden">
                  <AppImage
                    src="/images/payment-partners/bkash.png"
                    alt="bKash"
                    fill
                    className="object-contain p-1"
                    fallbackIconSize={16}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">bKash Personal</p>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    017***-**678
                  </p>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Default Checkout</span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            1-Tap Ready
          </span>
        </div>
      </div>
    </div>
  );
}
