"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Share2, Phone, User, Loader2, CheckCircle2, AlertCircle,
  ShoppingBag, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useCreateAdminOrderMutation } from "@/services/api/orders/orderApi";
import type { OrderSource } from "@/types/order.types";
import { CustomerSearchSection } from "./CustomerSearchSection";
import type { SelectedCustomerInfo } from "./CustomerSearchSection";
import { ProductPickerSection } from "./ProductPickerSection";
import type { OrderLineItem } from "./ProductPickerSection";
import { OrderSummarySection } from "./OrderSummarySection";
import { PaymentDetailsSection } from "./PaymentDetailsSection";
import type { PaymentInfo, PaymentMethod } from "./PaymentDetailsSection";
import { ConfirmationModal } from "@/components/common";
import type { ConfirmationDialogState } from "@/components/common";
import { AdminDeliveryAddressSection } from "./AdminDeliveryAddressSection";
import type { ManualOrderAddressValues } from "./ManualOrderAddressModal";
import type { CustomerAddress } from "@/services/api/customers/customerApi";

type AdminOrderSource = Exclude<OrderSource, "WEBSITE">;

const SOURCE_OPTIONS: { value: AdminOrderSource; label: string; icon: React.ElementType; color: string }[] = [
  { value: "FACEBOOK", label: "Facebook", icon: Share2, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  { value: "PHONE", label: "Phone Call", icon: Phone, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  { value: "ADMIN", label: "Admin Entry", icon: User, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
];

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").or(z.literal("")),
  street: z.string().min(3, "Street address required"),
  area: z.string().optional(),
  union: z.string().optional(),
  label: z.enum(["Home", "Office", "Other"]),
  city: z.string().min(2, "City is required"),
  zone: z.enum(["inside-dhaka", "outside-dhaka"]),
  deliveryNote: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const DEFAULT_PAYMENT: PaymentInfo = {
  paymentMethod: "cod",
  trxId: "",
  mfsNumber: "",
  amount: "",
};

export function ManualOrderForm() {
  const router = useRouter();
  const [createAdminOrder, { isLoading: isSubmitting }] = useCreateAdminOrderMutation();

  const [source, setSource] = useState<AdminOrderSource>("FACEBOOK");
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomerInfo | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [items, setItems] = useState<OrderLineItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentInfo>(DEFAULT_PAYMENT);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "OK",
    variant: "success",
    onConfirm: () => {},
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      street: "",
      area: "",
      union: "",
      label: "Home",
      city: "",
      zone: "inside-dhaka",
      deliveryNote: "",
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;


  // When customer is selected from search, pre-fill all customer and address fields
  const handleCustomerSelect = (customer: SelectedCustomerInfo | null) => {
    setSelectedCustomer(customer);
    setSelectedAddressId(null);
    if (customer) {
      setValue("name", customer.name || "", { shouldValidate: true });
      setValue("phone", customer.phone || "", { shouldValidate: true });
      setValue("email", customer.email || "", { shouldValidate: true });
      setValue("street", customer.street || "", { shouldValidate: true });
      setValue("area", customer.area || "");
      setValue("union", customer.union || "");
      setValue("label", customer.label || "Home");
      setValue("city", customer.city || "", { shouldValidate: true });
      setValue("zone", customer.zone || "inside-dhaka");

      // Auto-select and populate from default or primary address card
      const defaultAddr = customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        const cityLower = (defaultAddr.city || "").toLowerCase();
        setValue("street", defaultAddr.street || "", { shouldValidate: true });
        setValue("area", defaultAddr.area || "");
        setValue("union", defaultAddr.union || "");
        setValue(
          "label",
          defaultAddr.type === "OFFICE"
            ? "Office"
            : defaultAddr.type === "OTHER"
              ? "Other"
              : "Home"
        );
        setValue("city", defaultAddr.city || "", { shouldValidate: true });
        setValue(
          "zone",
          defaultAddr.zone || (cityLower.includes("dhaka") ? "inside-dhaka" : "outside-dhaka")
        );
      }
    } else {
      // Reset all fields when lookup is cleared
      setValue("name", "");
      setValue("phone", "");
      setValue("email", "");
      setValue("street", "");
      setValue("area", "");
      setValue("union", "");
      setValue("label", "Home");
      setValue("city", "");
      setValue("zone", "inside-dhaka");
      setValue("deliveryNote", "");
    }
  };

  // When admin clicks a saved address card, pre-fill all address fields
  const handleAddressCardSelect = (addr: CustomerAddress) => {
    setSelectedAddressId(addr.id);
    const cityLower = (addr.city || "").toLowerCase();
    setValue("street", addr.street || "", { shouldValidate: true });
    setValue("area", addr.area || "");
    setValue("union", addr.union || "");
    setValue(
      "label",
      addr.type === "OFFICE" ? "Office" : addr.type === "OTHER" ? "Other" : "Home"
    );
    setValue("city", addr.city || "", { shouldValidate: true });
    setValue(
      "zone",
      addr.zone || (cityLower.includes("dhaka") ? "inside-dhaka" : "outside-dhaka")
    );
  };

  const handleAddAddress = (address: ManualOrderAddressValues) => {
    setSelectedAddressId(null);
    setValue("name", address.name);
    setValue("phone", address.phone);
    setValue("street", address.street);
    setValue("area", address.area);
    setValue("union", address.union);
    setValue("label", address.label);
    setValue("city", address.city);
    setValue("zone", address.zone);
  };

  const onSubmit = async (formValues: CustomerFormValues) => {
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError("Please add at least one product to the order.");
      return;
    }

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

    const payload = {
      source,
      customerId: selectedCustomer?.customerId || (selectedCustomer as any)?.id,
      customerDetails: {
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email || undefined,
        street: formValues.street,
        area: formValues.area || undefined,
        union: formValues.union || undefined,
        label: formValues.label,
        city: formValues.city,
        zone: formValues.zone,
        deliveryNote: formValues.deliveryNote || undefined,
      },
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        productThumbnail: item.productThumbnail,
        productSku: item.productSku,
        variantName: item.variantName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      deliveryFee: deliveryFee || undefined,
      discount: discount || undefined,
      transaction:
        payment.paymentMethod !== "cod" || payment.amount
          ? {
              paymentMethod: payment.paymentMethod,
              trxId: payment.trxId || undefined,
              mfsNumber: payment.mfsNumber || undefined,
              amount: payment.amount ? Number(payment.amount) : undefined,
            }
          : {
              paymentMethod: payment.paymentMethod as PaymentMethod,
            },
    };

    try {
      const response = await createAdminOrder(payload as any).unwrap();
      const orderNum = response.data?.orderNumber || response.data?.id || "New";
      setConfirmModal({
        isOpen: true,
        title: "Order Created Successfully",
        message: `Order #${orderNum} has been created via ${source}. The customer will receive their details shortly.`,
        confirmLabel: "View Orders",
        hideCancel: true,
        variant: "success",
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          router.push(ROUTES.DASHBOARD + "/orders");
        },
      });
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to create order. Please check the details and try again.";
      setSubmitError(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formHasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 pb-32 sm:pb-20">
      {/* Error Banner */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold">Order creation failed</p>
            <p className="text-[11px] mt-0.5">{submitError}</p>
          </div>
          <button type="button" onClick={() => setSubmitError(null)} className="text-[11px] underline hover:opacity-80 shrink-0">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ── Left Column ── */}
        <div className="xl:col-span-7 space-y-6">

          {/* ── Source Selector ── */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Order Source</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SOURCE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  id={`source-${value.toLowerCase()}`}
                  onClick={() => setSource(value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                    source === value
                      ? color + " shadow-sm scale-[1.02]"
                      : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Customer Section ── */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-5">
            <CustomerSearchSection
              selectedCustomer={selectedCustomer}
              onCustomerSelect={handleCustomerSelect}
            />

            {/* Customer fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/30">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="customer-name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  id="customer-name"
                  {...register("name")}
                  placeholder="Customer full name"
                  className={cn(
                    "h-10 w-full rounded-xl bg-muted/40 border px-3.5 text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50",
                    errors.name ? "border-rose-500/50 bg-rose-500/5" : "border-border/50"
                  )}
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-medium">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="customer-phone" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  id="customer-phone"
                  {...register("phone")}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={cn(
                    "h-10 w-full rounded-xl bg-muted/40 border px-3.5 text-sm font-mono font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50",
                    errors.phone ? "border-rose-500/50 bg-rose-500/5" : "border-border/50"
                  )}
                />
                {errors.phone && <p className="text-[10px] text-rose-500 font-medium">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="customer-email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Email <span className="text-muted-foreground/60 font-normal normal-case">(optional — auto-generated if blank)</span>
                </label>
                <input
                  id="customer-email"
                  {...register("email")}
                  type="email"
                  placeholder="customer@email.com"
                  className={cn(
                    "h-10 w-full rounded-xl bg-muted/40 border px-3.5 text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/50",
                    errors.email ? "border-rose-500/50 bg-rose-500/5" : "border-border/50"
                  )}
                />
                {errors.email && <p className="text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* ── Delivery Address (checkout-style) ── */}
          <AdminDeliveryAddressSection
            savedAddresses={selectedCustomer?.addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={handleAddressCardSelect}
            isAddingAddress={isAddingAddress}
            onOpenAddAddress={() => setIsAddingAddress((current) => !current)}
            onAddAddress={handleAddAddress}
            addressDefaults={{
              label: watch("label") || "Home",
              name: watch("name") || "",
              phone: watch("phone") || "",
              street: watch("street") || "",
              area: watch("area") || "",
              union: watch("union") || "",
              city: watch("city") || "",
              zone: watch("zone") || "inside-dhaka",
            }}
            form={form as any}
          />

          {/* ── Product Picker ── */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40">
            <ProductPickerSection items={items} onItemsChange={setItems} />
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="xl:col-span-5 space-y-6">
          {/* Order Summary */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40">
            <OrderSummarySection
              items={items}
              deliveryFee={deliveryFee}
              discount={discount}
              onDeliveryFeeChange={setDeliveryFee}
              onDiscountChange={setDiscount}
            />
          </div>

          {/* Payment Details */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40">
            <PaymentDetailsSection payment={payment} onPaymentChange={setPayment} />
          </div>

          {/* Submit Card */}
          <div className="admin-card rounded-2xl bg-card p-5 sm:p-6 border border-border/40 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <ClipboardList className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Review & Submit</h3>
            </div>

            {/* Order summary preview */}
            <div className="rounded-xl bg-muted/20 border border-border/30 divide-y divide-border/20 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Source</span>
                <span className="font-bold text-foreground">{source}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Items</span>
                <span className="font-bold text-foreground">{items.length} {items.length === 1 ? "product" : "products"}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-bold text-foreground uppercase">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-muted-foreground">Grand Total</span>
                <span className="font-mono font-black text-foreground">
                  ৳{Math.max(0, items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) + deliveryFee - discount).toLocaleString()}
                </span>
              </div>
            </div>

            {formHasErrors && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/8 border border-rose-500/20">
                <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  Please fix the validation errors above before submitting.
                </p>
              </div>
            )}

            <button
              type="submit"
              id="submit-manual-order-btn"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl text-sm font-black transition-all shadow-md active:scale-[0.98] cursor-pointer",
                isSubmitting
                  ? "bg-amber-500/50 text-zinc-950/50 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/25"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Order…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Manual Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        dialog={confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </form>
  );
}
