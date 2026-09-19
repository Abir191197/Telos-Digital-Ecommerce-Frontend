"use client";

import React from "react";
import { Button } from "@/components/common";
import { cn } from "@/lib/utils";
import { Address } from "@/types/order.types";
import { CheckoutFormValues } from "@/validations/checkout.schema";
import {
  ArrowRightLeft,
  BookmarkCheck,
  Briefcase,
  Building,
  CheckCircle2,
  FileText,
  Home,
  MapPin,
  Plus,
  Truck,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface AddressStepProps {
  form: UseFormReturn<CheckoutFormValues>;
  savedAddresses?: Address[];
  selectedAddress?: Address | null;
  selectedAddressId?: string | null;
  isLoadingAddresses?: boolean;
  onSelectSavedAddress?: (addr: Address) => void;
  onOpenChangeModal?: () => void;
  onOpenAddModal?: () => void;
  onContinue?: () => void;
}

export function AddressStep({
  form,
  savedAddresses = [],
  selectedAddress,
  selectedAddressId,
  isLoadingAddresses = false,
  onSelectSavedAddress,
  onOpenChangeModal,
  onOpenAddModal,
  onContinue,
}: AddressStepProps) {
  const { register, watch } = form;
  const currentZone = watch("zone");

  const getLabelIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "home":
        return <Home className="h-3.5 w-3.5 text-amber-500" />;
      case "office":
        return <Briefcase className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Building className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Loading Skeleton State ── */}
      {isLoadingAddresses && (
        <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 w-40 bg-muted rounded-md" />
            <div className="h-8 w-24 bg-muted rounded-xl" />
          </div>
          <div className="h-4 w-52 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
      )}

      {/* ── Active Delivery Address Card ── */}
      {!isLoadingAddresses && selectedAddress && (
        <div className="rounded-3xl border border-amber-500/35 bg-gradient-to-br from-amber-500/[0.04] via-card to-card p-5 sm:p-7 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] space-y-5">
          {/* Header with Address Badges & Change / Add Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black text-xs">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                <span>1. Delivery Destination</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground text-[11px] font-bold uppercase tracking-wider">
                {getLabelIcon(selectedAddress.label)}
                <span>{selectedAddress.label}</span>
              </span>

              {selectedAddress.isDefault && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Default Address</span>
                </span>
              )}
            </div>

            {/* Action Buttons: Change & Add New */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenChangeModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Change Address</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/80 hover:bg-muted text-foreground font-bold text-xs transition-all cursor-pointer border border-border/70 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>

          {/* Active Address Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {selectedAddress.name}
              </h3>

              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                  currentZone === "inside-dhaka"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                    : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30"
                )}
              >
                <Truck className="h-3.5 w-3.5" />
                <span>
                  {currentZone === "inside-dhaka"
                    ? "Dhaka Metro (৳70 Shipping)"
                    : "Nationwide BD (৳130 Shipping)"}
                </span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {selectedAddress.street}
              {selectedAddress.area ? `, ${selectedAddress.area}` : ""}
              {selectedAddress.city ? `, ${selectedAddress.city}` : ""}
              {selectedAddress.postalCode
                ? ` - ${selectedAddress.postalCode}`
                : ""}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-semibold">
                Contact:
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                {selectedAddress.phone || "No contact number"}
              </span>
            </div>
          </div>

          {/* Quick Alternate Address Strip (if 2+ addresses available) */}
          {savedAddresses.length > 1 && (
            <div className="pt-3 border-t border-border/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookmarkCheck className="h-3.5 w-3.5 text-amber-500" />
                  <span>Other Saved Addresses:</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenChangeModal}
                  className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  View All ({savedAddresses.length})
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {savedAddresses
                  .filter((a) => a.id !== selectedAddress.id)
                  .map((otherAddr) => (
                    <button
                      key={otherAddr.id}
                      type="button"
                      onClick={() => onSelectSavedAddress?.(otherAddr)}
                      className="group flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-border/70 hover:border-amber-500/60 bg-muted/30 hover:bg-amber-500/5 text-xs transition-all cursor-pointer text-left"
                    >
                      <div className="h-2 w-2 rounded-full bg-muted-foreground group-hover:bg-amber-500 transition-colors" />
                      <div className="truncate max-w-[180px]">
                        <span className="font-bold text-foreground block truncate">
                          {otherAddr.name} ({otherAddr.label})
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate block">
                          {otherAddr.city}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Special Delivery Instructions / Note (Optional) */}
          <div className="pt-3 border-t border-border/40 space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Special Delivery Instructions / Note (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Call 30 mins before arrival, deliver to security or reception"
              {...register("deliveryNote")}
              className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* ── Empty State: No Address Saved Yet ── */}
      {!isLoadingAddresses && (!selectedAddress || savedAddresses.length === 0) && (
        <div className="rounded-3xl border border-dashed border-amber-500/40 bg-card p-6 sm:p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-foreground">
              No Delivery Address Selected
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Please add your delivery address for Bangladesh nationwide courier delivery.
            </p>
          </div>
          <Button
            type="button"
            variant="amber"
            onClick={onOpenAddModal}
            className="px-6 py-3 font-bold rounded-xl shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Add Delivery Address</span>
          </Button>
        </div>
      )}
    </div>
  );
}
