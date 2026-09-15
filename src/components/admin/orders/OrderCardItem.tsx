import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Truck, Eye, Printer, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderCardItemProps {
  order: Order;
  getStatusBadge: (status: OrderStatus) => React.ReactNode;
  onPrintInvoice: (order: Order) => void;
  onQuickInspect?: (order: Order) => void;
}

export function OrderCardItem({
  order,
  getStatusBadge,
  onPrintInvoice,
  onQuickInspect,
}: OrderCardItemProps) {
  const statusAccents: Record<OrderStatus, { bar: string; glow: string; text: string }> = {
    delivered: {
      bar: "bg-emerald-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    shipped: {
      bar: "bg-blue-500",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
      text: "text-blue-600 dark:text-blue-400",
    },
    processing: {
      bar: "bg-amber-500",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]",
      text: "text-amber-600 dark:text-amber-400",
    },
    pending: {
      bar: "bg-zinc-400 dark:bg-zinc-600",
      glow: "shadow-[0_0_20px_rgba(113,113,122,0.1)]",
      text: "text-muted-foreground",
    },
    cancelled: {
      bar: "bg-rose-500",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.12)]",
      text: "text-rose-600",
    },
  };
  const accent = statusAccents[order.status] || statusAccents.pending;

  return (
    <Link
      href={`/dashboard/orders/${order.orderNumber}`}
      className={cn(
        "group relative admin-card rounded-2xl bg-card p-4 sm:p-5 border-none flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]",
        accent.glow
      )}
    >
      {/* Subtle Status Color Indicator Bar (Top Left Accent) */}
      <div
        className={cn(
          "absolute top-4 left-0 w-1 h-7 rounded-r-full transition-all duration-300 group-hover:h-10",
          accent.bar
        )}
      />

      {/* Header: Order # + Status Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 pl-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-sm sm:text-base text-foreground tracking-tight">
              #{order.orderNumber}
            </span>
            <span className="text-[10.5px] font-medium text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div onClick={(e) => e.preventDefault()}>
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      {/* Customer Card Section */}
      <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">
            {order.shippingAddress.name}
          </p>
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
            {order.shippingAddress.city}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Phone className="h-3 w-3 shrink-0" />
          <span className="font-mono">{order.shippingAddress.phone}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{order.shippingAddress.street}</span>
        </div>
      </div>

      {/* Items Preview Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground">
            {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
          </span>
          <div className="text-right">
            <span className="font-mono font-black text-sm sm:text-base text-foreground">
              ৳{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Thumbnail Row */}
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
              {item.quantity > 1 && (
                <span className="absolute bottom-0.5 right-0.5 rounded px-1 text-[9px] font-black bg-black/80 text-white leading-tight">
                  ×{item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logistics & Payment Meta Strip */}
      <div className="flex items-center justify-between pt-2.5 border-t border-border/30 text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <Truck className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Courier: </span>
          <strong className="text-foreground font-semibold truncate max-w-[100px]">
            {order.courierName || "Unassigned"}
          </strong>
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

      {/* Actions Footer */}
      <div
        className="flex items-center gap-2 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex-1 py-2 px-3 rounded-xl bg-foreground text-background text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPrintInvoice(order);
          }}
          className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Print Invoice"
        >
          <Printer className="h-4 w-4" />
        </button>
        {onQuickInspect && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickInspect(order);
            }}
            className="p-2 rounded-xl bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Inspect Quick Sheet"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </Link>
  );
}
