"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./ProductDetailsFormCard";

interface ProductVoucherSectionProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
}

export function ProductVoucherSection({ values, onChange }: ProductVoucherSectionProps) {
  return (
    <div className="pt-2">
      <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Ticket className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                Special Voucher / Promo Discount
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Attach an optional coupon code for extra discount on this item
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={values.hasVoucher}
              onChange={(e) => onChange("hasVoucher", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            <span className="ml-2 text-[11px] font-bold text-foreground">
              {values.hasVoucher ? "ON" : "OFF"}
            </span>
          </label>
        </div>

        {values.hasVoucher && (
          <div className="space-y-3 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1.5">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    onChange("voucherType", "percentage");
                    if (!values.voucherValue || Number(values.voucherValue) > 100) {
                      onChange("voucherValue", 10);
                    }
                  }}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    values.voucherType === "percentage"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  % Percentage Off
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange("voucherType", "flat");
                    if (!values.voucherValue || Number(values.voucherValue) <= 100) {
                      onChange("voucherValue", 500);
                    }
                  }}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    values.voucherType === "flat"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  ৳ Flat Money Off
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  {values.voucherType === "percentage"
                    ? "Discount Percentage (%)"
                    : "Discount Amount (৳)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={values.voucherType === "percentage" ? 99 : 500000}
                    placeholder={values.voucherType === "percentage" ? "10" : "500"}
                    value={values.voucherValue}
                    onChange={(e) =>
                      onChange(
                        "voucherValue",
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    {values.voucherType === "percentage" ? "%" : "৳"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. TELOS10"
                  value={values.voucherCode}
                  onChange={(e) =>
                    onChange("voucherCode", e.target.value.toUpperCase())
                  }
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border/60 hover:bg-background cursor-pointer transition-colors">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Show Voucher Badge on Storefront Card
                </span>
                <span className="text-[10px] text-muted-foreground">
                  When enabled, customers see coupon ribbon directly on the product card
                </span>
              </div>
              <input
                type="checkbox"
                checked={values.showVoucherOnCard}
                onChange={(e) => onChange("showVoucherOnCard", e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer ml-3 shrink-0"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
