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
        title: "Payments",
        href: ROUTES.PAYMENTS,
        icon: CreditCard,
      },
      {
        title: "Analytics",
        icon: BarChart3,
        children: [
          { title: "Revenue Reports", href: ROUTES.REPORTS },
          { title: "Sales Performance", href: "/dashboard/reports?view=sales" },
          {
            title: "Customer Retention",
            href: "/dashboard/reports?view=retention",
          },
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
    items: [
      {
        title: "Customizations",
        icon: Sliders,
        children: [
          {
            title: "Banners & Promos",
            href: "/dashboard/customizations?tab=banners",
          },
          {
            title: "Homepage Layout",
            href: "/dashboard/customizations?tab=homepage",
          },
          { title: "Theme Accent", href: "/dashboard/customizations?tab=theme" },
        ],
      },
      {
        title: "Settings",
        icon: Settings,
        children: [
          { title: "Store Profile", href: ROUTES.SETTINGS },
          {
            title: "Shipping & Delivery",
            href: "/dashboard/settings?tab=shipping",
          },
          { title: "Tax & Currencies", href: "/dashboard/settings?tab=tax" },
          { title: "Staff & Permissions", href: "/dashboard/settings?tab=staff" },
        ],
      },
    ],
  },
];
