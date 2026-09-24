import React from "react";
import { User, Phone, MapPin, CreditCard, Truck, Send, Globe, Mail, FileText } from "lucide-react";
import { OrderSourceBadge } from "./OrderSourceBadge";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface OrderSidebarSectionProps {
  order: Order;
  courierNameInput: string;
  setCourierNameInput: (val: string) => void;
  trackingNumberInput: string;
  setTrackingNumberInput: (val: string) => void;
  onAssignTracking: (e: React.FormEvent) => void;
}

export function OrderSidebarSection({
  order,
  courierNameInput,
  setCourierNameInput,
  trackingNumberInput,
  setTrackingNumberInput,
  onAssignTracking,
}: OrderSidebarSectionProps) {
  return (
    <div className="space-y-6">
      {/* Customer Details */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Customer Details
          </h2>
        </div>

        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-3 text-xs">
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold">
              Name
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {order.shippingAddress?.name}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold">
              Phone
            </p>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-mono font-bold text-foreground text-sm">
                {order.shippingAddress?.phone}
              </span>
              <a
                href={`tel:${order.shippingAddress?.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold">
              Delivery Area
            </p>
            <span
              className={cn(
                "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                order.shippingAddress?.zone === "inside-dhaka"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
              )}
            >
              {order.shippingAddress?.zone === "inside-dhaka"
                ? "Dhaka Metro"
                : "Outside Dhaka"}
            </span>
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold mb-1">
              Shipping Address
            </p>
            <div className="flex items-start gap-2 bg-background/60 p-2.5 rounded-xl border border-border/40 text-foreground leading-relaxed">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress?.street}
                {order.shippingAddress?.area && `, ${order.shippingAddress?.area}`}
                <br />
                {order.shippingAddress?.city}
                {order.shippingAddress?.postalCode &&
                  ` - ${order.shippingAddress?.postalCode}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            Payment
          </h2>
        </div>

        <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="font-mono font-bold text-foreground uppercase">
              {order.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Status:</span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                order.paymentStatus === "paid"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              )}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Courier & Delivery Assignment */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Courier & Delivery
            </h2>
          </div>
          {order.courierName ? (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Assigned
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Unassigned
            </span>
          )}
        </div>

        {order.courierName && (
          <div className="rounded-2xl bg-muted/30 border border-border/50 p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Courier:</span>
              <strong className="text-foreground">{order.courierName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking #:</span>
              <strong className="text-foreground font-mono">
                {order.trackingNumber}
              </strong>
            </div>
          </div>
        )}

        {/* Assignment Form */}
        <form onSubmit={onAssignTracking} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Select Courier
            </label>
            <select
              value={courierNameInput}
              onChange={(e) => setCourierNameInput(e.target.value)}
              className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-medium text-foreground focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Steadfast Courier">Steadfast Courier</option>
              <option value="Pathao Courier">Pathao Courier</option>
              <option value="RedX Logistics">RedX Logistics</option>
              <option value="eCourier">eCourier Bangladesh</option>
              <option value="Paperfly">Paperfly Home Delivery</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. STE-123456"
              value={trackingNumberInput}
              onChange={(e) => setTrackingNumberInput(e.target.value)}
              className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-mono font-medium text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Save Courier Tracking</span>
          </button>
        </form>
      </div>
    </div>
  );
}
