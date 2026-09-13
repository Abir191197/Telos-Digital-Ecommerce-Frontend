"use client";

import React from "react";
import { Building, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/order.types";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: Omit<Address, "id">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Address, "id">>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddressFormModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
}: AddressFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] overflow-hidden border-t sm:border border-border/70 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 shrink-0 bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                {isEditing ? "Edit Delivery Location" : "Add New Delivery Location"}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate">
                Destination details for courier deliveries
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

        {/* Scrollable Form */}
        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs overscroll-contain"
        >
          <div>
            <label className="font-bold text-foreground block mb-1">
              Address Type / Label
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Home", "Office", "Other"] as const).map((labelType) => (
                <button
                  key={labelType}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, label: labelType }))}
                  className={cn(
                    "py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation",
                    formData.label === labelType
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>{labelType}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="+880 1712-345678"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">
              Street & Building Address
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House 14, Road 3, Block D"
              value={formData.street}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, street: e.target.value }))
              }
              className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Area / Thana
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhanmondi"
                value={formData.area}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, area: e.target.value }))
                }
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">
                City / District
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhaka"
                value={formData.city}
                onChange={(e) => {
                  const cityVal = e.target.value;
                  const isInside = cityVal.toLowerCase().includes("dhaka");
                  setFormData((prev) => ({
                    ...prev,
                    city: cityVal,
                    zone: isInside ? "inside-dhaka" : "outside-dhaka",
                  }));
                }}
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="e.g. 1209"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, postalCode: e.target.value }))
                }
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">
                Courier Zone
              </label>
              <select
                value={formData.zone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    zone: e.target.value as "inside-dhaka" | "outside-dhaka",
                  }))
                }
                className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
              >
                <option value="inside-dhaka">Inside Dhaka (৳60)</option>
                <option value="outside-dhaka">Outside Dhaka (৳120)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefaultAddr"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
              }
              className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
            />
            <label
              htmlFor="isDefaultAddr"
              className="text-xs font-semibold text-foreground cursor-pointer select-none"
            >
              Set as primary default delivery destination
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-3 pb-6 sm:pb-1 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground py-3 font-bold transition-all cursor-pointer active:scale-98"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 py-3 font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
