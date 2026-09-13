"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/constants";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  CreditCard,
  Boxes,
  History,
  Star,
  BarChart3,
  Sliders,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  LucideIcon,
} from "lucide-react";

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

export const ADMIN_NAV_GROUPS: { group: string; items: NavGroupItem[] }[] = [
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
        badge: "3",
        children: [
          { title: "All Orders", href: "/dashboard/orders" },
          { title: "Pending Dispatch", href: "/dashboard/orders?status=pending", badge: "2" },
          { title: "Returns & Exchanges", href: "/dashboard/orders?tab=returns" },
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
          { title: "Manage Stock", href: "/dashboard/products?tab=stock" },
          { title: "Grid View", href: "/dashboard/products?view=grid" },
        ],
      },
      {
        title: "Categories",
        icon: FolderTree,
        children: [
          { title: "All Categories", href: "/dashboard/categories" },
          { title: "Add Category", href: "/dashboard/categories?action=new" },
          { title: "Attributes & Tags", href: "/dashboard/categories?tab=attributes" },
        ],
      },
      {
        title: "Inventory",
        icon: Boxes,
        children: [
          { title: "Stock Overview", href: "/dashboard/inventory" },
          { title: "Low Stock Watchlist", href: "/dashboard/inventory?filter=low", badge: "5" },
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
          { title: "Payouts & Settlement", href: "/dashboard/payments?tab=payouts" },
          { title: "Gateway Settings", href: "/dashboard/payments?tab=gateways" },
        ],
      },
      {
        title: "Analytics",
        icon: BarChart3,
        children: [
          { title: "Revenue Reports", href: ROUTES.REPORTS },
          { title: "Sales Performance", href: "/dashboard/reports?view=sales" },
          { title: "Customer Retention", href: "/dashboard/reports?view=retention" },
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
          { title: "Banners & Promos", href: "/dashboard/customizations?tab=banners" },
          { title: "Homepage Layout", href: "/dashboard/customizations?tab=homepage" },
          { title: "Theme Accent", href: "/dashboard/customizations?tab=theme" },
        ],
      },
      {
        title: "Settings",
        icon: Settings,
        children: [
          { title: "Store Profile", href: ROUTES.SETTINGS },
          { title: "Shipping & Delivery", href: "/dashboard/settings?tab=shipping" },
          { title: "Tax & Currencies", href: "/dashboard/settings?tab=tax" },
          { title: "Staff & Permissions", href: "/dashboard/settings?tab=staff" },
        ],
      },
    ],
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const storeLogout = useAuthStore((state) => state.logout);
  const { isOpen, isMobileOpen, toggleSidebar, setMobileOpen } =
    useSidebarStore();

  // Expanded parent item tracking
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Products: true,
    Orders: false,
    Categories: false,
    Payments: false,
    Inventory: false,
    Analytics: false,
    Customizations: false,
    Settings: false,
  });

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    if (isMobileOpen) setMobileOpen(false);
    router.push(ROUTES.LOGIN);
  };

  const searchParams = useSearchParams();

  const isSubRouteActive = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;

    if (!query) {
      // If base path has no query params, it is active only when current URL has no query params
      // or none of the other sibling query keys are present
      return searchParams.toString().length === 0;
    }

    // Check every key-value pair in the query string
    const params = new URLSearchParams(query);
    for (const [key, val] of params.entries()) {
      if (searchParams.get(key) !== val) {
        return false;
      }
    }
    return true;
  };

  const isParentRouteActive = (item: NavGroupItem) => {
    if (item.href) {
      if (item.href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
      return pathname.startsWith(item.href.split("?")[0]);
    }
    if (item.children) {
      return item.children.some((sub) => isSubRouteActive(sub.href));
    }
    return false;
  };

  return (
    <>
      {/* ── Mobile Backdrop ── */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ── Seamless Liquid Shadow Sidebar ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-30 flex flex-col border-none bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 text-sidebar-foreground transition-all duration-300 select-none",
          "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06),12px_0_48px_-12px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_30px_-4px_rgba(0,0,0,0.45),12px_0_60px_-10px_rgba(0,0,0,0.35)]",
          isOpen ? "lg:w-64" : "lg:w-20",
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header with Gradient & Rounded Bottom-Right Corner */}
        <div className="flex h-16 items-center justify-between px-3 rounded-br-2xl bg-gradient-to-br from-sidebar via-sidebar to-muted/60 border-b border-r border-border/70 shadow-sm">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group min-w-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background font-black text-base tracking-tight shadow-sm transition-transform group-hover:scale-105">
              <span>T</span>
            </div>

            {(isOpen || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-foreground truncate">
                    Telos Admin
                  </span>
                </div>
                <p className="text-[11px] text-foreground/60 font-medium truncate flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Store Active
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Icon Toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl bg-muted dark:bg-zinc-800 text-foreground shadow-xs border border-border/80 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4 stroke-[2.4]" />
            ) : (
              <ChevronRight className="h-4 w-4 stroke-[2.4]" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hierarchical Navigation List */}
        <nav className="relative flex-1 space-y-5 px-3 pt-4 pb-4 mt-2 overflow-y-auto subpixel-antialiased sidebar-scrollbar">
          {ADMIN_NAV_GROUPS.map((section) => (
            <div key={section.group} className="space-y-1">
              {(isOpen || isMobileOpen) && (
                <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-foreground/70 dark:text-zinc-400">
                  {section.group}
                </div>
              )}

              {section.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isItemActive = isParentRouteActive(item);
                const isItemOpen = expanded[item.title] ?? false;

                // Collapsed sidebar icon item
                if (!isOpen && !isMobileOpen) {
                  return (
                    <Link
                      key={item.title}
                      href={item.href || (item.children ? item.children[0].href : "#")}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-150",
                        isItemActive
                          ? "bg-foreground text-background font-bold shadow-sm"
                          : "text-zinc-800 dark:text-zinc-200 hover:bg-muted hover:text-foreground"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-5 w-5 shrink-0 stroke-[2.2]" />
                    </Link>
                  );
                }

                // Expanded Item without children
                if (!hasChildren) {
                  return (
                    <Link
                      key={item.title}
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight transition-all duration-150",
                        isItemActive
                          ? "bg-foreground text-background font-bold shadow-sm"
                          : "text-zinc-900 dark:text-zinc-100 hover:bg-muted"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 stroke-[2.2] transition-colors",
                          isItemActive ? "text-background" : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate flex-1 font-semibold">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-xs font-bold",
                            isItemActive
                              ? "bg-background/20 text-background"
                              : "bg-muted text-foreground border border-border"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                }

                // Collapsible parent with sub-items
                return (
                  <div key={item.title} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight transition-all duration-150 cursor-pointer text-left",
                        isItemActive
                          ? "text-foreground font-bold bg-muted"
                          : "text-zinc-900 dark:text-zinc-100 hover:bg-muted"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 stroke-[2.2] transition-colors",
                          isItemActive ? "text-foreground" : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate flex-1 font-semibold">{item.title}</span>
                      {item.badge && (
                        <span className="rounded-md px-1.5 py-0.5 text-xs font-bold bg-muted text-foreground border border-border mr-1">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 stroke-[2.2] transition-transform duration-200 text-zinc-600 dark:text-zinc-400 group-hover:text-foreground",
                          isItemOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Sub-menu drawer */}
                    {isItemOpen && (
                      <div className="pl-5 pr-1 py-1 space-y-1 border-l-2 border-border ml-5 mt-0.5">
                        {item.children!.map((sub) => {
                          const isSubActive = isSubRouteActive(sub.href);
                          return (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-colors",
                                isSubActive
                                  ? "bg-foreground text-background font-semibold shadow-xs"
                                  : "text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-muted"
                              )}
                            >
                              <span className="truncate">{sub.title}</span>
                              {sub.badge && (
                                <span
                                  className={cn(
                                    "rounded-md px-1.5 py-0.5 text-xs font-semibold",
                                    isSubActive
                                      ? "bg-background/25 text-background"
                                      : "bg-muted text-foreground border border-border"
                                  )}
                                >
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-border/40 p-3.5 space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {(isOpen || isMobileOpen) && (
              <span className="truncate">Log Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
