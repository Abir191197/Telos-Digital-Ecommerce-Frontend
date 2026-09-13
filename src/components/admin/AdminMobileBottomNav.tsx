"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ShoppingCart,
  Menu,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAdminStore } from "@/stores/admin.store";
import { cn } from "@/lib/utils";

export function AdminMobileBottomNav() {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebarStore();
  const { orders } = useAdminStore();

  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;

  const isDashboardActive = pathname === ROUTES.DASHBOARD;
  const isOrdersActive = pathname.startsWith("/dashboard/orders");
  const isProductsActive = pathname.startsWith("/dashboard/products");

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border/70 bg-card/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-all pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
        {/* 1. Dashboard */}
        <Link
          href={ROUTES.DASHBOARD}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isDashboardActive
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isDashboardActive && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <LayoutDashboard
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isDashboardActive && "scale-110 stroke-[2.4]"
            )}
          />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </Link>

        {/* 2. Orders */}
        <Link
          href="/dashboard/orders"
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isOrdersActive
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isOrdersActive && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <div className="relative flex items-center justify-center">
            <ShoppingBag
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isOrdersActive && "scale-110 stroke-[2.4]"
              )}
            />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white shadow-xs">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        {/* 3. Products */}
        <Link
          href="/dashboard/products"
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isProductsActive
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isProductsActive && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <Package
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isProductsActive && "scale-110 stroke-[2.4]"
            )}
          />
          <span className="text-[10px] tracking-tight">Products</span>
        </Link>

        {/* 4. Cart (Public Store View / Live Cart) */}
        <Link
          href={ROUTES.CART}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95 text-muted-foreground hover:text-foreground font-medium"
          )}
          title="View Storefront Cart"
        >
          <ShoppingCart className="h-5 w-5 transition-transform duration-200" />
          <span className="text-[10px] tracking-tight">Cart</span>
        </Link>

        {/* 5. Menu (Open Full Drawer) */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5 transition-transform duration-200" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}
