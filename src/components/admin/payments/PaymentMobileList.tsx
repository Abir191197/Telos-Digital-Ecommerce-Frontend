"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Copy, Check, Eye } from "lucide-react";
import type { AdminPaymentTransaction } from "@/stores";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentBadges";

interface PaymentMobileListProps {
  transactions: AdminPaymentTransaction[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onSelectTxn: (txn: AdminPaymentTransaction) => void;
  onVerify: (id: string, status: "verified" | "rejected") => void;
}

export function PaymentMobileList({
  transactions,
  copiedId,
  onCopy,
  onSelectTxn,
  onVerify,
}: PaymentMobileListProps) {
  if (transactions.length === 0) {
    return (
      <div className="block md:hidden p-8 text-center text-muted-foreground text-xs rounded-3xl bg-card">
        No payment transaction logs match the selected filter.
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          className="p-4 rounded-3xl bg-card border-none shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)] space-y-3"
        >
          {/* Header row: Order # and status badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-foreground text-sm">
                  #{txn.orderNumber}
                </span>
                <Link
                  href={`/dashboard/orders?search=${txn.orderNumber}`}
                  className="text-muted-foreground hover:text-amber-500"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(txn.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <PaymentStatusBadge status={txn.status} />
          </div>

          {/* Customer & Amount details */}
          <div className="flex items-center justify-between text-xs py-2 border-y border-border/40">
            <div>
              <p className="font-bold text-foreground">{txn.customerName}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {txn.customerPhone}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-black text-foreground text-sm">
                ৳{txn.amount.toLocaleString()}
              </p>
              <div className="mt-0.5">
                <PaymentMethodBadge method={txn.method} />
              </div>
            </div>
          </div>

          {/* TrxID pill */}
          {txn.trxId && (
            <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-2xl text-[11px]">
              <span className="text-muted-foreground">TrxID:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                <span>{txn.trxId}</span>
                <button
                  type="button"
                  onClick={() => onCopy(txn.trxId!, txn.id)}
                  className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copiedId === txn.id ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Actions: Inspect, Approve, Reject */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSelectTxn(txn)}
              className="px-3 py-1.5 rounded-xl bg-muted/60 text-foreground font-bold text-xs flex items-center gap-1 hover:bg-muted"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Inspect</span>
            </button>

            {txn.status === "pending_verification" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onVerify(txn.id, "verified")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onVerify(txn.id, "rejected")}
                  className="px-3 py-1.5 rounded-xl border border-border/80 text-rose-600 hover:bg-rose-500/10 font-bold text-xs cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
