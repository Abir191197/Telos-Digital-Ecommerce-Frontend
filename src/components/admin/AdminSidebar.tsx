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
    badge: "3 New",
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
      {/* ── Mobile Backdrop (Drawer overlay) ── */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ── Sidebar Element (Desktop Fixed + Mobile Slide-over) ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border/80 bg-sidebar transition-all duration-300",
          // Desktop sizing
          isOpen ? "lg:w-64" : "lg:w-20",
          // Mobile drawer positioning
          isMobileOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-4">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-sm shadow-md shadow-amber-500/20">
              T
            </div>
            {(isOpen || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-foreground">
                    TELOS ADMIN
                  </span>
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Merchant Hub BD
                </p>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {isOpen || isMobileOpen ? "Store Management" : "•••"}
          </div>

          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
                  active
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
                title={!isOpen && !isMobileOpen ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-white" : "text-muted-foreground"
                  )}
                />
                {(isOpen || isMobileOpen) && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                          active
                            ? "bg-white/20 text-white"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
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

        {/* Public Storefront Link, Logout & Desktop Collapse Toggle */}
        <div className="border-t border-border/80 p-3 space-y-1.5">
          <Link
            href={ROUTES.HOME}
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Store className="h-4 w-4 shrink-0 text-amber-500" />
            {(isOpen || isMobileOpen) && (
              <span className="truncate">View Public Store</span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(isOpen || isMobileOpen) && (
              <span className="truncate">Log Out</span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {isOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
