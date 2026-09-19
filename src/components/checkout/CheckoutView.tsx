"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  CheckoutFormValues,
} from "@/validations/checkout.schema";
import { useCartStore, useAuthStore } from "@/stores";
import { useClearCartMutation } from "@/services/api/cart/cartApi";
import { useCreateOrderMutation, CreateOrderPayload } from "@/services/api/orders/orderApi";
import { useMounted } from "@/hooks";
import { Address, Order } from "@/types/order.types";
import { ROUTES } from "@/constants";
import { CheckoutHeader } from "./CheckoutHeader";
import { StepIndicator } from "./StepIndicator";
import { AddressStep } from "./AddressStep";
import { PaymentStep } from "./PaymentStep";
import { OrderSummarySticky } from "./OrderSummarySticky";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OtpVerificationModal } from "@/components/auth/OtpVerificationModal";

export function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const [clearCartMutation] = useClearCartMutation();
  const [createOrderMutation] = useCreateOrderMutation();

  const {
    items,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    clearCart,
  } = useCartStore();

  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [pendingCheckoutValues, setPendingCheckoutValues] =
    useState<CheckoutFormValues | null>(null);

  // Setup React Hook Form with Zod
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone ? user.phone.replace(/^\+880/, "") : "",
      email: user?.email || "",
      city: "Dhaka",
      zone: "inside-dhaka",
      street: "",
      postalCode: "",
      deliveryNote: "",
      paymentMethod: "cod",
      mfsNumber: "",
      trxId: "",
    },
    mode: "onTouched",
  });

  const { handleSubmit, trigger, watch, setValue } = form;
  const currentZone = watch("zone");

  // Shipping fee calculation based on dynamic BD zone and free shipping threshold
  const subtotal = getSubtotal();
  const rawShippingFee = currentZone === "inside-dhaka" ? 70 : 130;
  const shippingFee = subtotal >= 5000 ? 0 : rawShippingFee;

  const discountAmount = appliedCoupon
    ? appliedCoupon.percentage
      ? Math.round((subtotal * appliedCoupon.percentage) / 100)
      : appliedCoupon.fixedAmount || 0
    : 0;

  const totalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  // Prepopulate form if user selects a saved address
  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setValue("fullName", addr.name, { shouldValidate: true, shouldDirty: true });
    // Strip leading +880 or leading 0 so it aligns with fixed +880 badge
    const cleanPhone = addr.phone.replace(/^\+880\s?/, "").replace(/^0/, "");
    setValue("phone", cleanPhone, { shouldValidate: true, shouldDirty: true });
    setValue("city", addr.city, { shouldValidate: true, shouldDirty: true });
    setValue("zone", addr.zone, { shouldValidate: true, shouldDirty: true });
    setValue("street", addr.street, { shouldValidate: true, shouldDirty: true });
    if (addr.postalCode) setValue("postalCode", addr.postalCode, { shouldDirty: true });
  };

  // Step 1 -> Step 2 validation handler
  const handleContinueToStep2 = async () => {
    const isStep1Valid = await trigger([
      "fullName",
      "phone",
      "email",
      "city",
      "zone",
      "street",
    ]);
    if (isStep1Valid) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Final submit handler triggers SMS OTP verification for Bangladeshi orders
  const onSubmit = async (values: CheckoutFormValues) => {
    setPendingCheckoutValues(values);
    setShowOtpModal(true);
  };

  const finalizeOrderPlacement = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);

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
          name: values.fullName,
          phone: values.phone,
          email: values.email || user?.email || undefined,
          street: values.street,
          area: values.city,
          city: values.city,
          zone: values.zone,
          postalCode: values.postalCode || "1200",
          label: "Home",
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
      console.error("Order placement error:", err);
      alert(err?.data?.message || err?.message || "Order placement failed. Please try again.");
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

  // Safe client render check or redirecting
  if (!mounted || user?.role === "admin" || !user) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
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
      <CheckoutHeader />

      <main className="container py-6 sm:py-8 space-y-8">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          onStepChange={(step) => setCurrentStep(step)}
          canNavigateToStep2={currentStep === 2}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Flow Steps */}
            <div className="lg:col-span-7 space-y-6">
              {currentStep === 1 && (
                <AddressStep
                  form={form}
                  savedAddresses={user?.addresses || []}
                  selectedAddressId={selectedAddressId}
                  onSelectSavedAddress={handleSelectSavedAddress}
                  onContinue={handleContinueToStep2}
                />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  form={form}
                  totalAmount={totalPayable}
                  onBack={() => setCurrentStep(1)}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-5">
              <OrderSummarySticky
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                deliveryZone={currentZone}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                total={totalPayable}
              />
            </div>
          </div>
        </form>
      </main>

      {/* ── SMS OTP Verification Modal ── */}
      <OtpVerificationModal
        phone={pendingCheckoutValues?.phone || form.getValues("phone")}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => {
          if (pendingCheckoutValues) {
            finalizeOrderPlacement(pendingCheckoutValues);
          }
        }}
        purpose="Verify phone number to confirm your order and courier dispatch"
      />
    </div>
  );
}
