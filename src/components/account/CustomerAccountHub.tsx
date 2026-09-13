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
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";
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
  Download,
  LayoutGrid,
  LayoutList,
  ShoppingBag,
  Eye,
  MessageSquarePlus,
  History,
  ThumbsUp,
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
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const [wishlistViewMode, setWishlistViewMode] = useState<"list" | "grid">("list");
  const [reviewTabState, setReviewTabState] = useState<"to_review" | "history">("to_review");

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


      {/* ── Mobile Account View (Appears on click of Account nav item, no menu toggle needed) ── */}
      <div className="lg:hidden space-y-4">
        {/* If user clicked any tab item on mobile, render back bar as fixed top nav under the 36px (h-9) black bar */}
        {mobileSubScreen ? (
          <>
            {/* Fixed Sticky Nav Bar below the 36px black top bar */}
            <div className="fixed top-9 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs">
              <div className="container flex h-12 items-center justify-between px-4">
                <button
                  type="button"
                  onClick={handleBackToMobileMenu}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 cursor-pointer active:scale-95 transition-transform"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>Back to Account Menu</span>
                </button>
                <span className="text-xs font-bold text-foreground">
                  {TAB_TITLES[activeTab]?.split("|")[0]?.trim() || "Account"}
                </span>
              </div>
            </div>
            {/* Spacer for the fixed top nav */}
            <div className="h-12 w-full" aria-hidden="true" />
          </>
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
              {/* Profile Details Hero Card on Overview: shown on all screens, Edit Profile button included, Sign Out excluded */}
              <div className="order-1 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-muted/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-amber-500/30 transition-all">
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
                      <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
                        {user.name}
                      </h2>
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

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectTab("profile")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                    <span>Edit Profile</span>
                  </button>
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
              <div className="flex items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Address Book
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manage delivery destinations and primary shipping for Bangladesh.
                  </p>
                </div>
                {/* Desktop Add Button: stays in header */}
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
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

              {/* Mobile Add Button: Placed as last item after address cards */}
              <div className="block sm:hidden pt-2">
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white py-3.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer touch-manipulation"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add / Edit Address Drawer or Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                  <div
                    className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] overflow-hidden border-t sm:border border-border/70 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95"
                    role="dialog"
                    aria-modal="true"
                  >
                    {/* Fixed Header */}
                    <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 shrink-0 bg-card">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                            {editingAddressId ? "Edit Delivery Location" : "Add New Delivery Location"}
                          </h3>
                          <p className="text-[11px] text-muted-foreground truncate">
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
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                        aria-label="Close modal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Scrollable Form */}
                    <form
                      onSubmit={handleAddressFormSubmit}
                      className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs overscroll-contain"
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
                                "py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation",
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                          className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3.5 font-semibold font-mono text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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
                            className="h-11 sm:h-10 w-full rounded-xl bg-muted/40 px-3 font-semibold text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs transition-all"
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

                      {/* Action buttons pinned at bottom of scrollable form with safe-area spacing */}
                      <div className="flex items-center gap-2.5 pt-3 pb-6 sm:pb-1 border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAddressModal(false);
                            setEditingAddressId(null);
                          }}
                          className="flex-1 rounded-xl bg-muted/60 hover:bg-muted text-foreground py-3 font-bold transition-all cursor-pointer active:scale-98"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 font-bold shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
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
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
                  <div
                    className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
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
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
                  <div
                    className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
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
            <div className="space-y-4 sm:space-y-6">
              {/* Header & Filter Controls: Clean & Minimal Segmented Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Order History
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Track shipments, invoices, and post-delivery guarantees.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
                  {(
                    [
                      { key: "all", label: "All" },
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
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0",
                        orderFilter === tab.key
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
                    <Package className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">No orders found</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    There are no orders in this category yet. Browse our catalog to place your first order.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-4 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Order Header: Order Number, Date, Status, Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-sm sm:text-base font-black tracking-tight text-foreground font-mono">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                          <div className="text-left sm:text-right">
                            <span className="text-[11px] text-muted-foreground block">Order Total</span>
                            <span className="text-sm sm:text-base font-black text-foreground">
                              ৳{order.total.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-muted/60 dark:bg-muted text-foreground">
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-border/30">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs">
                              <Image
                                src={item.productThumbnail}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 leading-snug">
                                {item.productName}
                              </p>
                              {item.variantName && (
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  Variant: {item.variantName}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Qty: <strong className="text-foreground font-semibold">{item.quantity}</strong> × ৳{item.unitPrice.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-foreground shrink-0 text-right">
                              ৳{item.subtotal.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Courier & Delivery Status Line */}
                      <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                          <span className="truncate">
                            Courier: <strong className="text-foreground font-semibold">{order.courierName}</strong>
                            <span className="mx-1.5 text-border">•</span>
                            <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-[11px]">
                              {order.trackingNumber}
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Estimated: {order.estimatedDelivery}
                        </span>
                      </div>

                      {/* Action Buttons: Touch-friendly on mobile, right-aligned on desktop */}
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                        {/* Download invoice button */}
                        <button
                          type="button"
                          onClick={() => setInvoiceModalOrder(order)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Invoice</span>
                        </button>

                        {/* Cancel order if pending or processing */}
                        {(order.status === "pending" || order.status === "processing") && (
                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                          >
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* 7-Day Return / Replacement if delivered */}
                        {order.status === "delivered" && (
                          <button
                            type="button"
                            onClick={() => setReturnModalOrder(order)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Return</span>
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
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex-1 sm:flex-initial"
                          >
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>Write Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 5. LIVE TRACKING TAB ══════════════ */}
          {activeTab === "tracking" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Live Courier Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Real-time parcel dispatch radar across Bangladesh (Pathao & Steadfast logistics).
                  </p>
                </div>

                {/* Switch order pills if multiple orders exist */}
                {orders.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
                    {orders.map((o) => {
                      const isSelected = (selectedTrackingId ? selectedTrackingId === o.id : orders[0]?.id === o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setSelectedTrackingId(o.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0",
                            isSelected
                              ? "bg-amber-500 text-white shadow-2xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          #{o.orderNumber}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Selected Order Timeline */}
              {(() => {
                const currentOrder =
                  orders.find((o) => o.id === selectedTrackingId) || orders[0];

                if (!currentOrder) {
                  return (
                    <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
                        <Truck className="h-6 w-6 stroke-[1.8]" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">No active orders to track</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Once you place an order, live shipping status and courier rider milestones will appear here.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <OrderTrackingTimeline order={currentOrder} />
                  </div>
                );
              })()}
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
            <div className="space-y-4 sm:space-y-6">
              {/* Header Bar: Title, Count, View Mode Toggle (List default vs Grid), and Full View link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Saved Wishlist
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                      {wishlistItems.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Items you saved for later purchase with live stock & price updates.
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5">
                  {/* View Mode Toggle Switch (Default: List) */}
                  <div className="flex items-center bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setWishlistViewMode("list")}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        wishlistViewMode === "list"
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      aria-label="List view"
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                      <span>List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWishlistViewMode("grid")}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        wishlistViewMode === "grid"
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      <span>Grid</span>
                    </button>
                  </div>

                  <Link
                    href={ROUTES.WISHLIST}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline px-2.5 py-1.5 rounded-xl hover:bg-amber-500/10 transition-colors"
                  >
                    <span>Full Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
                    <Heart className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Your Wishlist is Empty</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Explore our collection and tap the heart icon on any product to save it here for later.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={ROUTES.PRODUCTS}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <span>Explore Products</span>
                    </Link>
                  </div>
                </div>
              ) : wishlistViewMode === "list" ? (
                /* ── 1. DEFAULT LIST VIEW ── */
                <div className="space-y-3">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    >
                      {/* Product Thumbnail & Core Info */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs group cursor-pointer"
                        >
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        <div className="min-w-0 flex-1 space-y-1">
                          <Link
                            href={`/products/${item.slug || item.id}`}
                            className="text-xs sm:text-sm font-bold text-foreground hover:text-amber-600 dark:hover:text-amber-400 line-clamp-1 sm:line-clamp-2 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {item.categoryName || "Electronics"}
                          </p>
                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                              ৳{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-muted-foreground line-through font-mono">
                                ৳{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & Remove */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <button
                          type="button"
                          onClick={() => addToCart(item, 1)}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeWishlistItem(item.id)}
                          aria-label="Remove item from wishlist"
                          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer active:scale-95"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── 2. GRID VIEW ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-4 space-y-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/30 block group cursor-pointer shadow-2xs"
                        >
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeWishlistItem(item.id);
                            }}
                            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-xs cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </Link>

                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            {item.categoryName || "Telos Cart"}
                          </p>
                          <Link
                            href={`/products/${item.slug || item.id}`}
                            className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block mt-0.5"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                              ৳{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-muted-foreground line-through font-mono">
                                ৳{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => addToCart(item, 1)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-all cursor-pointer active:scale-95"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ 8. REVIEWS & RATINGS TAB ══════════════ */}
          {activeTab === "reviews" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Bar with 2-State Segmented Control: "To Review" & "History" */}
              <div className="flex flex-col items-start gap-3.5 bg-muted/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
                <div className="hidden sm:block">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Reviews & Ratings
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Share feedback on your verified purchases and view past reviews.
                  </p>
                </div>

                {/* 2 States Toggle: "To Review" and "History" - Left Aligned */}
                <div className="flex items-center bg-background/80 dark:bg-muted/60 p-1 rounded-2xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setReviewTabState("to_review")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                      reviewTabState === "to_review"
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" />
                    <span>To Review</span>
                    {pendingReviewCount > 0 && (
                      <span
                        className={cn(
                          "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black",
                          reviewTabState === "to_review"
                            ? "bg-white text-amber-600"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {pendingReviewCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewTabState("history")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                      reviewTabState === "history"
                        ? "bg-amber-500 text-white shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>History</span>
                    <span
                      className={cn(
                        "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black",
                        reviewTabState === "history"
                          ? "bg-white text-amber-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {reviews.filter((r) => r.status === "published").length}
                    </span>
                  </button>
                </div>
              </div>

              {/* ── STATE 1: TO REVIEW (Pending Reviews) ── */}
              {reviewTabState === "to_review" && (
                <div>
                  {reviews.filter((r) => r.status === "pending_review").length === 0 ? (
                    <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto">
                        <CheckCircle2 className="h-6 w-6 stroke-[1.8]" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">All caught up!</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        You have reviewed all your delivered purchases. Check back after your next order arrives.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews
                        .filter((r) => r.status === "pending_review")
                        .map((rev) => (
                          <div
                            key={rev.id}
                            className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <div className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-2xl overflow-hidden bg-muted/40 shadow-2xs">
                                <Image
                                  src={rev.productThumbnail}
                                  alt={rev.productName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    <span>Verified Purchase</span>
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    Purchased {rev.date}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 sm:line-clamp-2">
                                  {rev.productName}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Help other shoppers make smart choices by rating this item.
                                </p>
                              </div>
                            </div>

                            <div className="self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewModalItem(rev);
                                  setRatingInput(5);
                                  setCommentInput("");
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                              >
                                <Star className="h-4 w-4 fill-current" />
                                <span>Write Review</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── STATE 2: HISTORY (Published Reviews) ── */}
              {reviewTabState === "history" && (
                <div>
                  {reviews.filter((r) => r.status === "published").length === 0 ? (
                    <div className="py-16 px-6 text-center rounded-2xl sm:rounded-3xl bg-card/60 dark:bg-muted/20 space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
                        <History className="h-6 w-6 stroke-[1.8]" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">No review history</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Your published feedback and seller responses will be recorded here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {reviews
                        .filter((r) => r.status === "published")
                        .map((rev) => (
                          <div
                            key={rev.id}
                            className="rounded-2xl sm:rounded-3xl bg-card/90 dark:bg-muted/30 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                          >
                            {/* Product Header Row */}
                            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-muted/40 shadow-2xs">
                                  <Image
                                    src={rev.productThumbnail}
                                    alt={rev.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                                    {rev.productName}
                                  </h4>
                                  <span className="text-[11px] text-muted-foreground font-mono">
                                    Reviewed on {rev.date}
                                  </span>
                                </div>
                              </div>

                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Published</span>
                              </span>
                            </div>

                            {/* Rating Stars & Comment Body */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-3.5 w-3.5",
                                        i < rev.rating
                                          ? "fill-amber-500 text-amber-500"
                                          : "text-muted-foreground/30"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-foreground">
                                  {rev.rating}.0 / 5.0
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-xl">
                                {rev.comment || "Great quality product, completely satisfied with fast BD delivery."}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Review Input Modal (Optimized for Mobile Bottom Sheet + Desktop Dialog) */}
              {reviewModalItem && (
                <div className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                  <div
                    className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 border-t sm:border border-border/70 overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                  >
                    {/* Fixed Modal Header */}
                    <div className="flex items-center justify-between border-b border-border/60 p-4 sm:p-5 shrink-0 bg-card">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            Rate & Review Product
                          </h3>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-[240px]">
                            {reviewModalItem.productName}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReviewModalItem(null)}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                        aria-label="Close modal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Scrollable Form Content */}
                    <form
                      onSubmit={handleSubmitReview}
                      className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs overscroll-contain"
                    >
                      {/* Rating selection with touch-friendly 44px buttons */}
                      <div className="bg-muted/30 p-4 rounded-2xl text-center space-y-2">
                        <p className="text-xs font-bold text-foreground">
                          How would you rate this item?
                        </p>
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              className="h-11 w-11 flex items-center justify-center cursor-pointer transition-transform active:scale-125 hover:scale-110 touch-manipulation"
                              aria-label={`${star} star rating`}
                            >
                              <Star
                                className={cn(
                                  "h-7 w-7 transition-colors",
                                  star <= ratingInput
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                          {ratingInput === 5
                            ? "Excellent (5 Stars)"
                            : ratingInput === 4
                            ? "Very Good (4 Stars)"
                            : ratingInput === 3
                            ? "Average (3 Stars)"
                            : ratingInput === 2
                            ? "Poor (2 Stars)"
                            : "Terrible (1 Star)"}
                        </span>
                      </div>

                      <div>
                        <label className="font-bold text-foreground block mb-1.5">
                          Your Review
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Tell other shoppers about authenticity, build quality, packing, and courier delivery..."
                          className="w-full rounded-2xl bg-muted/40 p-3.5 font-medium text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm leading-relaxed transition-all resize-none"
                        />
                      </div>

                      {/* Sticky/Bottom-docked Action Buttons with Safe-area clearance */}
                      <div className="pt-2 pb-6 sm:pb-1 flex items-center gap-2.5 border-t border-border/40">
                        <button
                          type="button"
                          onClick={() => setReviewModalItem(null)}
                          className="flex-1 rounded-xl bg-muted/70 hover:bg-muted text-foreground py-3 text-xs font-bold transition-all cursor-pointer active:scale-98"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-3 text-xs font-bold shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                        >
                          Publish Review
                        </button>
                      </div>
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
