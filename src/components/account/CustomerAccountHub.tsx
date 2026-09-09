"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Phone,
  Building,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import type { OrderStatus, Address } from "@/types/order.types";

export function CustomerAccountHub() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const orders = useAuthStore((state) => state.orders);
  const storeLogout = useAuthStore((state) => state.logout);
  const logout = () => {
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
  };
  const addAddress = useAuthStore((state) => state.addAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);

  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.getItemCount());

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New address form state
  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    name: user?.name || "",
    phone: user?.phone || "+880 1712-345678",
    street: "",
    area: "",
    city: "Dhaka",
    zone: "inside-dhaka",
    postalCode: "",
    isDefault: false,
    label: "Home",
  });

  if (!mounted) {
    return (
      <div className="container py-12 animate-pulse space-y-6">
        <div className="h-32 rounded-3xl bg-muted/60" />
        <div className="h-64 rounded-3xl bg-muted/40" />
      </div>
    );
  }

  // Not logged in fallback
  if (!user) {
    return (
      <div className="container max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Sign In to View Your Account</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Please sign in to track live Bangladesh courier shipments, review your purchase history, and manage addresses.
        </p>
        <div className="pt-2">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Sign In with 1-Tap Demo</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.area) return;
    addAddress(newAddr);
    setShowAddAddressModal(false);
    setNewAddr({
      name: user.name,
      phone: user.phone,
      street: "",
      area: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: false,
      label: "Home",
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 uppercase">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase">
            <Clock className="h-3 w-3" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="container px-3 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* ── Customer Profile Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md">
              {user.avatar ? (
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              ) : (
                <User className="h-full w-full p-3 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">{user.name}</h1>
                <span className="rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-500/30">
                  Verified BD
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Phone className="h-3 w-3 text-amber-500" />
                {user.phone}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Counters Bar */}
        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
            <p className="text-lg sm:text-xl font-black text-foreground">{orders.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Active Wishlist</p>
            <p className="text-lg sm:text-xl font-black text-foreground">{wishlistCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Saved Addresses</p>
            <p className="text-lg sm:text-xl font-black text-foreground">{user.addresses.length}</p>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Account Overview", icon: User },
          { id: "orders", label: `Order History (${orders.length})`, icon: Package },
          { id: "addresses", label: `Saved Addresses (${user.addresses.length})`, icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Latest Order Snapshot */}
          {orders[0] && (
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    Latest Order: #{orders[0].orderNumber}
                  </h3>
                </div>
                {getStatusBadge(orders[0].status)}
              </div>

              {/* Progress Stepper Bar */}
              <div className="py-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pb-2">
                  <span className="text-emerald-600">Order Placed</span>
                  <span className={orders[0].status !== "pending" ? "text-emerald-600" : ""}>
                    Processing
                  </span>
                  <span className={orders[0].status === "shipped" || orders[0].status === "delivered" ? "text-emerald-600" : ""}>
                    In Transit
                  </span>
                  <span className={orders[0].status === "delivered" ? "text-emerald-600" : ""}>
                    Delivered
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{
                      width:
                        orders[0].status === "delivered"
                          ? "100%"
                          : orders[0].status === "shipped"
                          ? "75%"
                          : orders[0].status === "processing"
                          ? "45%"
                          : "15%",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground">Courier: </span>
                  <strong className="text-foreground">{orders[0].courierName}</strong>
                  <span className="text-muted-foreground ml-2 font-mono">({orders[0].trackingNumber})</span>
                </div>
                <span className="font-bold text-foreground">৳{orders[0].total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Default Shipping Address Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Delivery Address
                </span>
                <span className="rounded-full bg-amber-500/15 text-amber-700 text-[10px] font-bold px-2 py-0.5">
                  Default
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">{user.addresses[0]?.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {user.addresses[0]?.street}, {user.addresses[0]?.area}, {user.addresses[0]?.city} - {user.addresses[0]?.postalCode}
              </p>
              <p className="text-xs font-semibold text-foreground">{user.addresses[0]?.phone}</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Need Immediate Help?
                </span>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Call our Dhaka support team directly or reach out via WhatsApp for warranty lookup and courier changes.
                </p>
              </div>
              <a
                href="tel:+8801700000000"
                className="inline-flex items-center gap-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground px-4 py-2.5 text-xs font-bold border border-border transition-colors self-start"
              >
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>+880 1700-000000</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDER HISTORY ── */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground">
                      Order #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-black text-foreground">
                    ৳{order.total.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Payment: <strong className="uppercase text-foreground">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border/70 bg-muted/30">
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground line-clamp-1">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-[10px] text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-foreground shrink-0">
                      ৳{item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    Tracking: <strong className="font-mono text-foreground">{order.trackingNumber}</strong> via {order.courierName}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: SAVED ADDRESSES ── */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Delivery Locations in Bangladesh</h3>
            <button
              type="button"
              onClick={() => setShowAddAddressModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  "rounded-2xl border p-5 space-y-3 relative transition-all",
                  addr.isDefault ? "border-amber-500/60 bg-amber-500/5" : "border-border/80 bg-card"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">
                    <Building className="h-3 w-3" />
                    {addr.label}
                  </span>
                  {addr.isDefault ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-500/20 px-2 py-0.5 rounded-full">
                      Default Shipping
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground">{addr.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-1">Phone: {addr.phone}</p>
                </div>

                {!addr.isDefault && (
                  <div className="pt-2 border-t border-border/50 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Address Form Modal */}
          {showAddAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <h3 className="text-sm font-bold text-foreground">Add New Delivery Location</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(false)}
                    className="text-muted-foreground hover:text-foreground text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-muted-foreground">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-muted-foreground">Phone Number (+880)</label>
                    <input
                      type="text"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-muted-foreground">Street & Building Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 14, Road 3"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-muted-foreground">Area / Thana</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dhanmondi, Gulshan"
                        value={newAddr.area}
                        onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                        className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-muted-foreground">City</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-2.5 font-bold shadow-xs cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
