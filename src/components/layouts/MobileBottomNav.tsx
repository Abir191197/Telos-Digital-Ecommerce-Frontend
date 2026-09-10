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
  const openCart = useCartStore((state) => state.openCart);
  const rawWishlistCount = useWishlistStore((state) => state.items.length);
  const authUser = useAuthStore((state) => state.user);

  const cartCount = mounted ? rawCartCount : 0;
  const wishlistCount = mounted ? rawWishlistCount : 0;
  const user = mounted ? authUser : null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-60 md:hidden border-t border-border/70 bg-background/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-all"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {/* 1. Home */}
        <Link
          href={ROUTES.HOME}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname === ROUTES.HOME
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname === ROUTES.HOME && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <Home className={cn("h-5 w-5 transition-transform duration-200", pathname === ROUTES.HOME && "scale-110 stroke-[2.4]")} />
          <span className="text-[11px] tracking-tight">Home</span>
        </Link>

        {/* 2. Categories */}
        <Link
          href={ROUTES.CATEGORIES}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname.startsWith(ROUTES.CATEGORIES)
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname.startsWith(ROUTES.CATEGORIES) && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <LayoutGrid className={cn("h-5 w-5 transition-transform duration-200", pathname.startsWith(ROUTES.CATEGORIES) && "scale-110 stroke-[2.4]")} />
          <span className="text-[11px] tracking-tight">Categories</span>
        </Link>

        {/* 3. Wishlist */}
        <Link
          href={ROUTES.WISHLIST}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname === ROUTES.WISHLIST
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {pathname === ROUTES.WISHLIST && (
            <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
          )}
          <div className="relative flex items-center justify-center">
            <Heart
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                pathname === ROUTES.WISHLIST && "scale-110 stroke-[2.4] fill-amber-500/20"
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

        {/* 4. Cart Button (Triggers Drawer) */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none text-muted-foreground hover:text-foreground font-medium cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Cart</span>
        </button>

        {/* 5. Account */}
        <Link
          href={user ? ROUTES.ACCOUNT : ROUTES.LOGIN}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
            pathname.startsWith(ROUTES.ACCOUNT) || pathname.startsWith(ROUTES.PROFILE) || pathname === ROUTES.LOGIN
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {(pathname.startsWith(ROUTES.ACCOUNT) || pathname.startsWith(ROUTES.PROFILE)) && (
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
            {user ? user.name.split(" ")[0] : "Account"}
          </span>
        </Link>
      </div>
      {/* iOS Safe Area spacing */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
