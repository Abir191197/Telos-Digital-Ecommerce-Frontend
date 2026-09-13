"use client";

import React from "react";
import { Building, Check, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/order.types";

interface AddressCardProps {
  address: Address;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

export function AddressCard({
  address,
  onSetDefault,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5 sm:p-6 space-y-4 relative transition-all duration-300 border shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)]",
        address.isDefault
          ? "bg-gradient-to-br from-amber-500/[0.08] via-card to-card dark:from-amber-500/[0.12] dark:via-zinc-900/90 dark:to-zinc-900/70 border-amber-500/40 shadow-[0_10px_35px_-6px_rgba(245,158,11,0.12)] ring-1 ring-amber-500/20 hover:bg-gradient-to-br hover:from-amber-500/[0.12] hover:via-card hover:to-amber-500/[0.04]"
          : "bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 border-border/40 dark:border-white/10 hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.06] hover:shadow-[0_14px_35px_-6px_rgba(245,158,11,0.1)]"
      )}
    >
      {/* Top Row: Label badge + Default Status / Set Default */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 dark:bg-muted/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground shadow-2xs">
          <Building className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>{address.label}</span>
        </span>

        {address.isDefault ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-1 rounded-full">
            <Check className="h-3 w-3 stroke-[2.5]" />
            <span>Default Shipping</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer py-1 px-1.5 rounded-md hover:bg-amber-500/10 transition-colors"
          >
            Set as Default
          </button>
        )}
      </div>

      {/* Address details */}
      <div className="space-y-1.5">
        <h4 className="text-sm sm:text-base font-bold text-foreground">
          {address.name}
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {address.street}, {address.area}, {address.city} - {address.postalCode}
        </p>
        <p className="text-xs font-semibold font-mono text-foreground pt-0.5">
          Phone: {address.phone}
        </p>
        <div className="pt-1">
          <span className="inline-block text-[10px] font-bold text-muted-foreground bg-muted/60 dark:bg-muted px-2 py-0.5 rounded-md">
            {address.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
          </span>
        </div>
      </div>

      {/* Action buttons: Edit and Delete with touch-friendly layout */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-amber-500/15 text-foreground hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
          aria-label={`Edit address for ${address.name}`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(address)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
          aria-label={`Delete address for ${address.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
