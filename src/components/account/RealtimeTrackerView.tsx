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
    <div className="min-h-screen bg-background pb-20">
      {/* ── Thematic Spatial Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-muted/40 via-background to-background py-12 sm:py-20">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
        />

        <div className="container max-w-3xl mx-auto px-4 text-center space-y-6 relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Live Dispatch & Courier Radar</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Realtime logistics updates, IMEI verification, and dispatch tracking across Bangladesh.
            </p>
          </div>

          {/* Minimalist Pill Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-xl mx-auto flex items-center rounded-2xl sm:rounded-full border border-border/80 bg-card/80 backdrop-blur-md p-1.5 shadow-lg shadow-black/5 dark:shadow-black/40 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all"
          >
            <div className="flex items-center pl-4 pr-2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (TC-84920) or BD phone..."
              className="w-full bg-transparent text-xs sm:text-sm font-mono placeholder:font-sans placeholder:text-muted-foreground focus:outline-none py-2 text-foreground"
            />
            <button
              type="submit"
              className="h-10 sm:h-11 px-5 sm:px-7 rounded-xl sm:rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Track</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Demo Pill Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <span className="text-[11px]">Quick samples:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQuery(o.orderNumber);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="font-mono text-[11px] font-bold bg-muted/50 hover:bg-amber-500 hover:text-zinc-950 px-2.5 py-1 rounded-full border border-border/60 transition-all cursor-pointer"
              >
                #{o.orderNumber}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <main className="container max-w-4xl mx-auto px-4 pt-8 sm:pt-12 space-y-8">
        {/* Results Section */}
        {hasSearched ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {searchedOrder ? (
              <>
                {/* Visual Timeline Stepper */}
                <OrderTrackingTimeline order={searchedOrder} />

                {/* Clean 2-Column Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Shipping & Delivery Address Card */}
                  <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-3">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span>Delivery Details</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-foreground text-sm">
                        {searchedOrder.shippingAddress.name}
                      </p>
                      <p className="text-muted-foreground">
                        {searchedOrder.shippingAddress.street}, {searchedOrder.shippingAddress.city}
                      </p>
                      <p className="font-mono text-muted-foreground font-semibold pt-1">
                        {searchedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Payment & Security Card */}
                  <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-3">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Payment & Warranty</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className="font-bold text-foreground uppercase text-[11px] bg-muted px-2 py-0.5 rounded-full">
                          {searchedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Courier Zone</span>
                        <span className="font-bold text-foreground">
                          {searchedOrder.shippingAddress.zone === "inside-dhaka" ? "Dhaka Metro (24h)" : "Nationwide BD (48-72h)"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-border/40">
                        <span className="font-bold text-foreground">Total Amount</span>
                        <span className="font-black text-foreground text-sm">
                          ৳{searchedOrder.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordered Items Preview Shelf */}
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider border-b border-border/50 pb-3 flex items-center justify-between">
                    <span>Package Items ({searchedOrder.items.length})</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ Authentic Brand Seal Verified
                    </span>
                  </h3>
                  <div className="divide-y divide-border/40">
                    {searchedOrder.items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground truncate">{item.productName}</p>
                          {item.variantName && (
                            <span className="text-[11px] text-muted-foreground">
                              Variant: {item.variantName}
                            </span>
                          )}
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-black text-foreground shrink-0 text-sm">
                          ৳{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-border/80 bg-card p-10 text-center space-y-4 max-w-lg mx-auto">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                  <Info className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground">
                    No Order Found
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We couldn&apos;t find an active shipment matching &ldquo;<span className="font-mono text-foreground font-bold">{query}</span>&rdquo;. Please verify your reference number or contact support.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={ROUTES.CONTACT}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Contact Dhaka Support Hotline →</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Pristine Empty Hero Teaser (When no search yet) ── */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Live GPS & Courier Sync</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct integration with Steadfast, Pathao, and RedX hubs for precision updates.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">IMEI & Authenticity Scan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every smartphone & gadget is BTRC database verified and logged prior to dispatch.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Tamper-Evident Packaging</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multi-layer bubble wrap & custom security seals guarantee safe arrival.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
