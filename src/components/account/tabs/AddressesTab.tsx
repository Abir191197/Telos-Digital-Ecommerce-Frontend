"use client";

import React, { useState, useEffect } from "react";
import { Plus, MapPin, Loader2 } from "lucide-react";
import type { CustomerUser } from "@/stores";
import { useAuthStore } from "@/stores";
import type { Address } from "@/types/order.types";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/services/api/address/addressApi";
import { AddressCard } from "./AddressCard";
import { AddressFormModal } from "./AddressFormModal";
import { AddressConfirmDialogs } from "./AddressConfirmDialogs";

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

  const isDemo = !user || user.id.startsWith("demo");

  // RTK Query hooks for live backend sync
  const { data: backendAddresses, isLoading: isAddressesLoading, refetch } = useGetAddressesQuery(
    undefined,
    { skip: isDemo }
  );

  const [createAddressMutation, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddressMutation, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddressMutation, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddressMutation] = useSetDefaultAddressMutation();

  // Active addresses: live backend data prioritized, falling back to local user store
  const activeAddresses = backendAddresses ?? user.addresses;

  // Sync live backend addresses to auth store so checkout/header stay consistent
  useEffect(() => {
    if (backendAddresses && Array.isArray(backendAddresses)) {
      useAuthStore.setState((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            addresses: backendAddresses,
          },
        };
      });
    }
  }, [backendAddresses]);

  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    name: user.name,
    phone: user.phone || "+880 1712-345678",
    street: "",
    area: "",
    union: "",
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
      union: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: activeAddresses.length === 0,
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
      union: addr.union || "",
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

  const handleConfirmSaveAddress = async () => {
    if (!addressToConfirmSave) return;

    try {
      if (addressToConfirmSave.id) {
        if (!isDemo) {
          await updateAddressMutation({
            id: addressToConfirmSave.id,
            body: {
              name: addressToConfirmSave.data.name,
              phone: addressToConfirmSave.data.phone,
              title: addressToConfirmSave.data.label,
              street: addressToConfirmSave.data.street,
              city: addressToConfirmSave.data.city,
              area: addressToConfirmSave.data.area,
              union: addressToConfirmSave.data.union,
              zone: addressToConfirmSave.data.zone,
              postalCode: addressToConfirmSave.data.postalCode,
              isDefault: addressToConfirmSave.data.isDefault,
            },
          }).unwrap();
        }
        updateAddress(addressToConfirmSave.id, addressToConfirmSave.data);
      } else {
        if (!isDemo) {
          const created = await createAddressMutation({
            name: addressToConfirmSave.data.name,
            phone: addressToConfirmSave.data.phone,
            title: addressToConfirmSave.data.label,
            street: addressToConfirmSave.data.street,
            city: addressToConfirmSave.data.city,
            area: addressToConfirmSave.data.area,
            union: addressToConfirmSave.data.union,
            zone: addressToConfirmSave.data.zone,
            postalCode: addressToConfirmSave.data.postalCode,
            isDefault: addressToConfirmSave.data.isDefault,
          }).unwrap();
          addAddress(created);
        } else {
          addAddress(addressToConfirmSave.data);
        }
      }
    } catch (error) {
      console.error("Failed to sync address to backend:", error);
      // Local optimistic fallback
      if (addressToConfirmSave.id) {
        updateAddress(addressToConfirmSave.id, addressToConfirmSave.data);
      } else {
        addAddress(addressToConfirmSave.data);
      }
    }

    setAddressToConfirmSave(null);
    setShowAddAddressModal(false);
    setEditingAddressId(null);
  };

  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      if (!isDemo) {
        await deleteAddressMutation(addressToDelete.id).unwrap();
      }
    } catch (error) {
      console.error("Failed to delete address from backend:", error);
    }

    deleteAddress(addressToDelete.id);
    setAddressToDelete(null);
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      if (!isDemo) {
        await setDefaultAddressMutation(id).unwrap();
      }
    } catch (error) {
      console.error("Failed to update default address on backend:", error);
    }

    setDefaultAddress(id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header bar: Responsive stack on mobile, flex on sm */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 border border-border/40 dark:border-white/10 p-4 sm:p-5 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:bg-gradient-to-br hover:from-card hover:via-amber-500/[0.02] hover:to-amber-500/[0.05] transition-all duration-300">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Address Book
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage delivery destinations and primary shipping for Bangladesh.
          </p>
        </div>
        {/* Desktop Add Button */}
        <button
          type="button"
          onClick={handleOpenAddAddress}
          className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isAddressesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl p-6 space-y-4 border border-border/40 bg-card animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-16 bg-muted rounded-md" />
                <div className="h-5 w-24 bg-muted rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
                <div className="h-3 w-28 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : activeAddresses.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <MapPin className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              No Delivery Addresses Saved
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Add your shipping location to enjoy faster checkout and real-time delivery updates.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddAddress}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAddresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onSetDefault={handleSetDefaultAddress}
              onEdit={handleOpenEditAddress}
              onDelete={setAddressToDelete}
            />
          ))}
        </div>
      )}

      {/* Mobile Add Button: Placed as last item after address cards */}
      {activeAddresses.length > 0 && (
        <div className="block sm:hidden pt-2">
          <button
            type="button"
            onClick={handleOpenAddAddress}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 py-3.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer touch-manipulation"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add New Address</span>
          </button>
        </div>
      )}

      {/* Add / Edit Address Drawer or Modal */}
      <AddressFormModal
        isOpen={showAddAddressModal}
        onClose={() => {
          setShowAddAddressModal(false);
          setEditingAddressId(null);
        }}
        isEditing={Boolean(editingAddressId)}
        formData={newAddr}
        setFormData={setNewAddr}
        onSubmit={handleAddressFormSubmit}
      />

      {/* Save / Delete Confirmation Modals */}
      <AddressConfirmDialogs
        addressToConfirmSave={addressToConfirmSave}
        onCancelSave={() => setAddressToConfirmSave(null)}
        onConfirmSave={handleConfirmSaveAddress}
        addressToDelete={addressToDelete}
        onCancelDelete={() => setAddressToDelete(null)}
        onConfirmDelete={handleConfirmDeleteAddress}
      />
    </div>
  );
}
