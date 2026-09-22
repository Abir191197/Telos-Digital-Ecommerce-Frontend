"use client";

import React from "react";
import { AddressStep } from "./AddressStep";
import { AddressSelectionModal } from "./AddressSelectionModal";
import { AddressFormModal } from "@/components/account/tabs/AddressFormModal";
import { PaymentStep } from "./PaymentStep";
import { OrderSummarySticky } from "./OrderSummarySticky";
import { StockAlertModal } from "./StockAlertModal";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { CheckoutEmptyState } from "./CheckoutEmptyState";
import { CheckoutLoadingOverlay } from "./CheckoutLoadingOverlay";
import { CheckCircle2 } from "lucide-react";
import { useCheckoutFlow } from "./useCheckoutFlow";

export function CheckoutView() {
  const {
    mounted,
    user,
    isCartLoading,
    items,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    shippingFee,
    totalPayable,
    currentZone,
    form,
    handleSubmit,
    onSubmit,
    isSubmitting,
    activeAddresses,
    selectedAddress,
    selectedAddressId,
    isSelectedAddressMissingPhone,
    isAddressesLoading,
    handleSelectSavedAddress,
    isSelectionModalOpen,
    setIsSelectionModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    editingAddress,
    handleOpenAddModal,
    handleOpenEditAddressModal,
    newAddressFormData,
    setNewAddressFormData,
    handleSaveNewAddress,
    stockIssues,
    isStockAlertModalOpen,
    setIsStockAlertModalOpen,
    toastMessage,
    showToast,
  } = useCheckoutFlow();

  // Safe client render check, initial cart/session loading, or order submission in progress
  if (!mounted || user?.role === "admin" || !user || (isCartLoading && items.length === 0) || isSubmitting) {
    return <CheckoutSkeleton />;
  }

  // If cart is empty and not submitting, show empty state
  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500 selection:text-zinc-950 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-6 sm:py-8 space-y-8">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Delivery Destination & Address */}
              <AddressStep
                form={form}
                savedAddresses={activeAddresses}
                selectedAddress={selectedAddress}
                selectedAddressId={selectedAddressId}
                isLoadingAddresses={isAddressesLoading}
                onSelectSavedAddress={(addr) => {
                  handleSelectSavedAddress(addr);
                  showToast(`Selected ${addr.name} (${addr.label})`);
                }}
                onOpenChangeModal={() => setIsSelectionModalOpen(true)}
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditAddressModal}
              />

              {/* 2. Payment Method & Details */}
              <PaymentStep
                form={form}
                totalAmount={totalPayable}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-40">
              <OrderSummarySticky
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                deliveryZone={(currentZone as "inside-dhaka" | "outside-dhaka") || "inside-dhaka"}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                total={totalPayable}
                isSubmitting={isSubmitting}
                isAddressValid={!isSelectedAddressMissingPhone}
                onPromptFixAddress={() => {
                  if (selectedAddress) {
                    handleOpenEditAddressModal(selectedAddress);
                  } else {
                    handleOpenAddModal();
                  }
                }}
              />
            </div>
          </div>
        </form>
      </main>

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        addresses={activeAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={(addr) => {
          handleSelectSavedAddress(addr);
          showToast(`Delivering to ${addr.name} (${addr.label})`);
        }}
        onAddNewAddress={() => {
          setIsSelectionModalOpen(false);
          handleOpenAddModal();
        }}
        onEditAddress={handleOpenEditAddressModal}
      />

      {/* Add / Edit Address Modal */}
      <AddressFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isEditing={Boolean(editingAddress)}
        formData={newAddressFormData}
        setFormData={setNewAddressFormData}
        onSubmit={handleSaveNewAddress}
      />

      {/* Stock Availability Alert Modal (Shows Out-of-Stock items removed from cart) */}
      <StockAlertModal
        isOpen={isStockAlertModalOpen}
        onClose={() => setIsStockAlertModalOpen(false)}
        issues={stockIssues}
        remainingCount={items.length}
      />

      {/* Quick Notification Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-950 text-xs font-bold shadow-2xl border border-white/10 dark:border-zinc-800 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
