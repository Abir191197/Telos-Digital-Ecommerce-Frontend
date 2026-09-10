"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/stores";
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  ShieldCheck,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPaymentsView() {
  const { transactions, verifyTransaction } = useAdminStore();
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTxns = transactions.filter((t) => {
    const matchesMethod = methodFilter === "all" || t.method === methodFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.orderNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.trxId?.toLowerCase().includes(q) ||
      t.customerPhone.includes(q);

    return matchesMethod && matchesSearch;
  });

  const totalVerified = transactions
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingVerification = transactions.filter(
    (t) => t.status === "pending_verification"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Payments & MFS TrxID Reconciliation
          </h1>
          <p className="text-xs text-muted-foreground">
            Verify manual bKash & Nagad Transaction IDs, reconcile COD, and monitor payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-xl">
            ৳{totalVerified.toLocaleString()} Verified Collections
          </span>
        </div>
      </div>

      {/* Pending Action Banner */}
      {pendingVerification.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-foreground">
                {pendingVerification.length} Transaction(s) Pending Verification
              </p>
              <p className="text-muted-foreground">
                Cross-check incoming bKash/Nagad SMS notifications against submitted TrxIDs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order #, TrxID, customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-4 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Methods" },
            { id: "bkash", label: "bKash" },
            { id: "nagad", label: "Nagad" },
            { id: "cod", label: "Cash on Delivery" },
            { id: "card", label: "Cards" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethodFilter(m.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                methodFilter === m.id
                  ? "bg-amber-500 text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4">Order & TrxID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-foreground">
                      #{txn.orderNumber}
                    </p>
                    <p className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                      {txn.trxId || "COD (Payment on delivery)"}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground">{txn.customerName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {txn.customerPhone}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-muted/60 text-foreground">
                      {txn.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-foreground text-sm">
                    ৳{txn.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-[11px]">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {txn.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-500/15 px-2 py-0.5 rounded-full uppercase">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[10px] bg-amber-500/15 px-2 py-0.5 rounded-full uppercase">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {txn.status === "pending_verification" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => verifyTransaction(txn.id, "verified")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => verifyTransaction(txn.id, "rejected")}
                          className="px-2 py-1 rounded-lg border border-border/80 text-rose-600 hover:bg-rose-500/10 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        Settled ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
