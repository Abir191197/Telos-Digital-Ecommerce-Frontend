"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Store,
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

  const isRouteActive = (href?: string) => {
    if (!href) return false;
    if (href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
    return pathname.startsWith(href.split("?")[0]);
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
          "fixed top-0 bottom-0 left-0 z-30 flex flex-col border-none bg-sidebar text-sidebar-foreground transition-all duration-300 select-none",
          "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06),12px_0_48px_-12px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_30px_-4px_rgba(0,0,0,0.45),12px_0_60px_-10px_rgba(0,0,0,0.35)]",
          isOpen ? "lg:w-64" : "lg:w-20",
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header with Gradient & Rounded Bottom-Right Corner */}
        <div className="flex h-16 items-center justify-between px-3 rounded-br-2xl bg-gradient-to-br from-sidebar via-sidebar to-muted/50 border-b border-r border-border/50 shadow-xs">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2.5 overflow-hidden group min-w-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm tracking-tight shadow-2xs transition-transform group-hover:scale-105">
              <span>T</span>
            </div>

            {(isOpen || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-foreground truncate">
                    Telos Admin
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium truncate">
                  Store Management
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Icon Toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hierarchical Navigation List */}
        <nav className="flex-1 space-y-4 px-3 pt-6 pb-4 overflow-y-auto">
          {ADMIN_NAV_GROUPS.map((section) => (
            <div key={section.group} className="space-y-1">
              {(isOpen || isMobileOpen) && (
                <div className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {section.group}
                </div>
              )}

              {section.items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isItemActive = hasChildren
                  ? item.children!.some((sub) => isRouteActive(sub.href))
                  : isRouteActive(item.href);
                const isItemOpen = expanded[item.title] ?? false;

                // Collapsed sidebar icon item
                if (!isOpen && !isMobileOpen) {
                  return (
                    <Link
                      key={item.title}
                      href={item.href || (item.children ? item.children[0].href : "#")}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex h-9 w-9 mx-auto items-center justify-center rounded-lg transition-colors",
                        isItemActive
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                      title={item.title}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
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
                        "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isItemActive
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isItemActive ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate flex-1">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.2 text-[10px] font-medium",
                            isItemActive
                              ? "bg-background/20 text-background"
                              : "bg-muted text-muted-foreground"
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
                        "w-full group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer text-left",
                        isItemActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isItemActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="truncate flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="rounded-md px-1.5 py-0.2 text-[10px] font-medium bg-muted text-muted-foreground mr-1">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-muted-foreground/80 transition-transform duration-200",
                          isItemOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Sub-menu drawer */}
                    {isItemOpen && (
                      <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-border/40 ml-4">
                        {item.children!.map((sub) => {
                          const isSubActive = isRouteActive(sub.href);
                          return (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center justify-between rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                                isSubActive
                                  ? "bg-muted font-semibold text-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <span className="truncate">{sub.title}</span>
                              {sub.badge && (
                                <span className="rounded px-1 text-[9px] font-semibold bg-muted text-muted-foreground border border-border/60">
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
        <div className="border-t border-border/40 p-3 space-y-1">
          <Link
            href={ROUTES.HOME}
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
            {(isOpen || isMobileOpen) && (
              <span className="truncate">Public Store</span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(isOpen || isMobileOpen) && (
              <span className="truncate">Log Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
