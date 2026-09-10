"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Order } from "@/types/order.types";
import { ROUTES } from "@/constants";
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  CreditCard,
  Printer,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InvoiceModal } from "@/components/account";

// Minimal lightweight confetti generator without external heavy libraries
function ConfettiEffect() {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; top: number; size: number; bg: string; animDuration: number }>
  >([]);

  useEffect(() => {
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10,
      size: Math.random() * 8 + 6,
      bg: colors[Math.floor(Math.random() * colors.length)],
      animDuration: Math.random() * 2 + 1.5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-bounce opacity-80"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.bg,
            animationDuration: `${p.animDuration}s`,
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "TC-DEMO";
  const { orders } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    // 1. Try finding in store
    const found = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (found) {
      setOrder(found);
      return;
    }

    // 2. Try session storage fallback
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("last_order");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id === orderId || parsed.orderNumber === orderId) {
            setOrder(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [orderId, orders]);

  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const steps = [
    { label: "Order Placed", done: true, desc: "Received by Telos Cart" },
    { label: "Processing & QC", done: true, desc: "Serial & BD warranty verified" },
    { label: "Handed to Courier", done: false, desc: "Steadfast / Telos Express" },
    { label: "Out for Delivery", done: false, desc: "Doorstep delivery with call" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16">
      <ConfettiEffect />

      <div className="container max-w-3xl mx-auto px-4 space-y-8">
        {/* Celebration Stamp Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-10 text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 mx-auto">
            <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11 stroke-[2.5]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Order Successfully Placed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Thank you for your order!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We have received your order and an SMS confirmation with delivery tracking has been sent to your phone.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Order Reference:</span>
            <span className="font-mono text-sm font-black bg-background border border-border/80 px-3 py-1 rounded-xl text-foreground">
              #{orderId}
            </span>
            {order?.trackingNumber && (
              <span className="font-mono text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-600">
                Tracking: {order.trackingNumber}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm sm:text-base font-black text-foreground flex items-center gap-2">
            <Truck className="h-4 w-4 text-amber-500" />
            <span>Fulfillment & Delivery Stepper</span>
          </h2>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {steps.map((st, idx) => (
                <div key={st.label} className="relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors",
                        st.done
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {st.done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "text-xs font-bold",
                        st.done ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {st.label}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-muted/40 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span>Estimated Delivery:</span>
              <span className="font-bold text-foreground">
                {order?.estimatedDelivery || "Tomorrow (within 24 hours)"}
              </span>
            </div>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {order?.courierName || "Telos Express Delivery"}
            </span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground">
                  Order Details Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  Date: {new Date(order.createdAt).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>View & Print Tax Invoice</span>
              </button>
            </div>

            {/* Shipping & Payment summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-1.5">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  Delivery Address
                </span>
                <p className="font-semibold text-foreground">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                <p className="font-mono text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-1.5">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-amber-500" />
                  Payment Information
                </span>
                <p className="font-semibold text-foreground uppercase">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : `${order.paymentMethod} Payment`}
                </p>
                <p className="text-muted-foreground">
                  Status: <span className={cn("font-bold", order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600")}>{order.paymentStatus.toUpperCase()}</span>
                </p>
                <p className="text-muted-foreground font-black text-sm text-foreground pt-1">
                  Amount: ৳{order.total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                Purchased Items ({order.items.length})
              </h4>
              <div className="divide-y divide-border/60">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.productName}</p>
                      {item.variantName && (
                        <span className="text-[11px] text-muted-foreground">
                          Variant: {item.variantName}
                        </span>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-foreground">
                      ৳{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Post-Checkout Navigation CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            href={ROUTES.PROFILE}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-bold transition-all"
          >
            <span>View All Orders in Account</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Printable Tax Invoice Modal ── */}
      {showInvoiceModal && order && (
        <InvoiceModal
          order={order}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
