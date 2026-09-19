import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Phone, MapPin, Box, Truck, AlertCircle, Send, CheckSquare, Printer, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order.types";

interface DispatchCardItemProps {
  order: Order;
  onDispatchCourier: (order: Order) => void;
  onHandoverRider: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onInspect: (order: Order) => void;
}

export function DispatchCardItem({
  order,
  onDispatchCourier,
  onHandoverRider,
  onPrintInvoice,
  onInspect,
}: DispatchCardItemProps) {
  const isUnassigned = !order.trackingNumber || !order.courierName;

  return (
    <div
      className={cn(
        "group relative admin-card rounded-2xl bg-card p-4 sm:p-5 border-none flex flex-col justify-between gap-4 cursor-default transition-all duration-300 hover:-translate-y-0.5",
        isUnassigned
          ? "shadow-[0_0_24px_rgba(245,158,11,0.12)]"
          : "shadow-[0_0_24px_rgba(59,130,246,0.1)]"
      )}
    >
      {/* Status Bar Left Accent */}
      <div
        className={cn(
          "absolute top-4 left-0 w-1.5 h-8 rounded-r-full transition-all duration-300 group-hover:h-12",
          isUnassigned ? "bg-amber-500" : "bg-blue-500"
        )}
      />

      {/* Card Header: Order # + Zone Tag */}
      <div className="pl-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-sm sm:text-base text-foreground tracking-tight">
              #{order.orderNumber}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
              order.shippingAddress.zone === "inside-dhaka"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            )}
          >
            {order.shippingAddress.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
          </span>
        </div>
      </div>

      {/* Customer Address & Verified Phone */}
      <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">
            {order.shippingAddress.name}
          </p>
          <span className="text-[10px] font-bold text-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded">
            {order.shippingAddress.city}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground font-mono font-semibold">
            <Phone className="h-3 w-3 text-amber-500 shrink-0" />
            <span>{order.shippingAddress.phone}</span>
          </div>
          <a
            href={`tel:${order.shippingAddress.phone}`}
            className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Call Customer
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate">{order.shippingAddress.street}</span>
        </div>
      </div>

      {/* Parcel Packing List Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Box className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Packing ({order.items.reduce((s, i) => s + i.quantity, 0)} units)</span>
          </span>
          <span className="font-mono font-black text-sm text-foreground">
            ৳{order.total.toLocaleString()}
          </span>
        </div>

        {/* Thumbnail Row with Quantity Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-muted shadow-xs"
              title={`${item.productName} (x${item.quantity})`}
            >
              <Image
                src={item.productThumbnail}
                alt={item.productName}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-0.5 right-0.5 rounded px-1 text-[9px] font-black bg-black/85 text-white leading-tight">
                ×{item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Logistics Status Strip */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/30 text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {order.courierName ? (
            <div>
              <span className="font-bold text-foreground">{order.courierName}</span>
              <span className="font-mono text-[10px] text-muted-foreground ml-1">
                ({order.trackingNumber})
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              Awaiting Rider
            </span>
          )}
        </div>

        <span
          className={cn(
            "px-2 py-0.5 rounded-md font-bold uppercase text-[10px]",
            order.paymentStatus === "paid"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}
        >
          {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
        </span>
      </div>

      {/* Direct Fulfillment Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {isUnassigned ? (
          <button
            type="button"
            onClick={() => onDispatchCourier(order)}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Dispatch Courier</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onHandoverRider(order)}
            className="flex-1 py-2 px-3 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Mark Handed to Rider</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onPrintInvoice(order)}
          className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Print Dispatch Label / Invoice"
        >
          <Printer className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onInspect(order)}
          className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Inspect Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
