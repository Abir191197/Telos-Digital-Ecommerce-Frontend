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
          className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer"
        >
          Create Return
        </button>
      </div>

      {returnTickets.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 text-center">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
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
              className="rounded-2xl border border-border/80 bg-card p-4.5 space-y-3 shadow-xs"
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
