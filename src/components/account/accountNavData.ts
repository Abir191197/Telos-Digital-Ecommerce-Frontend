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
    group: "Manage My Account",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "profile", label: "My Profile", icon: User },
      { id: "addresses", label: "Address Book", icon: MapPin },
    ],
  },
  {
    group: "Orders & Purchases",
    items: [
      { id: "orders", label: "My Orders", icon: Package },
      { id: "tracking", label: "Order Tracking", icon: Truck },
      { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
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
    group: "Preferences",
    items: [
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

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    productId: "prod-0001",
    productName: "Apple iPhone 16 Pro Max 256GB",
    productThumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    date: "Sep 06, 2026",
    comment:
      "Original BTRC approved set. Delivery inside Dhaka took less than 24 hours with Steadfast. Camera and battery backup outstanding!",
    verifiedPurchase: true,
    status: "published",
  },
  {
    id: "rev-2",
    productId: "prod-0004",
    productName: "Sony WH-1000XM5 Wireless Headphones",
    productThumbnail:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    rating: 0,
    date: "Sep 08, 2026",
    comment: "",
    verifiedPurchase: true,
    status: "pending_review",
  },
];
