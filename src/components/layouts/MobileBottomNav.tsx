"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
  Shield,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useAuthStore } from "@/stores";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const mounted = useMounted();

  // Zustand state
  const rawCartCount = useCartStore((state) => state.getItemCount());
  const isCartOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const rawWishlistCount = useWishlistStore((state) => state.items.length);
  const authUser = useAuthStore((state) => state.user);

  const user = mounted ? authUser : null;
  const cartCount = mounted && user ? rawCartCount : 0;
  const wishlistCount = mounted && user ? rawWishlistCount : 0;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-60 md:hidden border-t border-border/70 bg-background/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-all"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {/* 1. Home */}
        <Link
          href={ROUTES.HOME}
          onClick={closeCart}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname === ROUTES.HOME && !isCartOpen
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname === ROUTES.HOME && !isCartOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <Home className={cn("h-5 w-5 transition-transform duration-200", pathname === ROUTES.HOME && !isCartOpen && "scale-110 stroke-[2.4]")} />
          <span className="text-[11px] tracking-tight">Home</span>
        </Link>

        {/* 2. Categories */}
        <Link
          href={ROUTES.CATEGORIES}
          onClick={closeCart}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname.startsWith(ROUTES.CATEGORIES) && !isCartOpen
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname.startsWith(ROUTES.CATEGORIES) && !isCartOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <LayoutGrid className={cn("h-5 w-5 transition-transform duration-200", pathname.startsWith(ROUTES.CATEGORIES) && !isCartOpen && "scale-110 stroke-[2.4]")} />
          <span className="text-[11px] tracking-tight">Categories</span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          href={ROUTES.WISHLIST}
          onClick={closeCart}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname === ROUTES.WISHLIST && !isCartOpen
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname === ROUTES.WISHLIST && !isCartOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <div className="relative flex items-center justify-center">
            <Heart
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                pathname === ROUTES.WISHLIST && !isCartOpen && "scale-110 stroke-[2.4] fill-amber-500/20"
              )}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Wishlist</span>
        </Link>

        {/* 4. Cart Button or Admin Dashboard Link */}
        {user?.role === "admin" ? (
          <Link
            href={ROUTES.DASHBOARD}
            onClick={closeCart}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
              pathname.startsWith(ROUTES.DASHBOARD)
                ? "text-amber-600 font-semibold"
                : "text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            {pathname.startsWith(ROUTES.DASHBOARD) && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
            )}
            <Shield className={cn("h-5 w-5 transition-transform duration-200", pathname.startsWith(ROUTES.DASHBOARD) && "scale-110 stroke-[2.4]")} />
            <span className="text-[11px] tracking-tight">Admin</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={toggleCart}
            aria-expanded={isCartOpen}
            aria-label="Shopping Cart"
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none cursor-pointer",
              isCartOpen
                ? "text-amber-600 font-semibold"
                : "text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            {isCartOpen && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
            )}
            <div className="relative flex items-center justify-center">
              <ShoppingCart className={cn("h-5 w-5 transition-transform duration-200", isCartOpen && "scale-110 stroke-[2.4]")} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Cart</span>
          </button>
        )}

        {/* 5. Account */}
        <Link
          href={user?.role === "admin" ? ROUTES.DASHBOARD : user ? ROUTES.ACCOUNT : ROUTES.LOGIN}
          onClick={closeCart}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            (pathname.startsWith(ROUTES.ACCOUNT) || pathname.startsWith(ROUTES.PROFILE) || pathname === ROUTES.LOGIN) && !isCartOpen
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {(pathname.startsWith(ROUTES.ACCOUNT) || pathname.startsWith(ROUTES.PROFILE) || pathname === ROUTES.LOGIN) && !isCartOpen && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          {user ? (
            <div className="relative h-5 w-5 overflow-hidden rounded-full border border-amber-500/70">
              <User className="h-full w-full p-0.5 text-amber-600" />
            </div>
          ) : (
            <User className="h-5 w-5" />
          )}
          <span className="text-[11px] tracking-tight">
            {user?.role === "admin" ? "Portal" : user ? user.name.split(" ")[0] : "Account"}
          </span>
        </Link>
      </div>
      {/* iOS Safe Area spacing */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
