"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Copy, Check, Eye } from "lucide-react";
import type { AdminPaymentTransaction } from "@/stores";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentBadges";

interface PaymentDesktopTableProps {
  transactions: AdminPaymentTransaction[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onSelectTxn: (txn: AdminPaymentTransaction) => void;
  onVerify: (id: string, status: "verified" | "rejected") => void;
}

export function PaymentDesktopTable({
  transactions,
  copiedId,
  onCopy,
  onSelectTxn,
  onVerify,
}: PaymentDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45),0_18px_50px_-8px_rgba(0,0,0,0.35)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              <th className="py-3.5 px-4">Order # &amp; TrxID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Verification &amp; Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground text-xs"
                >
                  No payment transaction logs match the selected filter.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-foreground">
                        #{txn.orderNumber}
                      </span>
                      <Link
                        href={`/dashboard/orders?search=${txn.orderNumber}`}
                        className="text-muted-foreground hover:text-amber-500 transition-colors"
                        title="View Order"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <p className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        {txn.trxId || "Cash on Delivery"}
                      </p>
                      {txn.trxId && (
                        <button
                          type="button"
                          onClick={() => onCopy(txn.trxId!, txn.id)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                          title="Copy TrxID"
                        >
                          {copiedId === txn.id ? (
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-foreground">{txn.customerName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {txn.customerPhone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentMethodBadge method={txn.method} />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-foreground text-sm">
                    ৳{txn.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                    {new Date(txn.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentStatusBadge status={txn.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectTxn(txn)}
                        className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        title="Inspect Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {txn.status === "pending_verification" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onVerify(txn.id, "verified")}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onVerify(txn.id, "rejected")}
                            className="px-2 py-1 rounded-xl border border-border/80 text-rose-600 hover:bg-rose-500/10 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-muted-foreground pr-2 font-mono">
                          Settled
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
