"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  User as UserIcon,
  LayoutGrid,
  Package,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { CustomerUser } from "@/stores";

interface HeaderUserMenuProps {
  user: CustomerUser | null;
  wishlistCount: number;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function HeaderUserMenu({
  user,
  wishlistCount,
  onLogout,
  isOpen,
  onToggle,
}: HeaderUserMenuProps) {
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        onToggle(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onToggle]);

  if (!user) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/25 hover:bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-amber-500/50 transition-all active:scale-95 shadow-2xs"
      >
        <UserIcon className="h-3.5 w-3.5 text-amber-500" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div ref={profileRef} className="relative">
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
        className={cn(
          "group flex items-center gap-1.5 rounded-full p-0.5 sm:pr-2.5 transition-all duration-200 cursor-pointer bg-card/60 hover:bg-card hover:shadow-xs active:scale-98 border border-transparent hover:border-border/60",
          isOpen && "bg-card shadow-sm border-border/80",
        )}
      >
        {/* Minimalist Avatar or Monogram Disc */}
        <div className="relative shrink-0">
          <div className="relative flex h-7 w-7 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 text-foreground font-bold text-xs shadow-inner overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="30px"
                className="object-cover"
              />
            ) : (
              <span className="text-[10px] font-extrabold tracking-tight text-zinc-100 uppercase">
                {user.name ? user.name.slice(0, 2) : "U"}
              </span>
            )}
          </div>
          {/* Active Session Dot anchored seamlessly to avatar perimeter */}
          <span className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card shadow-xs pointer-events-none" />
        </div>

        {/* Minimalist Clean First Name */}
        <span className="hidden sm:inline-block max-w-[80px] truncate text-xs font-semibold text-foreground/90 group-hover:text-foreground">
          {user.name.split(" ")[0]}
        </span>

        <ChevronDown
          className={cn(
            "hidden sm:block h-3 w-3 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            isOpen && "rotate-180 text-amber-500",
          )}
        />
      </button>

      {/* ── Profile Dropdown Menu (Borderless with luxury shadow) ── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-64 origin-top-right rounded-3xl bg-popover/98 p-2 text-popover-foreground shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.75)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
          {/* User Summary Header */}
          <div className="px-3 py-2.5 bg-muted/40 rounded-2xl mb-1.5 border border-border/50">
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-xs font-bold text-foreground truncate">
                {user.name}
              </p>
              {user.role === "admin" && (
                <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-black uppercase text-amber-600 dark:text-amber-400">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
            {user.role !== "admin" && user.phone && (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                {user.phone}
              </p>
            )}
          </div>

          {/* Menu Links */}
          {user.role === "admin" ? (
            <div className="space-y-1 text-xs font-medium">
              <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Administrator Portal
              </div>

              <Link
                href={ROUTES.DASHBOARD}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <LayoutGrid className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="font-semibold">Admin Dashboard</span>
              </Link>

              <Link
                href={`${ROUTES.DASHBOARD}/products`}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <Package className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Products & Inventory</span>
              </Link>

              <Link
                href={`${ROUTES.DASHBOARD}/orders`}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <Package className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Customer Orders</span>
              </Link>

              <Link
                href={`${ROUTES.DASHBOARD}/customers`}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <UserIcon className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Customer Accounts</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-1 text-xs font-medium">
              <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Customer Account
              </div>

              <Link
                href={`${ROUTES.ACCOUNT}?tab=orders`}
                onClick={() => onToggle(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="font-semibold">My Account</span>
                </span>
              </Link>

              <Link
                href={`${ROUTES.ACCOUNT}?tab=profile`}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <UserIcon className="h-4 w-4 text-amber-500 shrink-0" />
                <span>My Profile</span>
              </Link>

              <Link
                href={`${ROUTES.ACCOUNT}?tab=orders`}
                onClick={() => onToggle(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Orders & Tracking</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                  Live
                </span>
              </Link>

              <Link
                href={`${ROUTES.ACCOUNT}?tab=addresses`}
                onClick={() => onToggle(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Saved Addresses</span>
              </Link>

              <Link
                href={ROUTES.WISHLIST}
                onClick={() => onToggle(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>Wishlist</span>
                </span>
                {wishlistCount > 0 && (
                  <span className="text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Divider & Logout */}
          <div className="pt-1.5 mt-1 border-t border-border/60">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
