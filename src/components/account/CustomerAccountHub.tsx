"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  CustomerSidebar,
} from "./CustomerSidebar";
import {
  INITIAL_REVIEWS,
  ACCOUNT_NAV_GROUPS,
  type AccountTabKey,
  type CustomerReview,
} from "./accountNavData";
import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  CreditCard,
  Bell,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Phone,
  Building,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Edit3,
  Check,
  AlertCircle,
} from "lucide-react";
import type { OrderStatus, Address } from "@/types/order.types";

export function CustomerAccountHub() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const orders = useAuthStore((state) => state.orders);
  const updateUser = useAuthStore((state) => state.updateUser);
  const storeLogout = useAuthStore((state) => state.logout);
  const addAddress = useAuthStore((state) => state.addAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);

  const wishlistItems = useWishlistStore((state) => state.items);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  const [activeTab, setActiveTab] = useState<AccountTabKey>("overview");
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [reviewModalItem, setReviewModalItem] = useState<CustomerReview | null>(
    null
  );
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");

  // Profile edit state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // Address modal state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
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

  // Notification preferences state
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  const logout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
  };

  if (!mounted) {
    return (
      <div className="container py-12 animate-pulse space-y-6">
        <div className="h-32 rounded-3xl bg-muted/60" />
        <div className="h-64 rounded-3xl bg-muted/40" />
      </div>
    );
  }

  // Fallback when unauthenticated
  if (!user) {
    return (
      <div className="container max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Sign In to View Your Account
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Please sign in to track live Bangladesh courier shipments, review your
          purchase history, and manage addresses.
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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: profileName, phone: profilePhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewModalItem.id
          ? {
              ...r,
              rating: ratingInput,
              comment: commentInput,
              status: "published",
              date: "Just now",
            }
          : r
      )
    );
    setReviewModalItem(null);
    setCommentInput("");
  };

  const pendingReviewCount = reviews.filter(
    (r) => r.status === "pending_review"
  ).length;

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase">
            <Truck className="h-3 w-3" />
            In Transit
          </span>
        );
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase">
            <Clock className="h-3 w-3" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="container px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* ── Breadcrumb / Header Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">
            Customer Dashboard & Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your orders, personal profile, delivery addresses and preferences.
          </p>
        </div>

        {/* Quick Help Hotline badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Phone className="h-3.5 w-3.5 text-amber-500" />
          <span>BD Hotline: +880 1700-000000</span>
        </div>
      </div>

      {/* ── Mobile Horizontal Pill Scrollable Menu (Visible < lg) ── */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {ACCOUNT_NAV_GROUPS.flatMap((g) => g.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
        {/* Desktop Customer Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block">
          <CustomerSidebar
            user={user}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            orderCount={orders.length}
            wishlistCount={wishlistItems.length}
            pendingReviewCount={pendingReviewCount}
            onLogout={logout}
          />
        </div>

        {/* Right Dynamic Content Pane */}
        <main className="flex-1 w-full min-w-0">
          {/* ══════════════ 1. OVERVIEW TAB ══════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top 3 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Total Orders
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {orders.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Wishlist Items
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {wishlistItems.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-xs flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Saved Addresses
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {user.addresses.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Order Tracking Stepper */}
              {orders[0] && (
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-foreground">
                        Recent Order: #{orders[0].orderNumber}
                      </h3>
                    </div>
                    {getStatusBadge(orders[0].status)}
                  </div>

                  {/* Stepper Progress */}
                  <div className="py-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pb-2">
                      <span className="text-emerald-600">Order Placed</span>
                      <span
                        className={
                          orders[0].status !== "pending" ? "text-emerald-600" : ""
                        }
                      >
                        Processing
                      </span>
                      <span
                        className={
                          orders[0].status === "shipped" ||
                          orders[0].status === "delivered"
                            ? "text-emerald-600"
                            : ""
                        }
                      >
                        In Transit
                      </span>
                      <span
                        className={
                          orders[0].status === "delivered"
                            ? "text-emerald-600"
                            : ""
                        }
                      >
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
                    <div>
                      <span className="text-muted-foreground">Courier: </span>
                      <strong className="text-foreground">
                        {orders[0].courierName}
                      </strong>
                      <span className="text-muted-foreground ml-2 font-mono">
                        ({orders[0].trackingNumber})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">
                        ৳{orders[0].total.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("tracking")}
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                      >
                        <span>Track Live</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Info & Address Snapshot 2-Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Personal Profile
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="text-sm font-bold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs font-semibold text-foreground">
                      {user.phone}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Bangladesh Customer
                    </span>
                  </div>
                </div>

                {/* Primary Address Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Default Address
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("addresses")}
                        className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {user.addresses[0]?.name || user.name}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {user.addresses[0]?.street}, {user.addresses[0]?.area},{" "}
                      {user.addresses[0]?.city} - {user.addresses[0]?.postalCode}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    Zone:{" "}
                    <strong className="text-foreground">
                      {user.addresses[0]?.zone === "inside-dhaka"
                        ? "Inside Dhaka (Next Day)"
                        : "Outside Dhaka (48 Hours)"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 2. PROFILE TAB ══════════════ */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6 shadow-xs">
              <div className="border-b border-border/60 pb-4">
                <h3 className="text-base font-bold text-foreground">
                  Personal Information & Profile
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update your contact details used for orders and delivery communications.
                </p>
              </div>

              {profileSaved && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <Check className="h-4 w-4" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-muted/40 px-3 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Email cannot be changed directly for account security.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">
                    Phone Number (+880 BD)
                  </label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════ 3. ADDRESSES TAB ══════════════ */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Address Book
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manage delivery destinations in Bangladesh.
                  </p>
                </div>
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
                      "rounded-2xl border p-5 space-y-3 relative transition-all shadow-xs",
                      addr.isDefault
                        ? "border-amber-500/60 bg-amber-500/5"
                        : "border-border/80 bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">
                        <Building className="h-3 w-3" />
                        {addr.label}
                      </span>
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                          Default Shipping
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {addr.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
                      </p>
                      <p className="text-xs font-semibold text-foreground mt-1">
                        Phone: {addr.phone}
                      </p>
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

              {/* Add Address Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                      <h3 className="text-sm font-bold text-foreground">
                        Add New Delivery Location
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(false)}
                        className="text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateAddress}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="font-bold text-muted-foreground">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddr.name}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, name: e.target.value })
                          }
                          className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-muted-foreground">
                          Phone Number (+880)
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddr.phone}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, phone: e.target.value })
                          }
                          className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-muted-foreground">
                          Street & Building Address
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. House 14, Road 3"
                          value={newAddr.street}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, street: e.target.value })
                          }
                          className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-muted-foreground">
                            Area / Thana
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dhanmondi"
                            value={newAddr.area}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, area: e.target.value })
                            }
                            className="mt-1 h-9 w-full rounded-xl border border-border/80 bg-background px-3 font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-muted-foreground">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={newAddr.city}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, city: e.target.value })
                            }
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

          {/* ══════════════ 4. ORDERS TAB ══════════════ */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Order Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
                {(
                  [
                    { key: "all", label: "All Orders" },
                    { key: "processing", label: "Processing" },
                    { key: "shipped", label: "In Transit" },
                    { key: "delivered", label: "Delivered" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setOrderFilter(tab.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                      orderFilter === tab.key
                        ? "bg-amber-500 text-white"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-border/80 bg-card text-muted-foreground text-xs">
                  No orders match the selected filter.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-foreground">
                            Order #{order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm font-black text-foreground">
                          ৳{order.total.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Payment:{" "}
                          <strong className="uppercase text-foreground">
                            {order.paymentMethod}
                          </strong>{" "}
                          ({order.paymentStatus})
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
                              <p className="text-[10px] text-muted-foreground">
                                {item.variantName}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ৳
                              {item.unitPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-xs font-bold text-foreground shrink-0">
                            ৳{item.subtotal.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Truck className="h-3.5 w-3.5 text-amber-500" />
                        <span>
                          Tracking:{" "}
                          <strong className="font-mono text-foreground">
                            {order.trackingNumber}
                          </strong>{" "}
                          via {order.courierName}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {order.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ══════════════ 5. LIVE TRACKING TAB ══════════════ */}
          {activeTab === "tracking" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                <div className="border-b border-border/60 pb-3">
                  <h3 className="text-base font-bold text-foreground">
                    Live Courier Parcel Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Real-time status updates synced with Pathao & Steadfast logistics in Bangladesh.
                  </p>
                </div>

                {orders[0] && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-3.5 rounded-xl text-xs">
                      <div>
                        <span className="text-muted-foreground">Tracking Number: </span>
                        <strong className="font-mono text-foreground">
                          {orders[0].trackingNumber}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Partner: </span>
                        <strong className="text-foreground">
                          {orders[0].courierName}
                        </strong>
                      </div>
                      {getStatusBadge(orders[0].status)}
                    </div>

                    {/* Timeline Events */}
                    <div className="space-y-4 pl-4 border-l-2 border-amber-500/40 ml-2">
                      <div className="relative">
                        <div className="absolute -left-[23px] top-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                        <p className="text-xs font-bold text-foreground">
                          Package Dispatched from Dhaka Central Hub
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Today, 10:30 AM • Handed to courier driver
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[23px] top-0 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-background" />
                        <p className="text-xs font-bold text-foreground">
                          Quality Inspection Passed & Sealed
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Yesterday, 04:15 PM • Telos Fulfillment Center
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[23px] top-0 h-3.5 w-3.5 rounded-full bg-muted-foreground/50 border-2 border-background" />
                        <p className="text-xs font-bold text-foreground">
                          Order Verified & Confirmed
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Yesterday, 02:00 PM • Digital payment verified
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ 6. RETURNS & REFUNDS TAB ══════════════ */}
          {activeTab === "returns" && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Return Requests Active
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                All Telos Cart items come with a 7-day hassle-free replacement warranty for defective electronics and return policy.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-white px-4 py-2 text-xs font-bold cursor-pointer hover:bg-amber-600 transition-all"
                >
                  <span>Select Order to Return</span>
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ 7. WISHLIST TAB ══════════════ */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">
                  Saved Wishlist ({wishlistItems.length})
                </h3>
                <Link
                  href={ROUTES.WISHLIST}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-border/80 bg-card text-xs text-muted-foreground">
                  Your wishlist is currently empty.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/80 bg-card p-3 space-y-2 flex flex-col justify-between"
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted/20">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => addToCart(item, 1)}
                          className="flex-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white py-1.5 text-xs font-bold cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => removeWishlistItem(item.id)}
                          aria-label="Remove item"
                          className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 8. REVIEWS & RATINGS TAB ══════════════ */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">
                  My Product Reviews & Ratings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share your genuine experience with Bangladeshi shoppers.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border/70 bg-muted/20">
                        <Image
                          src={rev.productThumbnail}
                          alt={rev.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {rev.productName}
                        </h4>
                        {rev.status === "published" ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < rev.rating
                                      ? "fill-amber-500"
                                      : "stroke-muted-foreground/40"
                                  )}
                                />
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-1">
                                {rev.date}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {rev.comment}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-500/15 px-2 py-0.5 rounded-full">
                            Waiting for review
                          </span>
                        )}
                      </div>
                    </div>

                    {rev.status === "pending_review" && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewModalItem(rev);
                          setRatingInput(5);
                          setCommentInput("");
                        }}
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 self-end sm:self-center cursor-pointer"
                      >
                        Write Review
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Review Input Modal */}
              {reviewModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                      <h3 className="text-sm font-bold text-foreground">
                        Rate & Review Product
                      </h3>
                      <button
                        type="button"
                        onClick={() => setReviewModalItem(null)}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">
                          Select Star Rating
                        </p>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              className="p-1 cursor-pointer"
                            >
                              <Star
                                className={cn(
                                  "h-6 w-6 transition-transform hover:scale-110",
                                  star <= ratingInput
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground/40"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground">
                          Review Comments
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="What did you like about the product? Mention build quality, packaging, and performance..."
                          className="mt-1 w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-2.5 text-xs font-bold cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 9. PAYMENT METHODS TAB ══════════════ */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">
                  Saved Payment Methods (Bangladesh)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Convenient 1-tap checkout with mobile financial services & local cards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-600 bg-pink-500/10 px-2 py-0.5 rounded-md">
                      bKash Wallet
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      Linked
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-foreground">
                    017***-**678
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Used for instant refunds & automatic promo codes
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Standard BD Parcel Option
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Pay upon parcel inspection with courier agent
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 10. NOTIFICATIONS TAB ══════════════ */}
          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5 shadow-xs">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-base font-bold text-foreground">
                  Notification Alerts
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure real-time courier SMS updates and promotional notices.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      SMS Order Tracking Alerts
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Receive courier OTP and dispatch SMS on {user.phone}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Email Invoices & Receipts
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Digital VAT invoices sent directly to {user.email}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Promotions & Flash Sale Alerts
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Exclusive discount codes and weekend flash sale notifications
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPromos}
                    onChange={(e) => setNotifPromos(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
