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
    <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5 shadow-xs">
      <div className="border-b border-border/60 pb-3">
        <h3 className="text-base font-bold text-foreground">
          Notification Alerts
        </h3>
        <p className="text-xs text-muted-foreground">
          Configure real-time courier SMS updates and promotional notices.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
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
            className="h-4 w-4 rounded accent-amber-500"
          />
        </label>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
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
            className="h-4 w-4 rounded accent-amber-500"
          />
        </label>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
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
            className="h-4 w-4 rounded accent-amber-500"
          />
        </label>
      </div>
    </div>
  );
}
