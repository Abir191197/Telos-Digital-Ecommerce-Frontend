"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  X,
  Plus,
  CheckCircle2,
  Building,
  Home,
  Briefcase,
  Truck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/order.types";
import { Button } from "@/components/common";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: () => void;
}

export function AddressSelectionModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectionModalProps) {
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(
    selectedAddressId
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(selectedAddressId);
    }
  }, [isOpen, selectedAddressId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selected = addresses.find((a) => a.id === tempSelectedId);
    if (selected) {
      onSelectAddress(selected);
    }
    onClose();
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="h-3.5 w-3.5 text-amber-500" />;
      case "office":
        return <Briefcase className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Building className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl flex flex-col max-h-[88dvh] sm:max-h-[85vh] overflow-hidden border-t sm:border border-border/80 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 shrink-0 bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-foreground truncate tracking-tight">
                Select Delivery Address
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                Choose an address from your saved address book
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Address Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 overscroll-contain">
          {addresses.length === 0 ? (
            <div className="text-center py-10 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  No saved addresses found
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Add a delivery address to ensure swift shipping across Bangladesh.
                </p>
              </div>
              <Button
                type="button"
                variant="amber"
                size="sm"
                onClick={() => {
                  onClose();
                  onAddNewAddress();
                }}
                className="font-bold rounded-xl"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Add First Address</span>
              </Button>
            </div>
          ) : (
            addresses.map((addr) => {
              const isSelected = tempSelectedId === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => setTempSelectedId(addr.id)}
                  className={cn(
                    "group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer text-left select-none",
                    isSelected
                      ? "border-amber-500 bg-amber-500/[0.07] ring-2 ring-amber-500/25 shadow-sm"
                      : "border-border/70 bg-card hover:border-amber-500/40 hover:bg-muted/30"
                  )}
                >
                  {/* Selection Radio Circle */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                        isSelected
                          ? "border-amber-500 bg-amber-500 text-zinc-950 shadow-xs"
                          : "border-border bg-background group-hover:border-amber-500/60"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-foreground">
                          {addr.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wider">
                          {getLabelIcon(addr.label)}
                          <span>{addr.label}</span>
                        </span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            <span>Default</span>
                          </span>
                        )}
                      </div>

                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md",
                          addr.zone === "inside-dhaka"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            : "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                        )}
                      >
                        <Truck className="h-3 w-3" />
                        <span>
                          {addr.zone === "inside-dhaka" ? "Dhaka (৳70)" : "Outside (৳130)"}
                        </span>
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {addr.street}
                      {addr.area ? `, ${addr.area}` : ""}
                      {addr.city ? `, ${addr.city}` : ""}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                    </p>

                    <p className="text-xs font-mono font-semibold text-foreground">
                      {addr.phone}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/60 p-4 sm:p-5 bg-card/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewAddress();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="amber"
              size="sm"
              onClick={handleConfirm}
              disabled={!tempSelectedId || addresses.length === 0}
              className="flex-1 sm:flex-initial rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
            >
              <span>Deliver to this Address</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
