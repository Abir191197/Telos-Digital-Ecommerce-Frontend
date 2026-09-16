"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { CustomerSidebar } from "./CustomerSidebar";
import {
  INITIAL_REVIEWS,
  type AccountTabKey,
  type CustomerReview,
} from "./accountNavData";
import type { ReturnTicketData } from "./ReturnRequestModal";
import {
  AccountUnauthenticatedState,
  AccountMobileMenu,
  AccountMobileStickyHeader,
  AccountTabContent,
} from "./hub";

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
  const initialTab: AccountTabKey = hasTabParam
    ? (tabParam as AccountTabKey)
    : "overview";

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
    [router],
  );

  const handleBackToMobileMenu = useCallback(() => {
    setMobileSubScreen(false);
    router.push("/account", { scroll: false });
  }, [router]);

  // Dynamic browser title
  useEffect(() => {
    if (mounted) {
      document.title =
        TAB_TITLES[activeTab] || "Customer Account | Telos Cart BD";
    }
  }, [activeTab, mounted]);

  const logout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "authRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
  };

  const pendingReviewCount = reviews.filter(
    (r) => r.status === "pending_review",
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
    return <AccountUnauthenticatedState />;
  }

  return (
    <div className="container py-2 sm:py-10 space-y-3 sm:space-y-6">
      {/* ── Mobile Account View ── */}
      <div className="lg:hidden space-y-3">
        {mobileSubScreen ? (
          <AccountMobileStickyHeader
            title={TAB_TITLES[activeTab]?.split("|")[0]?.trim() || "Account"}
            onBack={handleBackToMobileMenu}
          />
        ) : (
          <AccountMobileMenu
            user={user}
            orders={orders}
            wishlistCount={wishlistItems.length}
            pendingReviewCount={pendingReviewCount}
            onSelectTab={handleSelectTab}
            onLogout={logout}
          />
        )}
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
        {/* Desktop Customer Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-28 lg:self-start lg:w-72 shrink-0">
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
            !mobileSubScreen && "hidden lg:block",
          )}
        >
          <AccountTabContent
            activeTab={activeTab}
            user={user}
            orders={orders}
            wishlistItems={wishlistItems}
            reviews={reviews}
            returnTickets={returnTickets}
            onSelectTab={handleSelectTab}
            onUpdateUser={updateUser}
            onAddAddress={addAddress}
            onUpdateAddress={updateAddress}
            onDeleteAddress={deleteAddress}
            onSetDefaultAddress={setDefaultAddress}
            onCancelOrder={(orderNumber, reason) =>
              cancelOrder(orderNumber, reason)
            }
            onAddReturnTicket={(ticket) => {
              setReturnTickets((prev) => [ticket, ...prev]);
              handleSelectTab("returns");
            }}
            onAddReview={(newRev) => {
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
            onUpdateReview={(updated) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
              );
            }}
            onAddToCart={(product, quantity) => addToCart(product, quantity)}
            onRemoveWishlistItem={(productId) => removeWishlistItem(productId)}
          />
        </main>
      </div>
    </div>
  );
}
