"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { CustomerUser } from "@/stores";
import type { Address } from "@/types/order.types";
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
        {/* Desktop Add Button */}
        <button
          type="button"
          onClick={handleOpenAddAddress}
          className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onSetDefault={setDefaultAddress}
            onEdit={handleOpenEditAddress}
            onDelete={setAddressToDelete}
          />
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
