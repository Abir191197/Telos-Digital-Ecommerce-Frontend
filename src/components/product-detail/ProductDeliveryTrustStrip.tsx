"use client";

import React from "react";
import { Truck, RotateCcw, Award } from "lucide-react";

export function ProductDeliveryTrustStrip() {
  return (
    <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-border/40">
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
        <Truck className="h-4 w-4 text-amber-500 shrink-0" />
        <div>
          <p className="font-bold text-xs text-foreground">Express 24-48h</p>
          <p className="text-[10px] text-muted-foreground">Dhaka & Nationwide</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
        <RotateCcw className="h-4 w-4 text-blue-500 shrink-0" />
        <div>
          <p className="font-bold text-xs text-foreground">7 Days Return</p>
          <p className="text-[10px] text-muted-foreground">Doorstep replacement</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
        <Award className="h-4 w-4 text-purple-500 shrink-0" />
        <div>
          <p className="font-bold text-xs text-foreground">Official Warranty</p>
          <p className="text-[10px] text-muted-foreground">Authorized service</p>
        </div>
      </div>
    </div>
  );
}
