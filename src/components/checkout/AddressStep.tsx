"use client";

import React from "react";
import { Button } from "@/components/common";
import { cn } from "@/lib/utils";
import { Address } from "@/types/order.types";
import { CheckoutFormValues } from "@/validations/checkout.schema";
import {
  Briefcase,
  Building,
  CheckCircle2,
  FileText,
  Home,
  MapPin,
  Plus,
  AlertTriangle,
  Phone,
  Edit2,
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
  onOpenEditModal?: (addr: Address) => void;
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
  onOpenEditModal,
}: AddressStepProps) {
  const { register } = form;

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

  const visibleAddresses = savedAddresses.slice(0, 2);
  const hasMoreAddresses = savedAddresses.length > 2;

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs dark:shadow-none space-y-4">
      {/* ── 1. Card Header: Title + Action Links ── */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <MapPin className="h-4 w-4" />
          </span>
          <h2 className="text-base font-black tracking-tight text-foreground">
            Delivery Address
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {hasMoreAddresses && onOpenChangeModal && (
            <button
              type="button"
              onClick={onOpenChangeModal}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              View all ({savedAddresses.length})
            </button>
          )}

          {savedAddresses.length > 0 && onOpenAddModal && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-amber-500 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Loading Skeleton State ── */}
      {isLoadingAddresses && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          <div className="h-28 rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted/60" />
          </div>
          <div className="h-28 rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted/60" />
          </div>
        </div>
      )}

      {/* ── 3. Horizontal Selectable Address Cards ── */}
      {!isLoadingAddresses && savedAddresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleAddresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;

            return (
              <div
                key={addr.id}
                onClick={() => onSelectSavedAddress?.(addr)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSavedAddress?.(addr);
                  }
                }}
                className={cn(
                  "relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left select-none shadow-2xs",
                  isSelected
                    ? "border-amber-500 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
                    : "border-border/70 bg-muted/15 hover:border-amber-500/40 hover:bg-muted/30"
                )}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-muted text-foreground text-[10px] font-bold uppercase tracking-wider">
                        {getLabelIcon(addr.label)}
                        <span>{addr.label}</span>
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          (Default)
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                        isSelected
                          ? "border-amber-500 bg-amber-500 text-zinc-950"
                          : "border-border/80 bg-background"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <p className="font-bold text-xs text-foreground">
                      {addr.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {addr.street}, {addr.area || addr.city}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/30 mt-2.5 flex items-center justify-between gap-1 text-[10px]">
                  {addr.phone && addr.phone.trim() ? (
                    <span className="font-mono text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground/60" />
                      <span>{addr.phone}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Phone required</span>
                    </span>
                  )}

                  {onOpenEditModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(addr);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline p-0.5 cursor-pointer ml-auto"
                      title="Edit this address"
                    >
                      <Edit2 className="h-2.5 w-2.5" />
                      <span>{addr.phone && addr.phone.trim() ? "Edit" : "Add Phone"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Inline Add Button if only 1 address exists */}
          {visibleAddresses.length === 1 && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-border/80 bg-muted/10 hover:bg-amber-500/[0.04] hover:border-amber-500/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer min-h-[110px] space-y-1.5 group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </div>
              <span className="text-[11px] font-bold">Add Another Address</span>
            </button>
          )}
        </div>
      )}

      {/* ── 4. Empty State: No Address Saved Yet ── */}
      {!isLoadingAddresses && savedAddresses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-amber-500/40 bg-muted/10 p-6 text-center space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-foreground">
              No Delivery Address Added
            </h3>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Add your delivery address for Bangladesh nationwide courier delivery.
            </p>
          </div>
          <Button
            type="button"
            variant="amber"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Add Delivery Address</span>
          </Button>
        </div>
      )}

      {/* ── 5. Special Delivery Instructions (Embedded Inside Card) ── */}
      {!isLoadingAddresses && savedAddresses.length > 0 && (
        <div className="pt-2 border-t border-border/50 space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            <span>Special Delivery Instructions (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Call before arrival, leave with security or reception"
            {...register("deliveryNote")}
            className="w-full h-9 px-3 rounded-xl border border-border/70 bg-background text-xs text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500"
          />
        </div>
      )}
    </div>
  );
}
