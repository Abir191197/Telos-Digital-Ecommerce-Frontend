import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  FolderTree,
  Award,
  Boxes,
  CreditCard,
  BarChart3,
  Star,
  History,
  Sliders,
  Settings,
  LucideIcon,
  ShoppingCart,
  Heart,
  Flame,
} from "lucide-react";
import { ROUTES } from "@/constants";

export interface SubNavItem {
  title: string;
  href: string;
  badge?: string | null;
}

export interface NavGroupItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | null;
  children?: SubNavItem[];
}

export interface AdminNavGroup {
  group: string;
  badge?: string | null;
  items: NavGroupItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    group: "Core",
    items: [
      {
        title: "Overview",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Orders",
        icon: ShoppingBag,
        children: [
          { title: "All Orders", href: "/dashboard/orders" },
          {
            title: "Pending Dispatch",
            href: "/dashboard/orders?status=pending",
          },
        ],
      },
      {
        title: "Customer Carts",
        href: ROUTES.ADMIN_CARTS,
        icon: ShoppingCart,
      },
      {
        title: "Customer Wishlists",
        href: ROUTES.ADMIN_WISHLISTS,
        icon: Heart,
      },
    ],
  },
  {
    group: "Catalog",
    items: [
      {
        title: "Products",
        icon: Package,
        children: [
          { title: "Manage products", href: "/dashboard/products" },
          { title: "Create Product", href: "/dashboard/products/create" },
        ],
      },
      {
        title: "Flash Deals",
        href: ROUTES.ADMIN_FLASH_DEALS,
        icon: Flame,
        badge: "Live",
      },
      {
        title: "Category",
        icon: FolderTree,
        children: [
          { title: "Create category", href: "/dashboard/create-category" },
          { title: "Manage category", href: "/dashboard/categories" },
        ],
      },
      {
        title: "Brands",
        icon: Award,
        children: [
          { title: "Create Brand", href: "/dashboard/brands/create" },
          { title: "Manage brand", href: "/dashboard/brands" },
        ],
      },
      {
        title: "Inventory",
        icon: Boxes,
        children: [
          { title: "Stock Overview", href: "/dashboard/inventory" },
          { title: "Stock Audit Logs", href: "/dashboard/inventory/audit" },
        ],
      },
    ],
  },
  {
    group: "Finance & Sales",
    items: [
      {
        title: "Verify Payments",
        href: ROUTES.PAYMENTS,
        icon: CreditCard,
      },
      {
        title: "Analytics & Reports",
        icon: BarChart3,
        children: [
          { title: "Reports Overview", href: "/dashboard/reports" },
          { title: "Profit & Margins", href: "/dashboard/reports/profit" },
          { title: "Stock Valuation", href: "/dashboard/reports/stock" },
          { title: "Low-Stock Alerts", href: "/dashboard/reports/low-stock" },
          { title: "Transaction Audit", href: "/dashboard/reports/transactions" },
          { title: "Sales Performance", href: "/dashboard/reports/sales" },
        ],
      },
    ],
  },
  {
    group: "Engagement & Audit",
    items: [
      {
        title: "Reviews",
        icon: Star,
        href: "/dashboard/reviews",
      },
      {
        title: "Activity Logs",
        icon: History,
        href: "/dashboard/activity",
      },
    ],
  },
  {
    group: "Store Administration",
    badge: "Coming Soon",
    items: [
      {
        title: "Customizations",
        icon: Sliders,
        badge: "Later",
        children: [
          {
            title: "Banners & Promos",
            href: "/dashboard/customizations?tab=banners",
            badge: "Later",
          },
          {
            title: "Homepage Layout",
            href: "/dashboard/customizations?tab=homepage",
            badge: "Later",
          },
          {
            title: "Theme Accent",
            href: "/dashboard/customizations?tab=theme",
            badge: "Later",
          },
        ],
      },
      {
        title: "Settings",
        icon: Settings,
        badge: "Coming Soon",
        children: [
          {
            title: "Store Profile",
            href: "/dashboard/settings?tab=profile",
            badge: "Later",
          },
          {
            title: "Shipping & Delivery",
            href: "/dashboard/settings?tab=shipping",
            badge: "Later",
          },
          {
            title: "Tax & Currencies",
            href: "/dashboard/settings?tab=tax",
            badge: "Later",
          },
          {
            title: "Staff & Permissions",
            href: "/dashboard/settings?tab=staff",
            badge: "Later",
          },
        ],
      },
    ],
  },
];
