"use client";

import React, { useState } from "react";
import {
  Building,
  Check,
  Edit3,
  Trash2,
  Plus,
  MapPin,
  X,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerUser } from "@/stores";
import type { Address } from "@/types/order.types";

interface AddressesTabProps {
  user: CustomerUser;
  addAddress: (addr: Omit<Address, "id">) => void;
  updateAddress: (id: string, addr: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export function AddressesTab({
  user,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
}: AddressesTabProps) {
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressToConfirmSave, setAddressToConfirmSave] = useState<{
    id?: string;
    data: Omit<Address, "id">;
  } | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    name: user.name,
    phone: user.phone || "+880 1712-345678",
    street: "",
    area: "",
    city: "Dhaka",
    zone: "inside-dhaka",
    postalCode: "",
    isDefault: false,
    label: "Home",
  });

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setNewAddr({
      name: user.name,
      phone: user.phone || "+880 1712-345678",
      street: "",
      area: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: user.addresses.length === 0,
      label: "Home",
    });
    setShowAddAddressModal(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setNewAddr({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      zone: addr.zone,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
      label: addr.label,
    });
    setShowAddAddressModal(true);
  };

  const handleAddressFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.area || !newAddr.name) return;
    setAddressToConfirmSave({
      id: editingAddressId || undefined,
      data: { ...newAddr },
    });
  };

  const handleConfirmSaveAddress = () => {
    if (!addressToConfirmSave) return;
    if (addressToConfirmSave.id) {
      updateAddress(addressToConfirmSave.id, addressToConfirmSave.data);
    } else {
      addAddress(addressToConfirmSave.data);
    }
    setAddressToConfirmSave(null);
    setShowAddAddressModal(false);
    setEditingAddressId(null);
    setNewAddr({
      name: user.name,
      phone: user.phone || "+880 1712-345678",
      street: "",
      area: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: false,
      label: "Home",
    });
  };

  const handleConfirmDeleteAddress = () => {
    if (!addressToDelete) return;
    deleteAddress(addressToDelete.id);
    setAddressToDelete(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header bar: Responsive stack on mobile, flex on sm */}
      <div className="flex items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Address Book
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage delivery destinations and primary shipping for Bangladesh.
          </p>
        </div>
        {/* Desktop Add Button: stays in header */}
        <button
          type="button"
          onClick={handleOpenAddAddress}
          className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid: borderless on cards, rich background & shadow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              "rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 relative transition-all shadow-sm hover:shadow-md",
              addr.isDefault
                ? "bg-amber-500/10 dark:bg-amber-500/15"
                : "bg-card/90 dark:bg-muted/30"
            )}
          >
            {/* Top Row: Label badge + Default Status / Set Default */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 dark:bg-muted/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground shadow-2xs">
                <Building className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>{addr.label}</span>
              </span>

              {addr.isDefault ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-1 rounded-full">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  <span>Default Shipping</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer py-1 px-1.5 rounded-md hover:bg-amber-500/10 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>

            {/* Address details */}
            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                {addr.name}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
              </p>
              <p className="text-xs font-semibold font-mono text-foreground pt-0.5">
                Phone: {addr.phone}
              </p>
              <div className="pt-1">
                <span className="inline-block text-[10px] font-bold text-muted-foreground bg-muted/60 dark:bg-muted px-2 py-0.5 rounded-md">
                  {addr.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                </span>
              </div>
            </div>

            {/* Action buttons: Edit and Delete with touch-friendly layout */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEditAddress(addr)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-amber-500/15 text-foreground hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
                aria-label={`Edit address for ${addr.name}`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setAddressToDelete(addr)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
                aria-label={`Delete address for ${addr.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Add Button: Placed as last item after address cards */}
      <div className="block sm:hidden pt-2">
        <button
          type="button"
          onClick={handleOpenAddAddress}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white py-3.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer touch-manipulation"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add / Edit Address Drawer or Modal */}
      {showAddAddressModal && (
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
                    {editingAddressId ? "Edit Delivery Location" : "Add New Delivery Location"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Destination details for courier deliveries
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddressModal(false);
                  setEditingAddressId(null);
                }}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form
              onSubmit={handleAddressFormSubmit}
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
                      onClick={() => setNewAddr({ ...newAddr, label: labelType })}
                      className={cn(
                        "py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation",
                        newAddr.label === labelType
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
                    value={newAddr.name}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, name: e.target.value })
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
                    value={newAddr.phone}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, phone: e.target.value })
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
                  value={newAddr.street}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, street: e.target.value })
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
                    value={newAddr.area}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, area: e.target.value })
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
                    value={newAddr.city}
                    onChange={(e) => {
                      const cityVal = e.target.value;
                      const isInside = cityVal.toLowerCase().includes("dhaka");
                      setNewAddr({
                        ...newAddr,
                        city: cityVal,
                        zone: isInside ? "inside-dhaka" : "outside-dhaka",
                      });
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
                    value={newAddr.postalCode}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, postalCode: e.target.value })
                    }
                    className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Courier Zone
                  </label>
                  <select
                    value={newAddr.zone}
                    onChange={(e) =>
                      setNewAddr({
                        ...newAddr,
                        zone: e.target.value as "inside-dhaka" | "outside-dhaka",
                      })
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
                  checked={newAddr.isDefault}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, isDefault: e.target.checked })
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

              {/* Action buttons pinned at bottom of scrollable form with safe-area spacing */}
              <div className="flex items-center gap-2.5 pt-3 pb-6 sm:pb-1 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAddressModal(false);
                    setEditingAddressId(null);
                  }}
                  className="flex-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground py-3 font-bold transition-all cursor-pointer active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 font-bold shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {editingAddressId ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Save Warning / Confirmation Popup Modal ── */}
      {addressToConfirmSave && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {addressToConfirmSave.id ? "Confirm Address Update" : "Confirm New Address"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verify destination before saving
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddressToConfirmSave(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Recipient:</span>
                <strong className="font-bold text-foreground">{addressToConfirmSave.data.name}</strong>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Contact Phone:</span>
                <strong className="font-mono font-bold text-foreground">{addressToConfirmSave.data.phone}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground block">Shipping Destination:</span>
                <p className="text-foreground font-semibold">
                  {addressToConfirmSave.data.street}, {addressToConfirmSave.data.area},{" "}
                  {addressToConfirmSave.data.city} - {addressToConfirmSave.data.postalCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {addressToConfirmSave.id
                ? "Are you sure you want to update this address? Pending dispatches will use these modified details."
                : "Are you sure you want to save this new delivery address to your address book?"}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddressToConfirmSave(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveAddress}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Confirm & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Warning / Confirmation Popup Modal ── */}
      {addressToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Delete Address?
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-rose-500/5 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{addressToDelete.name}</span>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded-md">
                  {addressToDelete.label}
                </span>
              </div>
              <p className="text-muted-foreground">
                {addressToDelete.street}, {addressToDelete.area}, {addressToDelete.city}
              </p>
              <p className="font-mono text-muted-foreground">
                {addressToDelete.phone}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently remove this delivery address from your profile?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAddress}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Address</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
