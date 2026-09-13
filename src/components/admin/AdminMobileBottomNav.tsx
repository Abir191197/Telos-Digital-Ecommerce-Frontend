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
import { cn } from "@/lib/utils";

export function AdminMobileBottomNav() {
  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  const isDashboardActive = pathname === ROUTES.DASHBOARD;
  const isOrdersActive = pathname.startsWith("/dashboard/orders");
  const isProductsActive = pathname.startsWith("/dashboard/products");

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/70 bg-card/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-all pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1 items-center">
        {/* 1. Dashboard */}
        <Link
          href={ROUTES.DASHBOARD}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isDashboardActive && !isMobileOpen
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isDashboardActive && !isMobileOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <LayoutDashboard
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isDashboardActive && !isMobileOpen && "scale-110 stroke-[2.4]"
            )}
          />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </Link>

        {/* 2. Orders */}
        <Link
          href="/dashboard/orders"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isOrdersActive && !isMobileOpen
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isOrdersActive && !isMobileOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <div className="relative flex items-center justify-center">
            <ShoppingBag
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isOrdersActive && !isMobileOpen && "scale-110 stroke-[2.4]"
              )}
            />
          </div>
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        {/* 3. Products */}
        <Link
          href="/dashboard/products"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95",
            isProductsActive && !isMobileOpen
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isProductsActive && !isMobileOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <Package
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isProductsActive && !isMobileOpen && "scale-110 stroke-[2.4]"
            )}
          />
          <span className="text-[10px] tracking-tight">Products</span>
        </Link>

        {/* 4. Cart (Public Store View / Live Cart) */}
        <Link
          href={ROUTES.CART}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95 text-muted-foreground hover:text-foreground font-medium"
          )}
          title="View Storefront Cart"
        >
          <ShoppingCart className="h-5 w-5 transition-transform duration-200" />
          <span className="text-[10px] tracking-tight">Cart</span>
        </Link>

        {/* 5. Menu (Toggle Full Drawer) */}
        <button
          type="button"
          onClick={() => setMobileOpen(!isMobileOpen)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 select-none active:scale-95 font-medium cursor-pointer",
            isMobileOpen
              ? "text-amber-500 font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMobileOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <Menu
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isMobileOpen && "scale-110 stroke-[2.4]"
            )}
          />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}
