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
  useUpdateAddressMutation,
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
  const [createAddressMutation] = useCreateAddressMutation();
  const [updateAddressMutation] = useUpdateAddressMutation();

  const {
    items,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    clearCart,
    removeItem,
  } = useCartStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stock Issues Modal State
  const [stockIssues, setStockIssues] = useState<StockIssue[]>([]);
  const [isStockAlertModalOpen, setIsStockAlertModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isDemo =
    Boolean(user?.id?.startsWith("mock-")) ||
    user?.email === "admin@telos.com" ||
    user?.email === "customer@telos.com";

  // Real backend address data
  const { data: serverAddresses = [], isLoading: isAddressesLoading } =
    useGetAddressesQuery(undefined, {
      skip: !user || isDemo,
      refetchOnMountOrArgChange: true,
    });

  const activeAddresses: Address[] = isDemo
    ? user?.addresses || []
    : serverAddresses.length > 0
    ? serverAddresses
    : user?.addresses || [];

  // Default to primary or first available address
  const selectedAddress =
    activeAddresses.find((a) => a.id === selectedAddressId) ||
    activeAddresses.find((a) => a.isDefault) ||
    activeAddresses[0] ||
    null;

  const handleSelectSavedAddress = useCallback((addr: Address) => {
    setSelectedAddressId(addr.id);
  }, []);

  useEffect(() => {
    if (activeAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = activeAddresses.find((a) => a.isDefault) || activeAddresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [activeAddresses, selectedAddressId]);

  // Sync selected address into react-hook-form state
  useEffect(() => {
    if (selectedAddress && !selectedAddressId) {
      handleSelectSavedAddress(selectedAddress);
    }
  }, [selectedAddress, selectedAddressId, handleSelectSavedAddress]);

  const currentZone = selectedAddress?.zone || "inside-dhaka";

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      street: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      deliveryNote: "",
      paymentMethod: "cod",
      mfsNumber: "",
      trxId: "",
    },
  });

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = currentZone === "inside-dhaka" ? 70 : 130;
  const totalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  // Address form state for modal
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
    setEditingAddress(null);
    setNewAddressFormData({
      name: user?.name || "",
      phone: user?.phone || "",
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

  const handleOpenEditAddressModal = (addr: Address) => {
    setEditingAddress(addr);
    setNewAddressFormData({
      name: addr.name || "",
      phone: addr.phone || "",
      street: addr.street || "",
      area: addr.area || "",
      union: addr.union || "",
      city: addr.city || "Dhaka",
      zone: addr.zone || "inside-dhaka",
      postalCode: addr.postalCode || "",
      isDefault: Boolean(addr.isDefault),
      label: addr.label || "Home",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressFormData.street || !newAddressFormData.name) return;

    if (!newAddressFormData.phone || !newAddressFormData.phone.trim()) {
      alert("A valid phone number is required for courier delivery.");
      return;
    }

    try {
      if (editingAddress) {
        // EDIT EXISTING ADDRESS
        let updated: Address;
        if (!isDemo) {
          updated = await updateAddressMutation({
            id: editingAddress.id,
            body: {
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
            },
          }).unwrap();
        } else {
          updated = {
            id: editingAddress.id,
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
                addresses: (state.user.addresses || []).map((a) =>
                  a.id === editingAddress.id ? updated : a
                ),
              },
            };
          });
        }

        handleSelectSavedAddress(updated);
        setIsAddModalOpen(false);
        setEditingAddress(null);
        showToast("Address updated successfully!");
      } else {
        // CREATE NEW ADDRESS
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
        setEditingAddress(null);
        showToast("New delivery address added and selected!");
      }
    } catch (err: any) {
      console.error("Failed to save address:", err);
      alert(err?.data?.message || err?.message || "Failed to save address.");
    }
  };

  const isSelectedAddressMissingPhone = Boolean(
    selectedAddress && (!selectedAddress.phone || !selectedAddress.phone.trim())
  );

  const finalizeOrderPlacement = async (values: CheckoutFormValues) => {
    if (!selectedAddress && activeAddresses.length === 0) {
      alert("Please add a delivery address first.");
      handleOpenAddModal();
      return;
    }

    // STRICT CHECK: Verify selected address has a valid phone number
    const addressPhone = (selectedAddress?.phone || values.phone || "").trim();
    if (!addressPhone) {
      showToast("Selected delivery address is missing a phone number. Please update it to proceed.");
      if (selectedAddress) {
        handleOpenEditAddressModal(selectedAddress);
      } else {
        handleOpenAddModal();
      }
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
    const rawRecipientPhone = addressPhone;
    const recipientStreet =
      values.street || selectedAddress?.street || "Delivery Address";
    const recipientCity =
      values.city || selectedAddress?.city || "Dhaka";
    const recipientZone =
      values.zone || selectedAddress?.zone || "inside-dhaka";
    const recipientPostalCode =
      values.postalCode || selectedAddress?.postalCode || "1200";

    try {
      const formattedPhone = rawRecipientPhone.startsWith("+880")
        ? rawRecipientPhone
        : rawRecipientPhone.startsWith("0")
        ? `+88${rawRecipientPhone}`
        : `+880${rawRecipientPhone}`;

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
          phone: formattedPhone,
          email: values.email || user?.email || undefined,
          street: recipientStreet,
          city: recipientCity,
          area: selectedAddress?.area || selectedAddress?.city || recipientCity,
          union: selectedAddress?.union || undefined,
          zone: recipientZone as "inside-dhaka" | "outside-dhaka",
          postalCode: recipientPostalCode,
          label: selectedAddress?.label || "Home",
          deliveryNote: values.deliveryNote || undefined,
        },
        transaction:
          values.paymentMethod !== "cod"
            ? {
                paymentMethod: values.paymentMethod,
                mfsNumber: values.mfsNumber,
                trxId: values.trxId,
                amount: totalPayable,
              }
            : undefined,
        deliveryFee: shippingFee,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
      };

      const res = await createOrderMutation(orderPayload).unwrap();
      const confirmedOrder = res?.data || res;
      const finalOrderNumber = confirmedOrder?.orderNumber || "OD-CONFIRMED";

      if (!isDemo && user) {
        await clearCartMutation().unwrap();
      }
      clearCart();

      const successUrl = `${ROUTES.CHECKOUT_SUCCESS}?orderNumber=${encodeURIComponent(
        finalOrderNumber
      )}&total=${encodeURIComponent(totalPayable)}&paymentMethod=${encodeURIComponent(
        values.paymentMethod
      )}`;
      router.push(successUrl);
    } catch (err: any) {
      console.error("Order creation failed:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        "Could not finalize your order. Please try again.";
      alert(msg);
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    await finalizeOrderPlacement(values);
  };

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
    handleSubmit: form.handleSubmit,
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
  };
}
