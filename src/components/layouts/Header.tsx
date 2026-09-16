"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/common";
import { ROUTES } from "@/constants";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuthStore, useCartStore, useWishlistStore } from "@/stores";
import {
  TopUtilityBar,
  HeaderSearch,
  HeaderUserMenu,
  MegaMenu,
} from "./navigation";

export function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Stores
  const rawCartCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const rawWishlistCount = useWishlistStore((state) => state.items.length);
  const authUser = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const cartCount = mounted ? rawCartCount : 0;
  const wishlistCount = mounted ? rawWishlistCount : 0;
  const user = mounted ? authUser : null;

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "authRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    setProfileOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  };

  const isAccountPage = pathname.startsWith(ROUTES.ACCOUNT);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md transition-colors shadow-xs",
        isAccountPage
          ? "border-b-0 md:border-b md:border-border/60"
          : "border-b border-border/60",
      )}
    >
      {/* ── Row 1: Top Bar (Support Hotline, Promos, Track Order, About) ── */}
      <TopUtilityBar />

      {/* ── Row 2: Main Header Bar (Logo, Unified Center Search, Cart, Wishlist, User Menu) ── */}
      <div
        className={cn(
          "container flex h-14 md:h-18 items-center justify-between gap-2.5 sm:gap-4 md:gap-8 px-3 sm:px-6",
          isAccountPage && "hidden md:flex",
        )}
      >
        {/* Brand Logo (Text hidden on mobile via Logo component) */}
        <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
          <Logo size={36} />
        </Link>

        {/* Unified Responsive Search Bar (Centered) */}
        <HeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
        />

        {/* Right Utilities */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Link
            href={ROUTES.WISHLIST}
            aria-label="Wishlist"
            className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white shadow-xs animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label="Shopping Cart"
            className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white shadow-xs animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          <HeaderUserMenu
            user={user}
            wishlistCount={wishlistCount}
            onLogout={handleLogout}
            isOpen={profileOpen}
            onToggle={setProfileOpen}
          />
        </div>
      </div>

      {/* ── Row 3: Navigation Bar & Mega Menu ── */}
      <MegaMenu pathname={pathname} />
    </header>
  );
}
