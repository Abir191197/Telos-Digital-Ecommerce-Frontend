"use client";

import React from "react";
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
  Users,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  X,
  Store,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  {
    title: "Overview",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Orders & Shipping",
    href: "/dashboard/orders",
    icon: ShoppingBag,
    badge: "3",
  },
  {
    title: "Products & Stock",
    href: "/dashboard/products",
    icon: Package,
    badge: null,
  },
  {
    title: "Customers",
    href: ROUTES.CLIENTS,
    icon: Users,
    badge: null,
  },
  {
    title: "Payments & Trx",
    href: ROUTES.PAYMENTS,
    icon: CreditCard,
    badge: null,
  },
  {
    title: "Financial Reports",
    href: ROUTES.REPORTS,
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
    badge: "5",
  },
  {
    title: "Settings & Store",
    href: ROUTES.SETTINGS,
    icon: Settings,
    badge: null,
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const storeLogout = useAuthStore((state) => state.logout);
  const { isOpen, isMobileOpen, toggleSidebar, setMobileOpen } =
    useSidebarStore();

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    if (isMobileOpen) setMobileOpen(false);
    router.push(ROUTES.LOGIN);
  };

  const isNavActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === ROUTES.DASHBOARD;
    }
    return pathname.startsWith(href);
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
        <div className="flex h-16 items-center justify-between px-4 rounded-br-2xl bg-gradient-to-br from-sidebar via-sidebar to-muted/50 border-b border-r border-border/50 shadow-xs">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm tracking-tight shadow-2xs transition-transform group-hover:scale-105">
              <span>T</span>
            </div>

            {(isOpen || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-foreground">
                    Telos Admin
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Store Management
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            {isOpen || isMobileOpen ? "Navigation" : "•••"}
          </div>

          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-foreground text-background font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
                title={!isOpen && !isMobileOpen ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-background" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                {(isOpen || isMobileOpen) && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                          active
                            ? "bg-background/20 text-background"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
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

          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg border border-border/80 py-1.5 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="text-[11px]">Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
