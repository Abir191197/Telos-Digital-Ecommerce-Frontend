"use client";

import React from "react";
import { Truck, RotateCcw, Award } from "lucide-react";

export function ProductDeliveryTrustStrip() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-border/40 text-center">
      <div className="p-2 rounded-xl bg-card border border-border/50">
        <Truck className="h-3.5 w-3.5 text-amber-500 mx-auto mb-1" />
        <p className="font-bold text-[11px] text-foreground leading-none">Fast 24-48h</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">Nationwide</p>
      </div>

      <div className="p-2 rounded-xl bg-card border border-border/50">
        <RotateCcw className="h-3.5 w-3.5 text-blue-500 mx-auto mb-1" />
        <p className="font-bold text-[11px] text-foreground leading-none">7 Days Return</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">Easy swap</p>
      </div>

      <div className="p-2 rounded-xl bg-card border border-border/50">
        <Award className="h-3.5 w-3.5 text-purple-500 mx-auto mb-1" />
        <p className="font-bold text-[11px] text-foreground leading-none">Official</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">Warranty</p>
      </div>
    </div>
  );
}
