"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues, BD_DISTRICTS } from "@/validations/checkout.schema";
import { Address } from "@/types/order.types";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Building2,
  FileText,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common";

interface AddressStepProps {
  form: UseFormReturn<CheckoutFormValues>;
  savedAddresses?: Address[];
  onSelectSavedAddress?: (addr: Address) => void;
  onContinue: () => void;
}

export function AddressStep({
  form,
  savedAddresses = [],
  onSelectSavedAddress,
  onContinue,
}: AddressStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentZone = watch("zone");
  const selectedCity = watch("city");

  const handleZoneSelect = (zone: "inside-dhaka" | "outside-dhaka") => {
    setValue("zone", zone, { shouldValidate: true });
    if (zone === "inside-dhaka") {
      setValue("city", "Dhaka", { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Saved Addresses quick selection if customer logged in */}
      {savedAddresses.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BookmarkCheck className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              Choose from Saved Addresses
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => onSelectSavedAddress?.(addr)}
                className="group relative flex flex-col text-left p-3 rounded-xl border border-border/70 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground group-hover:text-amber-600 transition-colors">
                    {addr.name} ({addr.label})
                  </span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-semibold text-muted-foreground uppercase">
                    {addr.zone === "inside-dhaka" ? "Dhaka" : "Outside"}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] truncate">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-muted-foreground text-[11px] font-mono mt-0.5">
                  {addr.phone}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Delivery Form Box */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-sm space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            <span>Contact & Shipping Details</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ensure your active Bangladesh phone number is provided for courier verification.
          </p>
        </div>

        {/* Contact Info (Name, Phone, Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tanvir Hossain"
              {...register("fullName")}
              className={cn(
                "w-full h-11 px-3.5 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                errors.fullName ? "border-rose-500" : "border-border/80"
              )}
            />
            {errors.fullName && (
              <p className="text-[11px] font-medium text-rose-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* BD Mobile Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Mobile Phone (BD +880) *</span>
            </label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("phone")}
              className={cn(
                "w-full h-11 px-3.5 rounded-xl border bg-background text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                errors.phone ? "border-rose-500" : "border-border/80"
              )}
            />
            {errors.phone ? (
              <p className="text-[11px] font-medium text-rose-500">
                {errors.phone.message}
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground">
                Courier will send SMS OTP or call before delivery.
              </p>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Email Address (Optional)</span>
          </label>
          <input
            type="email"
            placeholder="tanvir@example.com (for order receipts)"
            {...register("email")}
            className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Delivery Zone Selector (Inside Dhaka vs Outside Dhaka) */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-500" />
            <span>Select Delivery Zone *</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Inside Dhaka */}
            <button
              type="button"
              onClick={() => handleZoneSelect("inside-dhaka")}
              className={cn(
                "relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                currentZone === "inside-dhaka"
                  ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                  : "border-border/80 bg-card hover:bg-muted/40"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-foreground">
                    Inside Dhaka Metro
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Same-day or next 24h delivery
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-amber-600">
                  ৳70
                </span>
                <span className="block text-[10px] text-muted-foreground font-semibold">
                  Standard Rate
                </span>
              </div>
            </button>

            {/* Outside Dhaka */}
            <button
              type="button"
              onClick={() => handleZoneSelect("outside-dhaka")}
              className={cn(
                "relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                currentZone === "outside-dhaka"
                  ? "border-amber-500 bg-amber-500/10 ring-1 ring-amber-500"
                  : "border-border/80 bg-card hover:bg-muted/40"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-foreground">
                    Outside Dhaka (All BD)
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Steadfast / Pathao (48–72h)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-amber-600">
                  ৳130
                </span>
                <span className="block text-[10px] text-muted-foreground font-semibold">
                  Courier Rate
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* City/District & Postal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>District / Division *</span>
            </label>
            <select
              {...register("city")}
              className={cn(
                "w-full h-11 px-3 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                errors.city ? "border-rose-500" : "border-border/80"
              )}
            >
              <option value="">Select District</option>
              {BD_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-[11px] font-medium text-rose-500">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Postal Code (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 1205"
              {...register("postalCode")}
              className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Detailed Street Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Full Street Address *</span>
          </label>
          <textarea
            rows={2}
            placeholder="House #, Road #, Sector / Block, Flat / Apartment details"
            {...register("street")}
            className={cn(
              "w-full p-3.5 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none",
              errors.street ? "border-rose-500" : "border-border/80"
            )}
          />
          {errors.street && (
            <p className="text-[11px] font-medium text-rose-500">
              {errors.street.message}
            </p>
          )}
        </div>

        {/* Special Instructions / Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Delivery Instructions / Note (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Call before arrival, leave with security guard"
            {...register("deliveryNote")}
            className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Step 1 Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="amber"
            size="lg"
            onClick={onContinue}
            className="w-full sm:w-auto"
          >
            <span>Continue to Payment Method</span>
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
