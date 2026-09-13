"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import type { ReturnTicketData } from "../ReturnRequestModal";

interface ReturnsTabProps {
  returnTickets: ReturnTicketData[];
  onSelectTab: (tab: "overview" | "profile" | "addresses" | "orders" | "tracking" | "returns" | "wishlist" | "reviews" | "payments" | "notifications") => void;
}

export function ReturnsTab({ returnTickets, onSelectTab }: ReturnsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Returns & Replacements
          </h3>
          <p className="text-xs text-muted-foreground">
            7-day hassle-free replacement warranty for defective electronics.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelectTab("orders")}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-2 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Create Return
        </button>
      </div>

      {returnTickets.length === 0 ? (
        <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-8 space-y-3 text-center shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.05] transition-all duration-300">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
            <RotateCcw className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-foreground">
            No Active Return Requests
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            To request an exchange or refund, go to "My Orders" tab and select "Request Return / Exchange" on any delivered order.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {returnTickets.map((ticket, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-5 space-y-3.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_12px_30px_-4px_rgba(245,158,11,0.08)] transition-all duration-300"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    Ticket #{ticket.orderNumber}-RET{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">
                    Under Review
                  </span>
                </div>
                <span className="text-xs font-bold capitalize text-amber-600 dark:text-amber-400">
                  {ticket.resolutionType} Request
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0">
                  <Image
                    src={ticket.productThumbnail}
                    alt={ticket.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-foreground truncate">
                    {ticket.productName}
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Reason: {ticket.reason}
                  </p>
                  {ticket.conditionNotes && (
                    <p className="text-muted-foreground italic mt-0.5">
                      "{ticket.conditionNotes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                <span>Courier Pickup: Steadfast Courier (Next 24 Hours)</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  QC Agent Assigned
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
