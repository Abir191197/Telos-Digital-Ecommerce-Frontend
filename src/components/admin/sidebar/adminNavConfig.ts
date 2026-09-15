import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Boxes,
  CreditCard,
  BarChart3,
  Star,
  History,
  Sliders,
  Settings,
  LucideIcon,
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
        title: "Orders",
        icon: ShoppingBag,
        badge: "2",
        children: [
          { title: "All Orders", href: "/dashboard/orders" },
          {
            title: "Pending Dispatch",
            href: "/dashboard/orders?status=pending",
            badge: "2",
          },
        ],
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
          { title: "Product List", href: "/dashboard/products" },
          { title: "Create Product", href: "/dashboard/products?action=create" },
        ],
      },
      {
        title: "Categories",
        icon: FolderTree,
        children: [
          { title: "All Categories", href: "/dashboard/categories" },
          { title: "Add Category", href: "/dashboard/categories?action=new" },
          {
            title: "Attributes & Tags",
            href: "/dashboard/categories?tab=attributes",
          },
        ],
      },
      {
        title: "Inventory",
        icon: Boxes,
        children: [
          { title: "Stock Overview", href: "/dashboard/inventory" },
          {
            title: "Low Stock Watchlist",
            href: "/dashboard/inventory?filter=low",
            badge: "5",
          },
          { title: "Warehouse Logs", href: "/dashboard/inventory?tab=warehouse" },
        ],
      },
    ],
  },
  {
    group: "Finance & Sales",
    items: [
      {
        title: "Payments",
        icon: CreditCard,
        children: [
          { title: "Transaction Logs", href: ROUTES.PAYMENTS },
          {
            title: "Payouts & Settlement",
            href: "/dashboard/payments?tab=payouts",
          },
          { title: "Gateway Settings", href: "/dashboard/payments?tab=gateways" },
        ],
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
