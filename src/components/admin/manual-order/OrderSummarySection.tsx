"use client";

import React from "react";
import { Receipt, Truck, Tag, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderLineItem } from "./ProductPickerSection";

interface OrderSummarySectionProps {
  items: OrderLineItem[];
  deliveryFee: number;
  discount: number;
  onDeliveryFeeChange: (val: number) => void;
  onDiscountChange: (val: number) => void;
}

function NumberField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  iconColor,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  iconColor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Icon className={cn("h-3 w-3", iconColor || "text-muted-foreground")} />
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">৳</span>
        <input
          id={id}
          type="number"
          min={0}
          step={1}
          value={value || ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder={placeholder || "0"}
          className={cn(
            "h-10 w-full rounded-xl bg-muted/40 border border-border/50 pl-7 pr-3 text-sm font-mono font-bold text-foreground",
            "focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all",
            "placeholder:text-muted-foreground/40 placeholder:font-normal"
          )}
        />
      </div>
    </div>
  );
}

export function OrderSummarySection({
  items,
  deliveryFee,
  discount,
  onDeliveryFeeChange,
  onDiscountChange,
}: OrderSummarySectionProps) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10">
          <Calculator className="h-3.5 w-3.5 text-amber-500" />
        </div>
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Order Summary</h3>
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="delivery-fee-input"
          label="Delivery Fee"
          icon={Truck}
          iconColor="text-blue-500"
          value={deliveryFee}
          onChange={onDeliveryFeeChange}
          placeholder="e.g. 80"
        />
        <NumberField
          id="discount-input"
          label="Discount"
          icon={Tag}
          iconColor="text-emerald-500"
          value={discount}
          onChange={onDiscountChange}
          placeholder="0"
        />
      </div>

      {/* Totals breakdown */}
      <div className="rounded-2xl bg-muted/20 border border-border/40 overflow-hidden">
        <div className="divide-y divide-border/30">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-muted-foreground font-medium">Subtotal</span>
            <span className="font-mono text-xs font-bold text-foreground">৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Truck className="h-3 w-3 text-blue-500" />
              Delivery Fee
            </span>
            <span className="font-mono text-xs font-bold text-foreground">+ ৳{deliveryFee.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <Tag className="h-3 w-3" />
                Discount
              </span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">− ৳{discount.toLocaleString()}</span>
            </div>
          )}
        </div>
        {/* Grand Total */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-500/8 border-t border-amber-500/20">
          <span className="flex items-center gap-1.5 text-xs font-black text-foreground uppercase tracking-wider">
            <Receipt className="h-3.5 w-3.5 text-amber-500" />
            Grand Total
          </span>
          <span className="font-mono text-lg font-black text-foreground">৳{grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
