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
  selectedAddressId?: string | null;
  onSelectSavedAddress?: (addr: Address) => void;
  onContinue: () => void;
}

export function AddressStep({
  form,
  savedAddresses = [],
  selectedAddressId,
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

  return (
    <div className="space-y-6">
      {/* Saved Addresses quick selection if customer logged in */}
      {savedAddresses.length > 0 && (
        <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-black text-foreground tracking-tight">
                Choose from Saved Addresses
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Click to autofill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelectSavedAddress?.(addr)}
                  className={cn(
                    "group relative flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer text-xs",
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-xs"
                      : "border-border/70 bg-muted/20 hover:border-amber-500/50 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "font-bold transition-colors",
                          isSelected ? "text-amber-600 dark:text-amber-400 font-black" : "text-foreground group-hover:text-amber-600"
                        )}
                      >
                        {addr.name} ({addr.label})
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        isSelected
                          ? "bg-amber-500 text-zinc-950 font-black"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {addr.zone === "inside-dhaka" ? "Dhaka" : "Outside"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] truncate">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-muted-foreground text-[11px] font-mono mt-1 font-semibold">
                    {addr.phone}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Delivery Form Box */}
      <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              <span>Contact & Delivery Address</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Accurate details ensure seamless courier dispatch and instant SMS notification.
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            Cash On Delivery Ready
          </span>
        </div>

        {/* Section 1: Recipient Contact Details */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            1. Recipient Information
          </p>

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
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* BD Mobile Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Mobile Phone *</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-1.5 top-1.5 bottom-1.5 px-2.5 flex items-center justify-center rounded-lg bg-muted border border-border/70 text-xs font-mono font-bold text-foreground select-none pointer-events-none tracking-wider">
                  +880
                </div>
                <input
                  type="tel"
                  placeholder="17XXXXXXXX"
                  maxLength={11}
                  {...register("phone")}
                  className={cn(
                    "w-full h-11 pl-18 pr-3.5 rounded-xl border bg-background text-sm font-mono tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
                    errors.phone ? "border-rose-500" : "border-border/80"
                  )}
                />
              </div>
              {errors.phone ? (
                <p className="text-[11px] font-semibold text-rose-500">
                  {errors.phone.message}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  Courier will send tracking SMS or call prior to delivery.
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
              placeholder="name@example.com (receives digital warranty invoice)"
              {...register("email")}
              className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Delivery Destination */}
        <div className="space-y-4 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Delivery Destination
            </p>
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-amber-500" />
              <span>Courier Zone: </span>
              <strong className={cn(
                "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide",
                currentZone === "inside-dhaka"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
              )}>
                {currentZone === "inside-dhaka" ? "Dhaka Metro (৳70)" : "Nationwide BD (৳130)"}
              </strong>
            </span>
          </div>

          {/* City/District & Postal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>District / City *</span>
              </label>
              <select
                {...register("city")}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue("city", val, { shouldValidate: true });
                  // Auto-detect zone from city
                  const detectedZone = val === "Dhaka" ? "inside-dhaka" : "outside-dhaka";
                  setValue("zone", detectedZone, { shouldValidate: true });
                }}
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
                <p className="text-[11px] font-semibold text-rose-500">
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
              <span>Full Delivery Address *</span>
            </label>
            <textarea
              rows={2}
              placeholder="House #, Road #, Sector / Area, Flat / Floor details"
              {...register("street")}
              className={cn(
                "w-full p-3.5 rounded-xl border bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none",
                errors.street ? "border-rose-500" : "border-border/80"
              )}
            />
            {errors.street && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.street.message}
              </p>
            )}
          </div>

          {/* Special Instructions / Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Special Delivery Note (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Call 30 mins before arrival, deliver to security reception"
              {...register("deliveryNote")}
              className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Step 1 Action Button */}
        <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            🔒 Your personal information is encrypted with bank-grade 256-bit SSL.
          </p>
          <Button
            type="button"
            variant="amber"
            size="lg"
            onClick={onContinue}
            className="w-full sm:w-auto font-bold px-8 py-5 rounded-2xl shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-transform"
          >
            <span>Continue to Payment</span>
            <Sparkles className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
