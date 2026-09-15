import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  Clock,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderDetailHeaderProps {
  order: Order;
  onOpenInvoice: () => void;
}

export function OrderDetailHeader({ order, onOpenInvoice }: OrderDetailHeaderProps) {
  const router = useRouter();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-bold shadow-xs">
            <Truck className="h-3.5 w-3.5" />
            In Transit (Shipped)
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-600 px-3 py-1 text-xs font-bold shadow-xs">
            <AlertCircle className="h-3.5 w-3.5" />
            Cancelled
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3 py-1 text-xs font-bold shadow-xs">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Processing & QC
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/20 border border-zinc-500/30 text-zinc-700 dark:text-zinc-300 px-3 py-1 text-xs font-bold shadow-xs">
            <Clock className="h-3.5 w-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/30 p-4 sm:p-7 shadow-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/10 via-blue-500/10 to-transparent blur-3xl" />

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5">
        {/* Left Title & Status */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all active:scale-95 cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-amber-500 uppercase">
                Consignment #{order.id}
              </span>
              {getStatusBadge(order.status)}
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight font-mono mt-1 truncate">
              #{order.orderNumber}
            </h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 flex items-center gap-1.5 flex-wrap">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80 shrink-0" />
              <span>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto justify-between sm:justify-start pt-2 xl:pt-0 border-t xl:border-t-0 border-border/30">
          {/* Print Invoice */}
          <button
            type="button"
            onClick={onOpenInvoice}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-card border border-border/60 hover:bg-muted/60 text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Invoice</span>
          </button>

          <Link
            href="/dashboard/orders"
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <span>All Orders</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick KPI Strip inside Header */}
      <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Amount
          </p>
          <p className="text-lg sm:text-xl font-mono font-black text-amber-500">
            ৳{order.total.toLocaleString()}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Payment
          </p>
          <p className="text-xs sm:text-sm font-bold uppercase text-foreground">
            {order.paymentMethod} &bull; {order.paymentStatus}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Customer
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {order.shippingAddress.name}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Destination
          </p>
          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
            {order.shippingAddress.city} (
            {order.shippingAddress.zone === "inside-dhaka"
              ? "Dhaka Metro"
              : "Outside"}
            )
          </p>
        </div>
      </div>
    </div>
  );
}
