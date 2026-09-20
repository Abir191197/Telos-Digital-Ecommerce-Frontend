import React from "react";
import type { CustomerUser } from "@/stores/auth.store";
import type { Order, Address } from "@/types/order.types";
import type { Product } from "@/types/ecommerce.types";
import {
  AccountTabKey,
  CustomerReview,
} from "../accountNavData";
import type { ReturnTicketData } from "../ReturnRequestModal";
import {
  OverviewTab,
  AccountOverviewSkeleton,
  ProfileTab,
  ProfileTabSkeleton,
  AddressesTab,
  OrdersTab,
  OrdersTabSkeleton,
  TrackingTab,
  ReturnsTab,
  WishlistTab,
  WishlistTabSkeleton,
  ReviewsTab,
  ReviewsTabSkeleton,
  PaymentsTab,
  PaymentsTabSkeleton,
  NotificationsTab,
} from "../tabs";

interface AccountTabContentProps {
  activeTab: AccountTabKey;
  user: CustomerUser;
  orders: Order[];
  isLoadingOrders?: boolean;
  wishlistItems: Product[];
  reviews: CustomerReview[];
  returnTickets: ReturnTicketData[];
  onSelectTab: (tab: AccountTabKey) => void;
  onUpdateUser: (data: Partial<CustomerUser>) => void;
  onAddAddress: (address: Omit<Address, "id">) => void;
  onUpdateAddress: (id: string, data: Partial<Omit<Address, "id">>) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  onCancelOrder: (orderNumber: string, reason?: string) => void;
  onAddReturnTicket: (ticket: ReturnTicketData) => void;
  onAddReview: (review: {
    productId: string;
    productName: string;
    productThumbnail: string;
    rating: number;
    comment: string;
  }) => void;
  onUpdateReview: (review: CustomerReview) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onRemoveWishlistItem: (productId: string) => void;
}

export function AccountTabContent({
  activeTab,
  user,
  orders,
  isLoadingOrders = false,
  wishlistItems,
  reviews,
  returnTickets,
  onSelectTab,
  onUpdateUser,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onCancelOrder,
  onAddReturnTicket,
  onAddReview,
  onUpdateReview,
  onAddToCart,
  onRemoveWishlistItem,
}: AccountTabContentProps) {
  switch (activeTab) {
    case "overview":
      if (isLoadingOrders) {
        return <AccountOverviewSkeleton />;
      }
      return (
        <OverviewTab
          user={user}
          orders={orders}
          isLoadingOrders={isLoadingOrders}
          onSelectTab={onSelectTab}
        />
      );

    case "profile":
      if (isLoadingOrders) {
        return <ProfileTabSkeleton />;
      }
      return (
        <ProfileTab
          user={user}
          orders={orders}
          onUpdateUser={onUpdateUser}
        />
      );

    case "addresses":
      return (
        <AddressesTab
          user={user}
          addAddress={onAddAddress}
          updateAddress={onUpdateAddress}
          deleteAddress={onDeleteAddress}
          setDefaultAddress={onSetDefaultAddress}
        />
      );

    case "orders":
      if (isLoadingOrders) {
        return <OrdersTabSkeleton />;
      }
      return (
        <OrdersTab
          orders={orders}
          onCancelOrder={onCancelOrder}
          onSubmitReturnTicket={onAddReturnTicket}
          onSelectTab={onSelectTab}
          onReviewSubmitted={onAddReview}
        />
      );

    case "tracking":
      return <TrackingTab orders={orders} />;

    case "returns":
      return (
        <ReturnsTab
          returnTickets={returnTickets}
          onSelectTab={onSelectTab}
        />
      );

    case "wishlist":
      if (isLoadingOrders) {
        return <WishlistTabSkeleton />;
      }
      return (
        <WishlistTab
          wishlistItems={wishlistItems}
          onAddToCart={onAddToCart}
          onRemoveWishlistItem={onRemoveWishlistItem}
        />
      );

    case "reviews":
      if (isLoadingOrders) {
        return <ReviewsTabSkeleton />;
      }
      return (
        <ReviewsTab
          reviews={reviews}
          onReviewUpdate={onUpdateReview}
        />
      );

    case "payments":
      if (isLoadingOrders) {
        return <PaymentsTabSkeleton />;
      }
      return <PaymentsTab />;

    case "notifications":
      return <NotificationsTab user={user} />;

    default:
      return null;
  }
}
