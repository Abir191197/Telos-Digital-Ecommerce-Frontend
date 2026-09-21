"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "@/validations/checkout.schema";
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

export function useCheckoutFlow() {
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

  const finalizeOrderPlacement = async (values: CheckoutFormValues) => {
    if (!selectedAddress && activeAddresses.length === 0) {
      alert("Please add a delivery address first.");
      handleOpenAddModal();
      return;
    }

    setIsSubmitting(true);

    // STEP 1: PRE-FLIGHT DIRECT DB STOCK & STATUS VERIFICATION
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

      if (stockData && (!stockData.allValid || (stockData.issues && stockData.issues.length > 0))) {
        setIsSubmitting(false);
        setStockIssues(stockData.issues);
        setIsStockAlertModalOpen(true);

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

    // STEP 2: ALL ITEMS IN STOCK - PROCEED TO CONFIRM ORDER
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
      console.error("Order placement error details:", err);
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

  const onSubmit = async (values: CheckoutFormValues) => {
    await finalizeOrderPlacement(values);
  };

  useEffect(() => {
    if (!mounted) return;
    if (user?.role === "admin") {
      router.replace(ROUTES.DASHBOARD);
    } else if (!user) {
      router.replace(`${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.CHECKOUT)}`);
    }
  }, [mounted, user, router]);

  return {
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
    isAddressesLoading,
    handleSelectSavedAddress,
    isSelectionModalOpen,
    setIsSelectionModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    handleOpenAddModal,
    newAddressFormData,
    setNewAddressFormData,
    handleSaveNewAddress,
    stockIssues,
    isStockAlertModalOpen,
    setIsStockAlertModalOpen,
    toastMessage,
    showToast,
  };
}
