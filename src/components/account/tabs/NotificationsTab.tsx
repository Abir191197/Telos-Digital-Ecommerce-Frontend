"use client";

import React, { useState } from "react";
import type { CustomerUser } from "@/stores";

interface NotificationsTabProps {
  user: CustomerUser;
}

export function NotificationsTab({ user }: NotificationsTabProps) {
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  return (
    <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-6 sm:p-7 space-y-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)]">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          Notification Alerts
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure real-time courier SMS updates, digital invoices, and promotional notices.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/30 hover:border-border/60 hover:bg-gradient-to-r hover:from-amber-500/[0.04] hover:to-transparent transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-xs font-bold text-foreground">
              SMS Order Tracking Alerts
            </p>
            <p className="text-[11px] text-muted-foreground">
              Receive courier OTP and dispatch SMS on {user.phone}
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifSms}
            onChange={(e) => setNotifSms(e.target.checked)}
            className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/30 hover:border-border/60 hover:bg-gradient-to-r hover:from-amber-500/[0.04] hover:to-transparent transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-xs font-bold text-foreground">
              Email Invoices & Receipts
            </p>
            <p className="text-[11px] text-muted-foreground">
              Digital VAT invoices sent directly to {user.email}
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifEmail}
            onChange={(e) => setNotifEmail(e.target.checked)}
            className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/30 hover:border-border/60 hover:bg-gradient-to-r hover:from-amber-500/[0.04] hover:to-transparent transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-xs font-bold text-foreground">
              Promotions & Flash Sale Alerts
            </p>
            <p className="text-[11px] text-muted-foreground">
              Exclusive discount codes and weekend flash sale notifications
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifPromos}
            onChange={(e) => setNotifPromos(e.target.checked)}
            className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
