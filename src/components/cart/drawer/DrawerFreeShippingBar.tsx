import React from "react";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerFreeShippingBarProps {
  freeShippingRemaining: number;
}

export function DrawerFreeShippingBar({
  freeShippingRemaining,
}: DrawerFreeShippingBarProps) {
  const freeShippingProgress = Math.min(
    100,
    Math.round(((5000 - freeShippingRemaining) / 5000) * 100)
  );

  return (
    <div className="border-b border-border/60 bg-muted/20 px-5 py-3.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Truck className="h-3.5 w-3.5" />
          </div>
          {freeShippingRemaining === 0 ? (
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="text-xs">Free Delivery Qualified</span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.2 text-[10px] text-amber-600 dark:text-amber-400">
                ৳0 Delivery
              </span>
            </div>
          ) : (
            <span>
              Add{" "}
              <strong className="text-amber-500 font-bold">
                ৳{freeShippingRemaining.toLocaleString()}
              </strong>{" "}
              for Free Delivery
            </span>
          )}
        </div>
        <span className="text-[11px] font-black tabular-nums text-foreground">
          {freeShippingProgress}%
        </span>
      </div>

      <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted/70 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 shadow-xs",
            freeShippingRemaining === 0
              ? "bg-linear-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              : "bg-linear-to-r from-amber-500 to-amber-400"
          )}
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>
    </div>
  );
}
