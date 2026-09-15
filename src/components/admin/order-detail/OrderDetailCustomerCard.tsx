import React from "react";
import { User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface OrderDetailCustomerCardProps {
  order: Order;
}

export function OrderDetailCustomerCard({ order }: OrderDetailCustomerCardProps) {
  return (
    <div className="rounded-3xl bg-card p-5 sm:p-6 admin-card border border-border/60 shadow-lg space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
        <User className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-black text-foreground">Customer Dossier</h2>
      </div>

      <div className="space-y-3.5 text-xs">
        <div>
          <p className="text-muted-foreground text-[11px] font-semibold">
            Customer Name
          </p>
          <p className="font-extrabold text-foreground text-sm mt-0.5">
            {order.shippingAddress.name}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-[11px] font-semibold">
            Phone Contact
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-mono font-bold text-foreground text-sm">
              {order.shippingAddress.phone}
            </span>
            <a
              href={`tel:${order.shippingAddress.phone}`}
              className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-[11px] font-semibold">
            Delivery Zone
          </p>
          <span
            className={cn(
              "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
              order.shippingAddress.zone === "inside-dhaka"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
            )}
          >
            {order.shippingAddress.zone === "inside-dhaka"
              ? "Dhaka Metro"
              : "Outside Dhaka"}
          </span>
        </div>

        <div>
          <p className="text-muted-foreground text-[11px] font-semibold">
            Delivery Address
          </p>
          <p className="text-foreground font-medium mt-1 leading-relaxed bg-muted/30 p-3 rounded-2xl border border-border/40">
            {order.shippingAddress.street}
            {order.shippingAddress.area && `, ${order.shippingAddress.area}`}
            <br />
            {order.shippingAddress.city}
            {order.shippingAddress.postalCode &&
              ` - ${order.shippingAddress.postalCode}`}
          </p>
        </div>
      </div>
    </div>
  );
}
