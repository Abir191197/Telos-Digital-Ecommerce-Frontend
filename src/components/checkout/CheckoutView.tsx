"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  CheckoutFormValues,
} from "@/validations/checkout.schema";
import { useCartStore, useAuthStore } from "@/stores";
import { useClearCartMutation, useGetMyCartQuery } from "@/services/api/cart/cartApi";
import {
  useCreateOrderMutation,
  useValidateCheckoutStockMutation,
  CreateOrderPayload,
  StockIssue,
} from "@/services/api/orders/orderApi";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
} from "@/services/api/address/addressApi";
import { useMounted } from "@/hooks";
import { Address } from "@/types/order.types";
import { ROUTES } from "@/constants";
import { AddressStep } from "./AddressStep";
import { AddressSelectionModal } from "./AddressSelectionModal";
import { AddressFormModal } from "@/components/account/tabs/AddressFormModal";
import { PaymentStep } from "./PaymentStep";
import { OrderSummarySticky } from "./OrderSummarySticky";
import { StockAlertModal } from "./StockAlertModal";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const { user } = useAuthStore();

  const { isLoading: isCartLoading } = useGetMyCartQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });

  const [clearCartMutation] = useClearCartMutation();
  const [createOrderMutation] = useCreateOrderMutation();
  const [validateCheckoutStockMutation] = useValidateCheckoutStockMutation();

  const {
    items,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    clearCart,
    removeItem,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Address Modals & Toast State
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stock Issues Modal State
  const [stockIssues, setStockIssues] = useState<StockIssue[]>([]);
  const [isStockAlertModalOpen, setIsStockAlertModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Backend Address Query
  const isDemo = !user || user.id.startsWith("demo");
  const {
    data: backendAddresses,
    isLoading: isAddressesLoading,
  } = useGetAddressesQuery(undefined, { skip: isDemo || !user });

  const [createAddressMutation] = useCreateAddressMutation();

  // Active addresses: live backend data prioritized, fallback to user store
  const activeAddresses: Address[] = backendAddresses ?? user?.addresses ?? [];

  // Setup React Hook Form with Zod
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone ? user.phone.replace(/^\+880/, "").replace(/^0/, "") : "",
      email: user?.email || "",
      city: "Dhaka",
      zone: "inside-dhaka",
      street: "",
      postalCode: "",
      paymentMethod: "cod",
      deliveryNote: "",
    },
  });

  const { handleSubmit, setValue, watch } = form;
  const currentZone = watch("zone");

  // Manage selected address synchronization
  const selectedAddress =
    activeAddresses.find((a) => a.id === selectedAddressId) ||
    activeAddresses.find((a) => a.isDefault) ||
    activeAddresses[0] ||
    null;

  const handleSelectSavedAddress = useCallback(
    (addr: Address) => {
      setSelectedAddressId(addr.id);
      setValue("fullName", addr.name, { shouldValidate: true });
      setValue("phone", addr.phone.replace(/^\+880/, "").replace(/^0/, ""), {
        shouldValidate: true,
      });
      setValue("city", addr.city, { shouldValidate: true });
      setValue("zone", addr.zone || "inside-dhaka", { shouldValidate: true });
      setValue("street", addr.street, { shouldValidate: true });
      setValue("postalCode", addr.postalCode || "", { shouldValidate: true });
    },
    [setValue]
  );

  // Auto-populate form when default address loads
  useEffect(() => {
    if (selectedAddress && !selectedAddressId) {
      handleSelectSavedAddress(selectedAddress);
    }
  }, [selectedAddress, selectedAddressId, handleSelectSavedAddress]);

  // Pricing calculations
  const subtotal = getSubtotal();
  const shippingFee =
    subtotal === 0
      ? 0
      : subtotal >= 5000 || appliedCoupon?.code === "FREESHIP"
      ? 0
      : currentZone === "inside-dhaka"
      ? 60
      : 120;

  const discountAmount = appliedCoupon?.percentage
    ? Math.round((subtotal * appliedCoupon.percentage) / 100)
    : appliedCoupon?.fixedAmount
    ? Math.min(appliedCoupon.fixedAmount, subtotal)
    : 0;

  const totalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  // New Address form state for modal
  const [newAddressFormData, setNewAddressFormData] = useState<Omit<Address, "id">>({
    name: "",
    phone: "",
    street: "",
    area: "",
    union: "",
    city: "Dhaka",
    zone: "inside-dhaka",
    postalCode: "",
    isDefault: false,
    label: "Home",
  });

  const handleOpenAddModal = () => {
    setNewAddressFormData({
      name: user?.name || "",
      phone: user?.phone || "+880 1712-345678",
      street: "",
      area: "",
      union: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: activeAddresses.length === 0,
      label: "Home",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressFormData.street || !newAddressFormData.name) return;

    try {
      let created: Address;
      if (!isDemo) {
        created = await createAddressMutation({
          name: newAddressFormData.name,
          phone: newAddressFormData.phone,
          title: newAddressFormData.label,
          street: newAddressFormData.street,
          city: newAddressFormData.city,
          area: newAddressFormData.area,
          union: newAddressFormData.union,
          zone: newAddressFormData.zone,
          postalCode: newAddressFormData.postalCode,
          isDefault: newAddressFormData.isDefault,
        }).unwrap();
      } else {
        created = {
          id: `demo-addr-${Date.now()}`,
          name: newAddressFormData.name,
          phone: newAddressFormData.phone,
          label: (newAddressFormData.label || "Home") as any,
          street: newAddressFormData.street,
          area: newAddressFormData.area,
          union: newAddressFormData.union,
          city: newAddressFormData.city,
          zone: newAddressFormData.zone,
          postalCode: newAddressFormData.postalCode,
          isDefault: newAddressFormData.isDefault,
        };
        useAuthStore.setState((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: [...(state.user.addresses || []), created],
            },
          };
        });
      }

      handleSelectSavedAddress(created);
      setIsAddModalOpen(false);
      setIsSelectionModalOpen(false);
      showToast("New delivery address added and selected!");
    } catch (err: any) {
      console.error("Failed to create address:", err);
      alert(err?.data?.message || err?.message || "Failed to create address.");
    }
  };

  // Submit handler directly hits order placement
  const onSubmit = async (values: CheckoutFormValues) => {
    await finalizeOrderPlacement(values);
  };

  const finalizeOrderPlacement = async (values: CheckoutFormValues) => {
    if (!selectedAddress && activeAddresses.length === 0) {
      alert("Please add a delivery address first.");
      handleOpenAddModal();
      return;
    }

    setIsSubmitting(true);

    // =========================================================================
    // STEP 1: PRE-FLIGHT DIRECT DB STOCK & STATUS VERIFICATION (NO AUTH NEEDED)
    // =========================================================================
    try {
      const stockCheckItems = items.map((item) => ({
        productId: item.product.id,
        variantId: item.variant?.id || null,
        quantity: item.quantity,
      }));

      const stockCheckRes = await validateCheckoutStockMutation({
        items: stockCheckItems,
      }).unwrap();

      const stockData = stockCheckRes?.data;

      // If any product is out of stock, inactive, or unavailable:
      if (stockData && (!stockData.allValid || (stockData.issues && stockData.issues.length > 0))) {
        setIsSubmitting(false);
        setStockIssues(stockData.issues);
        setIsStockAlertModalOpen(true);

        // Remove out-of-stock / invalid item(s) from cart
        for (const issue of stockData.issues) {
          const matchingItems = items.filter(
            (cartItem) =>
              cartItem.product.id === issue.productId &&
              (!issue.variantId || cartItem.variant?.id === issue.variantId)
          );
          for (const m of matchingItems) {
            removeItem(m.id);
          }
        }

        showToast("Unavailable items have been removed from your cart.");
        return;
      }
    } catch (stockErr: any) {
      console.error("Pre-checkout stock verification error:", stockErr);
      alert(
        stockErr?.data?.message ||
          stockErr?.message ||
          "Could not verify current item stock. Please check your connection."
      );
      setIsSubmitting(false);
      return;
    }

    // =========================================================================
    // STEP 2: ALL ITEMS IN STOCK - PROCEED SILENTLY TO CONFIRM ORDER AS USUAL
    // =========================================================================
    const recipientName =
      values.fullName || selectedAddress?.name || user?.name || "Customer";
    const rawRecipientPhone =
      values.phone ||
      selectedAddress?.phone ||
      user?.phone ||
      "01712345678";
    const recipientStreet =
      values.street || selectedAddress?.street || "Delivery Address";
    const recipientCity =
      values.city || selectedAddress?.city || "Dhaka";
    const recipientZone =
      values.zone || selectedAddress?.zone || "inside-dhaka";
    const recipientPostalCode =
      values.postalCode || selectedAddress?.postalCode || "1200";

    try {
      const orderPayload: CreateOrderPayload = {
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant?.id,
          productName: item.product.name,
          productThumbnail: item.product.thumbnail,
          productSku: item.product.sku,
          variantName: item.variant?.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        customerDetails: {
          name: recipientName,
          phone: rawRecipientPhone.startsWith("+880")
            ? rawRecipientPhone
            : rawRecipientPhone.startsWith("0")
            ? `+88${rawRecipientPhone}`
            : `+880${rawRecipientPhone}`,
          email: values.email || user?.email || undefined,
          street: recipientStreet,
          area: selectedAddress?.area || selectedAddress?.city || recipientCity,
          city: recipientCity,
          zone: recipientZone,
          postalCode: recipientPostalCode,
          label: selectedAddress?.label || "Home",
          deliveryNote: values.deliveryNote || undefined,
        },
        transaction: {
          paymentMethod: values.paymentMethod,
          trxId: values.trxId || undefined,
          mfsNumber: values.mfsNumber || undefined,
          amount: totalPayable,
        },
        deliveryFee: shippingFee,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || undefined,
      };

      console.log("Submitting orderPayload:", JSON.stringify(orderPayload, null, 2));

      const result = await createOrderMutation(orderPayload).unwrap();
      const placedOrder = result.data;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("last_order", JSON.stringify(placedOrder));
      }

      clearCart();
      try {
        await clearCartMutation().unwrap();
      } catch (e) {
        console.error("Failed to clear server cart on checkout:", e);
      }

      const targetOrderId = placedOrder?.orderNumber || placedOrder?.id || "";
      router.push(targetOrderId ? `/checkout/success?orderId=${targetOrderId}` : "/checkout/success");
    } catch (err: any) {
      const serializableError = {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        status: err?.status,
        data: err?.data,
        error: err?.error,
        keys: err ? Object.getOwnPropertyNames(err) : [],
      };
      console.error("Order placement error details:", serializableError);

      const serverMsg =
        (typeof err?.data === "object" && err?.data?.message) ||
        (typeof err?.data === "object" && err?.data?.error) ||
        (typeof err?.data === "string" ? err.data : null) ||
        err?.error ||
        err?.message ||
        `Status ${err?.status || "Unknown"}: Order placement failed.`;

      alert(`Error (${err?.status || "Unknown"}): ${serverMsg}`);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (user?.role === "admin") {
      router.replace(ROUTES.DASHBOARD);
    } else if (!user) {
      router.replace(`${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.CHECKOUT)}`);
    }
  }, [mounted, user, router]);

  // Safe client render check or initial cart/session loading
  if (!mounted || user?.role === "admin" || !user || (isCartLoading && items.length === 0)) {
    return <CheckoutSkeleton />;
  }

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-lg mx-auto px-4 py-20 text-center space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-foreground">
              Your cart is empty
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Looks like you haven&apos;t added any products to your shopping bag yet.
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore Products Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
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
      />

      {/* Add New Address Modal (Cascade District / Upazila / Union) */}
      <AddressFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isEditing={false}
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
