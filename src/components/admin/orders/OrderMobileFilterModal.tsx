import React from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface OrderMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  orders: Order[];
  onResetPage: () => void;
}

export function OrderMobileFilterModal({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  orders,
  onResetPage,
}: OrderMobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
      <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground tracking-tight">Filter Orders</h3>
              <p className="text-[11px] text-muted-foreground">Select order status pipeline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Segmented Cards */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-foreground block mb-2">Order Status Pipeline</span>
          {[
            { id: "all", label: "All Orders", desc: "Show complete order registry", count: orders.length },
            { id: "pending", label: "Pending Verification", desc: "Awaiting customer or payment verification", count: orders.filter((o) => o.status === "pending").length },
            { id: "processing", label: "Processing / QC", desc: "Quality check and courier packaging", count: orders.filter((o) => o.status === "processing").length },
            { id: "shipped", label: "In Transit / Shipped", desc: "Handed over to courier with tracking", count: orders.filter((o) => o.status === "shipped").length },
            { id: "delivered", label: "Delivered Successfully", desc: "Completed deliveries with payment verified", count: orders.filter((o) => o.status === "delivered").length },
            { id: "cancelled", label: "Cancelled / Refunded", desc: "Cancelled orders and return processing", count: orders.filter((o) => o.status === "cancelled").length },
          ].map((s) => {
            const isSelected = statusFilter === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStatusFilter(s.id);
                  onResetPage();
                  onClose();
                }}
                className={cn(
                  "w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                )}
              >
                <div>
                  <p className={cn("font-bold text-xs text-foreground", isSelected && "text-amber-500 font-black")}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md",
                  isSelected ? "bg-amber-500 text-zinc-950" : "bg-muted text-muted-foreground"
                )}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Reset & Dismiss */}
        <div className="pt-2 flex items-center gap-2.5 border-t border-border/40">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              onResetPage();
              onClose();
            }}
            className="py-3 px-4 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-98"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
