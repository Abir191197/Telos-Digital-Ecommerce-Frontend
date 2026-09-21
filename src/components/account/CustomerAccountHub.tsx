"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, useWishlistStore, useCartStore } from "@/stores";
import { useMounted } from "@/hooks";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { CustomerSidebar } from "./CustomerSidebar";
import { useGetMyOrdersQuery, useCancelMyOrderMutation } from "@/services/api/orders/orderApi";
import {
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
  vouchers: "Vouchers & Offers | Telos Cart BD",
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
  "vouchers",
  "notifications",
]);

const STORAGE_KEY_REVIEWS = "telos_customer_reviews";
const STORAGE_KEY_RETURNS = "telos_customer_returns";

export function CustomerAccountHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const user = useAuthStore((state) => state.user);
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const { data: myOrdersData, isLoading: isOrdersLoading } = useGetMyOrdersQuery(
    undefined,
    {
      skip: !user,
    }
  );
  const [cancelMyOrderMutation] = useCancelMyOrderMutation();

  const displayOrders = myOrdersData?.data ?? [];

  // Return tickets and Reviews state with persistent fallback
  const [returnTickets, setReturnTickets] = useState<ReturnTicketData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_RETURNS);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.warn("Could not read stored return tickets:", err);
      }
    }
    return [];
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.warn("Could not read stored customer reviews:", err);
      }
    }
    return [];
  });

  // Save return tickets to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_RETURNS, JSON.stringify(returnTickets));
      } catch (err) {
        console.warn("Could not persist return tickets:", err);
      }
    }
  }, [returnTickets]);

  // Save reviews to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
      } catch (err) {
        console.warn("Could not persist reviews:", err);
      }
    }
  }, [reviews]);

  // Derive pending reviews automatically from delivered orders
  useEffect(() => {
    if (!displayOrders || displayOrders.length === 0) return;

    const deliveredOrders = displayOrders.filter((o) => o.status === "delivered");
    if (deliveredOrders.length === 0) return;

    setReviews((prevReviews) => {
      const existingIds = new Set(prevReviews.map((r) => r.productId));
      const newPendingReviews: CustomerReview[] = [];

      for (const order of deliveredOrders) {
        for (const item of order.items) {
          if (item.productId && !existingIds.has(item.productId)) {
            existingIds.add(item.productId);
            newPendingReviews.push({
              id: `pending-${order.orderNumber}-${item.productId}`,
              productId: item.productId,
              productName: item.productName,
              productThumbnail: item.productThumbnail || "/placeholder.png",
              rating: 5,
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : "Recently",
              comment: "",
              verifiedPurchase: true,
              status: "pending_review",
            });
          }
        }
      }

      if (newPendingReviews.length === 0) return prevReviews;
      return [...prevReviews, ...newPendingReviews];
    });
  }, [displayOrders]);

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
    (tab: AccountTabKey, extraParams?: Record<string, string>) => {
      setActiveTabState(tab);
      setMobileSubScreen(true);
      const params = new URLSearchParams({ tab });
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
      }
      router.push(`/account?${params.toString()}`, { scroll: false });
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

  useEffect(() => {
    if (mounted && user?.role === "admin") {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="container py-12 animate-pulse space-y-6">
        <div className="h-32 rounded-3xl bg-muted/60" />
        <div className="h-64 rounded-3xl bg-muted/40" />
      </div>
    );
  }

  // Fallback when admin visits customer account
  if (user?.role === "admin") {
    return null;
  }

  // Fallback when unauthenticated
  if (!user) {
    return <AccountUnauthenticatedState />;
  }

  return (
    <div className="container py-2 sm:py-10 space-y-3 sm:space-y-6 relative">
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
            orders={displayOrders}
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
            orderCount={displayOrders.length}
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
            orders={displayOrders}
            isLoadingOrders={isOrdersLoading}
            wishlistItems={wishlistItems}
            reviews={reviews}
            returnTickets={returnTickets}
            onSelectTab={handleSelectTab}
            onUpdateUser={updateUser}
            onAddAddress={addAddress}
            onUpdateAddress={updateAddress}
            onDeleteAddress={deleteAddress}
            onSetDefaultAddress={setDefaultAddress}
            onCancelOrder={async (orderNumber, reason) => {
              try {
                await cancelMyOrderMutation({ id: orderNumber, reason }).unwrap();
                showToast(`Order #${orderNumber} cancelled successfully.`);
              } catch (err: any) {
                console.error("Cancel order error:", err);
                showToast(err?.data?.message || "Failed to cancel order. Please contact support.");
              }
            }}
            onAddReturnTicket={(ticket) => {
              setReturnTickets((prev) => [ticket, ...prev]);
              showToast(`Return ticket submitted for Order #${ticket.orderNumber}.`);
              handleSelectTab("returns");
            }}
            onAddReview={(newRev) => {
              setReviews((prev) => {
                const filtered = prev.filter((r) => r.productId !== newRev.productId);
                return [
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
                  ...filtered,
                ];
              });
              showToast("Review submitted successfully! Thank you.");
              handleSelectTab("reviews");
            }}
            onUpdateReview={(updated) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
              );
              showToast("Review published successfully.");
            }}
            onAddToCart={(product, quantity) => addToCart(product, quantity)}
            onRemoveWishlistItem={(productId) => removeWishlistItem(productId)}
          />
        </main>
      </div>

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-950 text-xs font-bold shadow-2xl border border-white/10 dark:border-zinc-800 animate-in slide-in-from-bottom-5 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
