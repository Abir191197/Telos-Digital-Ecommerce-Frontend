import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  CreditCard,
  Bell,
  LayoutDashboard,
  Truck,
  RotateCcw,
  Ticket,
} from "lucide-react";

export type AccountTabKey =
  | "overview"
  | "profile"
  | "addresses"
  | "orders"
  | "tracking"
  | "returns"
  | "wishlist"
  | "reviews"
  | "payments"
  | "vouchers"
  | "notifications";

export interface AccountNavItem {
  id: AccountTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface AccountNavGroup {
  group: string;
  items: AccountNavItem[];
}

export const ACCOUNT_NAV_GROUPS: AccountNavGroup[] = [
  {
    group: "Orders & Purchases",
    items: [
      { id: "orders", label: "My Orders", icon: Package },
      { id: "tracking", label: "Order Tracking", icon: Truck },
      { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
    ],
  },
  {
    group: "Account & Addresses",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "profile", label: "My Profile", icon: User },
      { id: "addresses", label: "Address Book", icon: MapPin },
    ],
  },
  {
    group: "My Activity",
    items: [
      { id: "wishlist", label: "My Wishlist", icon: Heart },
      { id: "reviews", label: "Reviews & Ratings", icon: Star },
    ],
  },
  {
    group: "Preferences & Wallet",
    items: [
      { id: "vouchers", label: "Vouchers & Offers", icon: Ticket },
      { id: "payments", label: "Payment Methods", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
];

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  status: "published" | "pending_review";
}

