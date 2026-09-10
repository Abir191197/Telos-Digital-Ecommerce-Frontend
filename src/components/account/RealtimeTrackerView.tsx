"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores";
import { Order } from "@/types/order.types";
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";
import {
  Search,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export function RealtimeTrackerView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("orderId") || "";

  const { orders } = useAuthStore();
  const [query, setQuery] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (!initialQuery) return null;
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === initialQuery.toLowerCase() ||
          o.orderNumber.toLowerCase() === initialQuery.toLowerCase() ||
          o.trackingNumber?.toLowerCase() === initialQuery.toLowerCase()
      ) || null
    );
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.orderNumber.toLowerCase() === clean ||
        o.orderNumber.toLowerCase().includes(clean) ||
        o.trackingNumber?.toLowerCase() === clean ||
        o.shippingAddress.phone.replace(/\D/g, "").includes(clean.replace(/\D/g, ""))
    );
    setSearchedOrder(found || null);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      {/* Title & Search Bar Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-sm mx-auto">
          <Truck className="h-6 w-6" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Track Your Order in Realtime
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Enter your Telos Order Reference (e.g. <b>TC-84920</b>) or Bangladesh Mobile Number to track live courier status.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. TC-84920 or 01712345678"
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border/80 bg-background text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Track</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
          <span>Try sample orders:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setQuery(o.orderNumber);
                setSearchedOrder(o);
                setHasSearched(true);
              }}
              className="font-mono font-bold bg-muted/60 hover:bg-amber-500 hover:text-white px-2 py-0.5 rounded-lg border border-border/70 transition-all cursor-pointer"
            >
              #{o.orderNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {hasSearched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {searchedOrder ? (
            <>
              {/* Visual Timeline Stepper */}
              <OrderTrackingTimeline order={searchedOrder} />

              {/* Order Specs & Items Preview */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase text-muted-foreground tracking-wider">
                  Order Items ({searchedOrder.items.length})
                </h3>
                <div className="divide-y divide-border/60">
                  {searchedOrder.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
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

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-sm">
                  <span className="font-bold text-foreground">Total Paid/Payable</span>
                  <span className="font-black text-foreground text-base">
                    ৳{searchedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-border/80 bg-card p-8 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No matching order found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We couldn&apos;t find an order matching &quot;{query}&quot;. Please verify your order reference number or mobile number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
