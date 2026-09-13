"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  CustomerSidebar,
} from "./CustomerSidebar";
import { CancelOrderModal } from "./CancelOrderModal";
import { ReturnRequestModal, type ReturnTicketData } from "./ReturnRequestModal";
import { WriteReviewModal } from "./WriteReviewModal";
import { InvoiceModal } from "./InvoiceModal";
import {
  INITIAL_REVIEWS,
  ACCOUNT_NAV_GROUPS,
  type AccountTabKey,
  type CustomerReview,
} from "./accountNavData";
import type { Order, OrderStatus, Address } from "@/types/order.types";
import type { CustomerUser } from "@/stores";
import {
  User,
  ChevronRight,
  CheckCircle2,
  Truck,
  AlertCircle,
  Clock,
  Sparkles,
  Edit3,
  Package,
  MapPin,
  Heart,
  ShieldCheck,
  Check,
  Plus,
  Building,
  Trash2,
  CreditCard,
  RotateCcw,
  Star,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Wallet,
  Megaphone,
  BellRing,
  Bell,
  FileText,
  Camera,
  Lock,
  Mail,
  Phone,
  Save,
  AlertTriangle,
  XCircle,
  Upload,
  ImageIcon,
} from "lucide-react";

const TAB_TITLES: Record<AccountTabKey, string> = {
  overview: "Customer Overview | Telos Cart BD",
  profile: "My Profile | Telos Cart BD",
  addresses: "Address Book | Telos Cart BD",
  orders: "My Orders | Telos Cart BD",
  tracking: "Order Tracking | Telos Cart BD",
  returns: "Returns & Refunds | Telos Cart BD",
  wishlist: "Saved Wishlist | Telos Cart BD",
  reviews: "Reviews & Ratings | Telos Cart BD",
  payments: "Payment Methods | Telos Cart BD",
  notifications: "Notification Preferences | Telos Cart BD",
};

const VALID_TABS = new Set<AccountTabKey>([
  "overview",
  "profile",
  "addresses",
  "orders",
  "tracking",
  "returns",
  "wishlist",
  "reviews",
  "payments",
  "notifications",
]);

export function CustomerAccountHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const user = useAuthStore((state) => state.user);
  const orders = useAuthStore((state) => state.orders);
  const cancelOrder = useAuthStore((state) => state.cancelOrder);
  const updateUser = useAuthStore((state) => state.updateUser);
  const storeLogout = useAuthStore((state) => state.logout);
  const addAddress = useAuthStore((state) => state.addAddress);
  const updateAddress = useAuthStore((state) => state.updateAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);

  const wishlistItems = useWishlistStore((state) => state.items);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  const tabParam = searchParams.get("tab") as AccountTabKey | null;
  const hasTabParam = Boolean(tabParam && VALID_TABS.has(tabParam));
  const initialTab: AccountTabKey = hasTabParam ? (tabParam as AccountTabKey) : "overview";

  const [activeTab, setActiveTabState] = useState<AccountTabKey>(initialTab);
  const [mobileSubScreen, setMobileSubScreen] = useState<boolean>(hasTabParam);

  // Sync state whenever URL query params change (Next.js router or browser back/forward)
  useEffect(() => {
    const currentTab = searchParams.get("tab") as AccountTabKey | null;
    if (currentTab && VALID_TABS.has(currentTab)) {
      setActiveTabState(currentTab);
      setMobileSubScreen(true);
    } else {
      setActiveTabState("overview");
      setMobileSubScreen(false);
    }
  }, [searchParams]);

  // Listen directly to browser/mobile hardware back button (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const currentTab = params.get("tab") as AccountTabKey | null;
      if (currentTab && VALID_TABS.has(currentTab)) {
        setActiveTabState(currentTab);
        setMobileSubScreen(true);
      } else {
        setActiveTabState("overview");
        setMobileSubScreen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL using router.push for Next.js router & browser history stack integration
  const handleSelectTab = useCallback(
    (tab: AccountTabKey) => {
      setActiveTabState(tab);
      setMobileSubScreen(true);
      router.push(`/account?tab=${tab}`, { scroll: false });
    },
    [router]
  );

  const handleBackToMobileMenu = useCallback(() => {
    setMobileSubScreen(false);
    router.push("/account", { scroll: false });
  }, [router]);

  // Dynamic browser title
  useEffect(() => {
    if (mounted) {
      document.title = TAB_TITLES[activeTab] || "Customer Account | Telos Cart BD";
    }
  }, [activeTab, mounted]);
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");

  // Modal states for customer actions
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [reviewWriteItem, setReviewWriteItem] = useState<{
    productId: string;
    productName: string;
    productThumbnail: string;
  } | null>(null);

  // Return tickets local state
  const [returnTickets, setReturnTickets] = useState<ReturnTicketData[]>([]);

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [reviewModalItem, setReviewModalItem] = useState<CustomerReview | null>(
    null
  );
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileConfirmModal, setShowProfileConfirmModal] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || "");
  const [profileSaved, setProfileSaved] = useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync profile local inputs if user changes
  useEffect(() => {
    if (user && !isEditingProfile) {
      setProfileName(user.name);
      setProfilePhone(user.phone || "");
      setProfileAvatar(user.avatar || "");
    }
  }, [user, isEditingProfile]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setProfileAvatar(event.target.result);
        setIsEditingProfile(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Address modal state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressToConfirmSave, setAddressToConfirmSave] = useState<{
    id?: string;
    data: Omit<Address, "id">;
  } | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
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

  const handleProfileFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setShowProfileConfirmModal(true);
  };

  const handleConfirmProfileSave = () => {
    updateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar,
    });
    setShowProfileConfirmModal(false);
    setIsEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleCancelProfileEdit = () => {
    setProfileName(user?.name || "");
    setProfilePhone(user?.phone || "");
    setProfileAvatar(user?.avatar || "");
    setIsEditingProfile(false);
    setShowProfileConfirmModal(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setNewAddr({
      name: user.name,
      phone: user.phone || "+880 1712-345678",
      street: "",
      area: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: user.addresses.length === 0,
      label: "Home",
    });
    setShowAddAddressModal(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setNewAddr({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      zone: addr.zone,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
      label: addr.label,
    });
    setShowAddAddressModal(true);
  };

  const handleAddressFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.area || !newAddr.name) return;
    setAddressToConfirmSave({
      id: editingAddressId || undefined,
      data: { ...newAddr },
    });
  };

  const handleConfirmSaveAddress = () => {
    if (!addressToConfirmSave) return;
    if (addressToConfirmSave.id) {
      updateAddress(addressToConfirmSave.id, addressToConfirmSave.data);
    } else {
      addAddress(addressToConfirmSave.data);
    }
    setAddressToConfirmSave(null);
    setShowAddAddressModal(false);
    setEditingAddressId(null);
    setNewAddr({
      name: user.name,
      phone: user.phone || "+880 1712-345678",
      street: "",
      area: "",
      city: "Dhaka",
      zone: "inside-dhaka",
      postalCode: "",
      isDefault: false,
      label: "Home",
    });
  };

  const handleConfirmDeleteAddress = () => {
    if (!addressToDelete) return;
    deleteAddress(addressToDelete.id);
    setAddressToDelete(null);
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
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/15 border border-zinc-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-foreground uppercase">
            <CheckCircle2 className="h-3 w-3 text-amber-500" />
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
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700 dark:text-rose-400 uppercase">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-700 dark:text-purple-400 uppercase">
            <Clock className="h-3 w-3" />
            Pending Verification
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
    <div className="container py-6 sm:py-10 space-y-6">
      {/* ── Thematic Customer Header Bar (Desktop only; on mobile, the account screen itself is shown directly) ── */}
      <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-muted/30 p-5 sm:p-7 shadow-xs">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-sm bg-muted/40">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-black text-xl text-amber-600 bg-amber-500/10">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-foreground tracking-tight truncate">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Telos Gold Member</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectTab("profile")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-foreground px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-amber-500" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Account View (Appears on click of Account nav item, no menu toggle needed) ── */}
      <div className="lg:hidden space-y-4">
        {/* If user clicked any tab item on mobile, render back bar to return to Account Menu */}
        {mobileSubScreen ? (
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-card shadow-2xs">
            <button
              type="button"
              onClick={handleBackToMobileMenu}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>Back to Account Menu</span>
            </button>
            <span className="text-xs font-bold text-foreground">
              {TAB_TITLES[activeTab]?.split("|")[0]?.trim() || "Account"}
            </span>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {/* Top User Profile Card (Matching image structure: avatar circle, name, phone, verified badge, BN toggle) */}
            <div className="rounded-2xl border border-border/80 bg-card p-4.5 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-border/90 flex items-center justify-center bg-muted/40 overflow-hidden text-foreground">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9 stroke-[1.5] text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground truncate">
                      {user.name}
                    </h2>
                    <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {user.phone}
                  </p>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1 font-medium">
                      {user.email}
                    </p>

                    {/* Edit Profile Action Icon Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectTab("profile")}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/80 bg-muted/50 hover:bg-amber-500/10 hover:border-amber-500/40 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 cursor-pointer shadow-2xs"
                      aria-label="Edit Profile"
                      title="Edit Profile"
                    >
                      <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation List - 100% Synced to Desktop ACCOUNT_NAV_GROUPS */}
            <div className="space-y-4">
              {ACCOUNT_NAV_GROUPS.map((group) => (
                <div key={group.group} className="space-y-2">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.group}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      // Dynamic badges synced to sidebar logic
                      let badgeContent: React.ReactNode = null;
                      if (item.id === "orders" && orders.length > 0) {
                        badgeContent = (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                            {orders.length}
                          </span>
                        );
                      } else if (item.id === "tracking") {
                        badgeContent = (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                            Live Courier
                          </span>
                        );
                      } else if (item.id === "wishlist" && wishlistItems.length > 0) {
                        badgeContent = (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                            {wishlistItems.length}
                          </span>
                        );
                      } else if (item.id === "reviews" && pendingReviewCount > 0) {
                        badgeContent = (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                            {pendingReviewCount} new
                          </span>
                        );
                      } else if (item.id === "addresses") {
                        badgeContent = (
                          <span className="text-xs text-muted-foreground font-medium">
                            {user.addresses.length} saved
                          </span>
                        );
                      } else if (item.id === "payments") {
                        badgeContent = (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            ৳ 70
                          </span>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 transition-colors cursor-pointer shadow-2xs text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                            <span className="text-sm font-semibold text-foreground">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {badgeContent}
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Sign Out Card */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 stroke-[1.8] group-hover:scale-105 transition-transform" />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
        {/* Desktop Customer Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block">
          <CustomerSidebar
            user={user}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            orderCount={orders.length}
            wishlistCount={wishlistItems.length}
            pendingReviewCount={pendingReviewCount}
            onLogout={logout}
          />
        </div>

        {/* Right Dynamic Content Pane */}
        <main
          className={cn(
            "flex-1 w-full min-w-0",
            !mobileSubScreen && "hidden lg:block"
          )}
        >
          {/* ══════════════ 1. OVERVIEW TAB (Standard Ecommerce Hub) ══════════════ */}
          {activeTab === "overview" && (
            <div className="flex flex-col space-y-6">
              {/* Profile Details Card on Mobile: order-1 on mobile, lg:hidden */}
              <div className="order-1 lg:hidden rounded-3xl border border-border/80 bg-card p-5 flex flex-col justify-between shadow-xs hover:border-amber-500/30 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Profile Details
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("profile")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 rounded-2xl border-2 border-amber-500/50 overflow-hidden bg-muted/40 flex items-center justify-center font-bold text-amber-600 text-lg shadow-xs">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {user.name}
                        </h4>
                        <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    Verified Shopper
                  </span>
                </div>
              </div>

              {/* Top Hero Card: Latest Active Order with Real-Time Progress Stepper (Full Width Anchor) */}
              {orders[0] && (
                <div className="order-2 lg:order-1 rounded-3xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs hover:border-amber-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Package className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">
                            Latest Order: #{orders[0].orderNumber}
                          </h3>
                          <span className="hidden sm:inline-block text-xs text-muted-foreground">
                            • {new Date(orders[0].createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {orders[0].items.length} item{orders[0].items.length > 1 ? "s" : ""} • Total: <strong className="text-foreground font-semibold">৳{orders[0].total.toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      {getStatusBadge(orders[0].status)}
                      <button
                        type="button"
                        onClick={() => handleSelectTab("tracking")}
                        className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>

                  {/* Stepper Progress */}
                  <div className="py-2 px-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pb-2">
                      <span className="text-amber-600 dark:text-amber-400">Order Placed</span>
                      <span
                        className={
                          orders[0].status !== "pending" ? "text-amber-600 dark:text-amber-400" : ""
                        }
                      >
                        Processing
                      </span>
                      <span
                        className={
                          orders[0].status === "shipped" ||
                          orders[0].status === "delivered"
                            ? "text-amber-600 dark:text-amber-400"
                            : ""
                        }
                      >
                        In Transit
                      </span>
                      <span
                        className={
                          orders[0].status === "delivered"
                            ? "text-amber-600 dark:text-amber-400"
                            : ""
                        }
                      >
                        Delivered
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 rounded-full"
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Delivery Partner:</span>
                      <strong className="text-foreground font-semibold">
                        {orders[0].courierName}
                      </strong>
                      <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-md text-[11px] text-foreground">
                        {orders[0].trackingNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("orders")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer self-start sm:self-auto"
                    >
                      <span>View All Orders ({orders.length})</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 2-Column Responsive Grid on Large Screen: Primary Delivery Address + Saved Payment Methods */}
              <div className="order-3 lg:order-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Address Book Snapshot */}
                <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-amber-500/30 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Primary Delivery Address
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectTab("addresses")}
                        className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">
                          {user.addresses[0]?.name || user.name}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {user.addresses[0]?.label || "Home"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {user.addresses[0]?.street}, {user.addresses[0]?.area},{" "}
                        {user.addresses[0]?.city} - {user.addresses[0]?.postalCode}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {user.addresses[0]?.phone || user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Courier Delivery Time</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-muted/70 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                      {user.addresses[0]?.zone === "inside-dhaka"
                        ? "Inside Dhaka • 24 Hours"
                        : "Outside Dhaka • 48 Hours"}
                    </span>
                  </div>
                </div>

                {/* 2. Saved Payment Methods Snapshot */}
                <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-amber-500/30 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Saved Payment Methods
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectTab("payments")}
                        className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Settings
                      </button>
                    </div>

                    <div className="space-y-2.5 pt-0.5">
                      <div className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-muted/20">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-pink-600 bg-pink-500/10 px-2 py-0.5 rounded-md">
                              bKash Wallet
                            </span>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              Linked
                            </span>
                          </div>
                          <p className="text-xs font-mono font-bold text-foreground truncate">
                            017***-**678
                          </p>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-2xl border border-border/70 bg-muted/20">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                              Cash on Delivery
                            </span>
                            <span className="text-[10px] font-bold text-amber-600">
                              Active
                            </span>
                          </div>
                          <p className="text-xs font-bold text-foreground truncate">
                            Standard BD Parcel Option
                          </p>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Default Checkout</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">1-Tap Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 2. PROFILE TAB ══════════════ */}
          {activeTab === "profile" && (
            <div className="space-y-4 sm:space-y-6 max-w-4xl">
              {/* Header card with quick status & edit toggle */}
              <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-xs relative overflow-hidden">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 border-b border-border/60 pb-5 sm:pb-6">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    {/* Editable Avatar */}
                    <div className="relative group shrink-0">
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        title="Click to upload profile photo"
                        className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-amber-500 overflow-hidden bg-muted/30 flex items-center justify-center font-black text-amber-600 text-xl sm:text-2xl shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        {(isEditingProfile ? profileAvatar : user.avatar) ? (
                          <Image
                            src={(isEditingProfile ? profileAvatar : user.avatar) || ""}
                            alt={profileName || user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          (profileName || user.name).charAt(0)
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Change</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        title="Upload new photo"
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-xs ring-2 ring-background cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      >
                        <Camera className="h-3.5 w-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate max-w-[200px] sm:max-w-none">
                          {isEditingProfile ? (profileName || "Your Name") : user.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold shrink-0">
                          <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span>Telos Member</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                        >
                          Change photo
                        </button>
                      </p>
                    </div>
                  </div>

                  {/* Header Edit Toggle Button (Only when not editing) */}
                  {!isEditingProfile && (
                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile update success banner */}
                {profileSaved && (
                  <div className="mt-4 sm:mt-5 flex items-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/40 p-3 sm:p-3.5 text-xs font-bold text-amber-700 dark:text-amber-400 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Profile information saved successfully!</span>
                  </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleProfileFormSubmit} className="mt-5 sm:mt-6 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                    {/* Full Name Card */}
                    <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3.5 sm:p-4 space-y-2 transition-all">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-amber-500" />
                          <span>Full Name</span>
                        </label>
                        {!isEditingProfile && (
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(true)}
                            className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-md transition-colors"
                            title="Edit full name"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {isEditingProfile ? (
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Enter your full name"
                            className="h-10 sm:h-11 w-full rounded-xl border border-amber-500/80 bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-foreground py-0.5 sm:py-1 truncate">
                          {user.name}
                        </p>
                      )}
                    </div>

                    {/* Phone Number Card */}
                    <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-background/60 p-3.5 sm:p-4 space-y-2 transition-all">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-amber-500" />
                          <span>Phone Number (+880 BD)</span>
                        </label>
                        {!isEditingProfile && (
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(true)}
                            className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-md transition-colors"
                            title="Edit phone number"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {isEditingProfile ? (
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="+880 17XX-XXXXXX"
                            className="h-10 sm:h-11 w-full rounded-xl border border-amber-500/80 bg-background px-3 sm:px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none font-mono"
                          />
                        </div>
                      ) : (
                        <p className="text-sm font-bold font-mono text-foreground py-0.5 sm:py-1 truncate">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Email Address (Immutable Security Card) */}
                    <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-muted/20 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Email Address</span>
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          <Lock className="h-3 w-3" />
                          Secured
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                        Primary account identifier linked to order dispatches and OTP verification.
                      </p>
                    </div>
                  </div>

                  {/* Save action bar when in edit mode */}
                  {isEditingProfile && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-border/60">
                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        className="w-full sm:w-auto rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-95 text-center"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Extra Account Insights / Quick Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Orders
                  </span>
                  <p className="text-lg sm:text-xl font-black text-foreground">
                    {orders.length} Orders
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">Across Bangladesh</p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Delivery Zone
                  </span>
                  <p className="text-lg sm:text-xl font-black text-foreground">Inside Dhaka</p>
                  <p className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    Next-Day RedX
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl sm:rounded-2xl border border-border/80 bg-card p-3 sm:p-4 space-y-1 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Account Security
                  </span>
                  <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Protected</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground">SSL Encrypted 256-bit</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ 3. ADDRESSES TAB ══════════════ */}
          {activeTab === "addresses" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header bar: Responsive stack on mobile, flex on sm */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Address Book
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manage delivery destinations and primary shipping for Bangladesh.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Address Cards Grid: borderless on cards, rich background & shadow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 relative transition-all shadow-sm hover:shadow-md",
                      addr.isDefault
                        ? "bg-amber-500/10 dark:bg-amber-500/15"
                        : "bg-card/90 dark:bg-muted/30"
                    )}
                  >
                    {/* Top Row: Label badge + Default Status / Set Default */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 dark:bg-muted/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground shadow-2xs">
                        <Building className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{addr.label}</span>
                      </span>

                      {addr.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-1 rounded-full">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span>Default Shipping</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer py-1 px-1.5 rounded-md hover:bg-amber-500/10 transition-colors"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    {/* Address details */}
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">
                        {addr.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
                      </p>
                      <p className="text-xs font-semibold font-mono text-foreground pt-0.5">
                        Phone: {addr.phone}
                      </p>
                      <div className="pt-1">
                        <span className="inline-block text-[10px] font-bold text-muted-foreground bg-muted/60 dark:bg-muted px-2 py-0.5 rounded-md">
                          {addr.zone === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Edit and Delete with touch-friendly layout */}
                    <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddress(addr)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-amber-500/15 text-foreground hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
                        aria-label={`Edit address for ${addr.name}`}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAddressToDelete(addr)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
                        aria-label={`Delete address for ${addr.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Address Drawer or Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                  <div
                    className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            {editingAddressId ? "Edit Delivery Location" : "Add New Delivery Location"}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            Destination details for courier deliveries
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddressModal(false);
                          setEditingAddressId(null);
                        }}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Close modal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleAddressFormSubmit}
                      className="space-y-3.5 text-xs"
                    >
                      <div>
                        <label className="font-bold text-foreground block mb-1">
                          Address Type / Label
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["Home", "Office", "Other"] as const).map((labelType) => (
                            <button
                              key={labelType}
                              type="button"
                              onClick={() => setNewAddr({ ...newAddr, label: labelType })}
                              className={cn(
                                "py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5",
                                newAddr.label === labelType
                                  ? "bg-amber-500 text-white shadow-xs"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <Building className="h-3.5 w-3.5" />
                              <span>{labelType}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-foreground block mb-1">
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={newAddr.name}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, name: e.target.value })
                            }
                            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-foreground block mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="+880 1712-345678"
                            value={newAddr.phone}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, phone: e.target.value })
                            }
                            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-foreground block mb-1">
                          Street & Building Address
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. House 14, Road 3, Block D"
                          value={newAddr.street}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, street: e.target.value })
                          }
                          className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-foreground block mb-1">
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
                            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-foreground block mb-1">
                            City / District
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dhaka"
                            value={newAddr.city}
                            onChange={(e) => {
                              const cityVal = e.target.value;
                              const isInside = cityVal.toLowerCase().includes("dhaka");
                              setNewAddr({
                                ...newAddr,
                                city: cityVal,
                                zone: isInside ? "inside-dhaka" : "outside-dhaka",
                              });
                            }}
                            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-foreground block mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1209"
                            value={newAddr.postalCode}
                            onChange={(e) =>
                              setNewAddr({ ...newAddr, postalCode: e.target.value })
                            }
                            className="h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-foreground block mb-1">
                            Courier Zone
                          </label>
                          <select
                            value={newAddr.zone}
                            onChange={(e) =>
                              setNewAddr({
                                ...newAddr,
                                zone: e.target.value as "inside-dhaka" | "outside-dhaka",
                              })
                            }
                            className="h-10 w-full rounded-xl bg-muted/40 px-3 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
                          >
                            <option value="inside-dhaka">Inside Dhaka (৳60)</option>
                            <option value="outside-dhaka">Outside Dhaka (৳120)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefaultAddr"
                          checked={newAddr.isDefault}
                          onChange={(e) =>
                            setNewAddr({ ...newAddr, isDefault: e.target.checked })
                          }
                          className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
                        />
                        <label
                          htmlFor="isDefaultAddr"
                          className="text-xs font-semibold text-foreground cursor-pointer select-none"
                        >
                          Set as primary default delivery destination
                        </label>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAddressModal(false);
                            setEditingAddressId(null);
                          }}
                          className="flex-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground py-2.5 font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-2.5 font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          {editingAddressId ? "Save Changes" : "Add Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ── Save Warning / Confirmation Popup Modal ── */}
              {addressToConfirmSave && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
                  <div
                    className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
                    role="alertdialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {addressToConfirmSave.id ? "Confirm Address Update" : "Confirm New Address"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Verify destination before saving
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddressToConfirmSave(null)}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-2xl bg-muted/40 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                        <span className="text-muted-foreground">Recipient:</span>
                        <strong className="font-bold text-foreground">{addressToConfirmSave.data.name}</strong>
                      </div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                        <span className="text-muted-foreground">Contact Phone:</span>
                        <strong className="font-mono font-bold text-foreground">{addressToConfirmSave.data.phone}</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block">Shipping Destination:</span>
                        <p className="text-foreground font-semibold">
                          {addressToConfirmSave.data.street}, {addressToConfirmSave.data.area},{" "}
                          {addressToConfirmSave.data.city} - {addressToConfirmSave.data.postalCode}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {addressToConfirmSave.id
                        ? "Are you sure you want to update this address? Pending dispatches will use these modified details."
                        : "Are you sure you want to save this new delivery address to your address book?"}
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAddressToConfirmSave(null)}
                        className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmSaveAddress}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" />
                        <span>Confirm & Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Delete Warning / Confirmation Popup Modal ── */}
              {addressToDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
                  <div
                    className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
                    role="alertdialog"
                    aria-modal="true"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
                          <Trash2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            Delete Address?
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            This action cannot be undone
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddressToDelete(null)}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-2xl bg-rose-500/5 p-4 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{addressToDelete.name}</span>
                        <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded-md">
                          {addressToDelete.label}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {addressToDelete.street}, {addressToDelete.area}, {addressToDelete.city}
                      </p>
                      <p className="font-mono text-muted-foreground">
                        {addressToDelete.phone}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Are you sure you want to permanently remove this delivery address from your profile?
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAddressToDelete(null)}
                        className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDeleteAddress}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Address</span>
                      </button>
                    </div>
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

                    {/* Footer & Action Buttons */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-border/50 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {order.estimatedDelivery}
                        </span>
                      </div>

                      {/* Interactive Customer Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/40">
                        {/* Print / Download invoice */}
                        <button
                          type="button"
                          onClick={() => setInvoiceModalOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                        >
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Download Invoice</span>
                        </button>

                        {/* Cancel order if pending or processing */}
                        {(order.status === "pending" || order.status === "processing") && (
                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        )}

                        {/* 7-Day Return / Replacement if delivered */}
                        {order.status === "delivered" && (
                          <button
                            type="button"
                            onClick={() => setReturnModalOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 transition-all cursor-pointer"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Request Return / Exchange</span>
                          </button>
                        )}

                        {/* Write Review if delivered */}
                        {order.status === "delivered" && order.items[0] && (
                          <button
                            type="button"
                            onClick={() =>
                              setReviewWriteItem({
                                productId: order.items[0].productId,
                                productName: order.items[0].productName,
                                productThumbnail: order.items[0].productThumbnail,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>Write Review</span>
                          </button>
                        )}
                      </div>
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
                        <div className="absolute -left-[23px] top-0 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-background" />
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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Returns & Replacements
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    7-day hassle-free replacement warranty for defective electronics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab("orders")}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  Create Return
                </button>
              </div>

              {returnTickets.length === 0 ? (
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    No Active Return Requests
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    To request an exchange or refund, go to "My Orders" tab and select "Request Return / Exchange" on any delivered order.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {returnTickets.map((ticket, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border/80 bg-card p-4.5 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            Ticket #{ticket.orderNumber}-RET{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">
                            Under Review
                          </span>
                        </div>
                        <span className="text-xs font-bold capitalize text-amber-600 dark:text-amber-400">
                          {ticket.resolutionType} Request
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0">
                          <Image
                            src={ticket.productThumbnail}
                            alt={ticket.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-bold text-foreground truncate">
                            {ticket.productName}
                          </p>
                          <p className="text-muted-foreground mt-0.5">
                            Reason: {ticket.reason}
                          </p>
                          {ticket.conditionNotes && (
                            <p className="text-muted-foreground italic mt-0.5">
                              "{ticket.conditionNotes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                        <span>Courier Pickup: Steadfast Courier (Next 24 Hours)</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          QC Agent Assigned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
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

      {/* ── Cancel Order Modal ── */}
      {cancelModalOrder && (
        <CancelOrderModal
          orderNumber={cancelModalOrder.orderNumber}
          isOpen={Boolean(cancelModalOrder)}
          onClose={() => setCancelModalOrder(null)}
          onConfirmCancel={(orderNumber, reason) => {
            cancelOrder(orderNumber, reason);
            setCancelModalOrder(null);
          }}
        />
      )}

      {/* ── Return & Replacement Request Modal ── */}
      {returnModalOrder && (
        <ReturnRequestModal
          order={returnModalOrder}
          isOpen={Boolean(returnModalOrder)}
          onClose={() => setReturnModalOrder(null)}
          onSubmitReturn={(ticket) => {
            setReturnTickets((prev) => [ticket, ...prev]);
            handleSelectTab("returns");
          }}
        />
      )}

      {/* ── Write Review Modal ── */}
      {reviewWriteItem && (
        <WriteReviewModal
          item={reviewWriteItem}
          isOpen={Boolean(reviewWriteItem)}
          onClose={() => setReviewWriteItem(null)}
          onSubmitReview={(newRev) => {
            setReviews((prev) => [
              {
                id: `rev-${Date.now()}`,
                productId: newRev.productId,
                productName: newRev.productName,
                productThumbnail: newRev.productThumbnail,
                rating: newRev.rating,
                date: "Just now",
                comment: newRev.comment,
                verifiedPurchase: true,
                status: "published",
              },
              ...prev,
            ]);
            setReviewWriteItem(null);
            handleSelectTab("reviews");
          }}
        />
      )}

      {/* ── Tax Invoice & Print Modal ── */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          isOpen={Boolean(invoiceModalOrder)}
          onClose={() => setInvoiceModalOrder(null)}
        />
      )}

      {/* ── Profile Changes Save Confirmation Modal Popup ── */}
      {showProfileConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Save className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Confirm Profile Update
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Save contact changes to your account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileConfirmModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                <div className="relative h-12 w-12 shrink-0 rounded-xl border border-amber-500/60 overflow-hidden bg-muted/40 flex items-center justify-center font-bold text-amber-600">
                  {profileAvatar ? (
                    <Image
                      src={profileAvatar}
                      alt={profileName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    profileName.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Profile Avatar
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {profileAvatar !== user.avatar ? "New Photo Selected" : "Unchanged"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Updated Name:</span>
                <span className="font-bold text-foreground">{profileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated Phone:</span>
                <span className="font-bold font-mono text-foreground">{profilePhone || "None"}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              These details will be used for future invoice generations, delivery SMS dispatches, and rider calling.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileConfirmModal(false)}
                className="rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmProfileSave}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Yes, Confirm & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
