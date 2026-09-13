"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { CustomerSidebar } from "./CustomerSidebar";
import {
  INITIAL_REVIEWS,
  ACCOUNT_NAV_GROUPS,
  type AccountTabKey,
  type CustomerReview,
} from "./accountNavData";
import type { OrderStatus } from "@/types/order.types";
import type { ReturnTicketData } from "./ReturnRequestModal";
import {
  OverviewTab,
  ProfileTab,
  AddressesTab,
  OrdersTab,
  TrackingTab,
  ReturnsTab,
  WishlistTab,
  ReviewsTab,
  PaymentsTab,
  NotificationsTab,
} from "./tabs";
import {
  User,
  ChevronRight,
  ShieldCheck,
  Edit3,
  LogOut,
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

  // Return tickets and Reviews state
  const [returnTickets, setReturnTickets] = useState<ReturnTicketData[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

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

  const logout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
  };

  const pendingReviewCount = reviews.filter(
    (r) => r.status === "pending_review"
  ).length;

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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-6 py-3 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>Sign In with 1-Tap Demo</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-2 sm:py-10 space-y-3 sm:space-y-6">
      {/* ── Mobile Account View (Appears on click of Account nav item, no menu toggle needed) ── */}
      <div className="lg:hidden space-y-3">
        {/* If user clicked any tab item on mobile, render back bar as fixed top nav under the 36px (h-9) black bar */}
        {mobileSubScreen ? (
          <>
            {/* Fixed Sticky Nav Bar below the 36px black top bar */}
            <div className="fixed top-9 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs">
              <div className="container flex h-11 items-center justify-between px-4">
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
            {/* Minimal Spacer for the fixed top nav */}
            <div className="h-10 w-full" aria-hidden="true" />
          </>
        ) : (
          <div className="space-y-3 pb-8">
            {/* Top User Profile Card */}
            <div className="rounded-3xl border border-border/80 dark:border-white/10 bg-card p-4.5 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.08),0_2px_10px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.65)]">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl border-2 border-amber-500/80 shadow-xs flex items-center justify-center bg-muted/40 overflow-hidden text-foreground">
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
          {activeTab === "overview" && (
            <OverviewTab
              user={user}
              orders={orders}
              onSelectTab={handleSelectTab}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              orders={orders}
              onUpdateUser={updateUser}
            />
          )}

          {activeTab === "addresses" && (
            <AddressesTab
              user={user}
              addAddress={addAddress}
              updateAddress={updateAddress}
              deleteAddress={deleteAddress}
              setDefaultAddress={setDefaultAddress}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              onCancelOrder={(orderNumber, reason) => cancelOrder(orderNumber, reason)}
              onSubmitReturnTicket={(ticket) => {
                setReturnTickets((prev) => [ticket, ...prev]);
                handleSelectTab("returns");
              }}
              onSelectTab={handleSelectTab}
              onReviewSubmitted={(newRev) => {
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
                handleSelectTab("reviews");
              }}
            />
          )}

          {activeTab === "tracking" && (
            <TrackingTab orders={orders} />
          )}

          {activeTab === "returns" && (
            <ReturnsTab
              returnTickets={returnTickets}
              onSelectTab={handleSelectTab}
            />
          )}

          {activeTab === "wishlist" && (
            <WishlistTab
              wishlistItems={wishlistItems}
              onAddToCart={(product, quantity) => addToCart(product, quantity)}
              onRemoveWishlistItem={(productId) => removeWishlistItem(productId)}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsTab
              reviews={reviews}
              onReviewUpdate={(updated) => {
                setReviews((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r))
                );
              }}
            />
          )}

          {activeTab === "payments" && (
            <PaymentsTab />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab user={user} />
          )}
        </main>
      </div>
    </div>
  );
}
