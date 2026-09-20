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
    group: "Operations",
    items: [
      {
        title: "Overview",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
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
        title: "Payments",
        href: ROUTES.PAYMENTS,
        icon: CreditCard,
      },
    ],
  },
  {
    group: "Catalog & Inventory",
    items: [
      {
        title: "Products",
        icon: Package,
        children: [
          { title: "All Products", href: "/dashboard/products" },
          { title: "Add Product", href: "/dashboard/products/create" },
        ],
      },
      {
        title: "Categories",
        icon: FolderTree,
        children: [
          { title: "All Categories", href: "/dashboard/categories" },
          { title: "Add Category", href: "/dashboard/create-category" },
        ],
      },
      {
        title: "Brands",
        icon: Award,
        children: [
          { title: "All Brands", href: "/dashboard/brands" },
          { title: "Add Brand", href: "/dashboard/brands/create" },
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
      {
        title: "Flash Deals",
        href: ROUTES.ADMIN_FLASH_DEALS,
        icon: Flame,
        badge: "Live",
      },
    ],
  },
  {
    group: "Customers & Engagement",
    items: [
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Active Carts",
        href: ROUTES.ADMIN_CARTS,
        icon: ShoppingCart,
      },
      {
        title: "Wishlists",
        href: ROUTES.ADMIN_WISHLISTS,
        icon: Heart,
      },
      {
        title: "Reviews",
        icon: Star,
        href: "/dashboard/reviews",
      },
    ],
  },
  {
    group: "Analytics & Audit",
    items: [
      {
        title: "Analytics & Reports",
        icon: BarChart3,
        children: [
          { title: "Reports Overview", href: "/dashboard/reports" },
          { title: "Sales Performance", href: "/dashboard/reports/sales" },
          { title: "Profit & Margins", href: "/dashboard/reports/profit" },
          { title: "Stock Valuation", href: "/dashboard/reports/stock" },
          { title: "Low-Stock Alerts", href: "/dashboard/reports/low-stock" },
          { title: "Transaction Audit", href: "/dashboard/reports/transactions" },
        ],
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
    badge: "Soon",
    items: [
      {
        title: "Customizations",
        icon: Sliders,
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
