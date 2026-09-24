"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { CustomerAddress } from "@/services/api/customers/customerApi";
import {
  MapPin,
  Home,
  Briefcase,
  Building,
  CheckCircle2,
  Plus,
  Edit2,
  FileText,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { ManualOrderAddressModal } from "./ManualOrderAddressModal";
import type { ManualOrderAddressValues } from "./ManualOrderAddressModal";

// Minimal subset of form values this component needs
export interface AddressFormFields {
  street: string;
  city: string;
  zone: "inside-dhaka" | "outside-dhaka";
  deliveryNote?: string;
}

interface AdminDeliveryAddressSectionProps {
  /** Customer's saved addresses from the admin search result */
  savedAddresses?: CustomerAddress[];
  /** Currently selected address id */
  selectedAddressId?: string | null;
  /** Called when the admin picks a different saved address */
  onSelectAddress?: (addr: CustomerAddress) => void;
  /** Whether new-address modal is open */
  isAddingAddress?: boolean;
  /** Called to toggle new-address modal */
  onOpenAddAddress?: () => void;
  /** Applies a new address to this order only */
  onAddAddress?: (address: ManualOrderAddressValues) => void;
  /** React Hook Form values used to pre-fill the modal */
  addressDefaults: ManualOrderAddressValues;
  /** react-hook-form instance */
  form: UseFormReturn<any>;
  isLoadingAddresses?: boolean;
}

function getLabelIcon(type?: string) {
  switch (type?.toLowerCase()) {
    case "home":
      return <Home className="h-3.5 w-3.5 text-amber-500" />;
    case "office":
      return <Briefcase className="h-3.5 w-3.5 text-amber-500" />;
    default:
      return <Building className="h-3.5 w-3.5 text-amber-500" />;
  }
}

export function AdminDeliveryAddressSection({
  savedAddresses = [],
  selectedAddressId,
  onSelectAddress,
  isAddingAddress,
  onOpenAddAddress,
  onAddAddress,
  addressDefaults,
  form,
  isLoadingAddresses = false,
}: AdminDeliveryAddressSectionProps) {
  const { register, setValue, watch } = form;
  const zoneValue = watch("zone");

  const visibleAddresses = savedAddresses.slice(0, 2);
  const hasMoreAddresses = savedAddresses.length > 2;

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 sm:p-6 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <h3 className="text-xs font-black text-foreground uppercase tracking-widest">
            Delivery Address
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {hasMoreAddresses && (
            <span className="text-[11px] text-muted-foreground font-medium">
              {savedAddresses.length} addresses
            </span>
          )}
          {onOpenAddAddress && (
            <button
              type="button"
              onClick={onOpenAddAddress}
              className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-amber-500 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoadingAddresses && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-border/60 bg-muted/20 p-3.5 space-y-2"
            >
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted/60" />
            </div>
          ))}
        </div>
      )}

      {/* ── Selectable saved address cards ── */}
      {!isLoadingAddresses && savedAddresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleAddresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectAddress?.(addr)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectAddress?.(addr);
                  }
                }}
                className={cn(
                  "relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left select-none shadow-2xs",
                  isSelected
                    ? "border-amber-500 bg-amber-500/[0.04] ring-1 ring-amber-500/30"
                    : "border-border/70 bg-muted/15 hover:border-amber-500/40 hover:bg-muted/30"
                )}
              >
                {/* Top row: label badge + radio circle */}
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-foreground text-[10px] font-bold uppercase tracking-wider">
                        {getLabelIcon(addr.type)}
                        <span>{addr.type}</span>
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
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                      )}
                    </div>
                  </div>

                  {/* Address text */}
                  <div className="pt-2 space-y-1">
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {addr.street}, {addr.city}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                    </p>
                    {addr.country && (
                      <p className="text-[10px] text-muted-foreground/60">
                        {addr.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Inline add placeholder if only 1 address */}
          {visibleAddresses.length === 1 && onOpenAddAddress && (
            <button
              type="button"
              onClick={onOpenAddAddress}
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

      {/* ── Manual entry fields (always shown; pre-filled when address picked) ── */}
      <div
        className={cn(
          "space-y-4",
          savedAddresses.length > 0 &&
            "pt-4 border-t border-border/40"
        )}
      >
        {savedAddresses.length > 0 && (
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Edit2 className="h-3 w-3" />
            You can also edit the address details manually below.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Street */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="admin-street"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              Street / Area / House *
            </label>
            <input
              id="admin-street"
              {...register("street")}
              placeholder="House no, road, area"
              className="h-10 w-full rounded-xl bg-muted/40 border border-border/50 px-3.5 text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label
              htmlFor="admin-city"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider"
            >
              City *
            </label>
            <input
              id="admin-city"
              {...register("city")}
              placeholder="e.g. Dhaka"
              className="h-10 w-full rounded-xl bg-muted/40 border border-border/50 px-3.5 text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Zone toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Delivery Zone *
            </label>
            <div className="flex gap-2">
              {(["inside-dhaka", "outside-dhaka"] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  id={`zone-${z}`}
                  onClick={() => setValue("zone", z)}
                  className={cn(
                    "flex-1 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                    zoneValue === z
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60"
                  )}
                >
                  {z === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="admin-delivery-note"
              className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
            >
              <FileText className="h-3 w-3" />
              Delivery Note{" "}
              <span className="text-muted-foreground/60 font-normal normal-case">
                (optional)
              </span>
            </label>
            <textarea
              id="admin-delivery-note"
              {...register("deliveryNote")}
              rows={2}
              placeholder="Any special instructions for the courier…"
              className="w-full rounded-xl bg-muted/40 border border-border/50 px-3.5 py-2.5 text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
            />
          </div>
        </div>
      </div>
      <ManualOrderAddressModal
        isOpen={Boolean(isAddingAddress)}
        initialValues={addressDefaults}
        onClose={() => onOpenAddAddress?.()}
        onAdd={(address) => {
          onAddAddress?.(address);
          onOpenAddAddress?.();
        }}
      />
    </div>
  );
}
