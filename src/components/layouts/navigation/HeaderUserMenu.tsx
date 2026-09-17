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
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
        >
          <UserIcon className="h-4 w-4" />
          <span>Sign In</span>
        </Link>
        <Link
          href={ROUTES.REGISTER}
          className="hidden sm:inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
        >
          Register
        </Link>
      </div>
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
          "group flex items-center gap-2 rounded-full p-1 sm:pr-3 transition-all duration-200 cursor-pointer bg-card/60 hover:bg-card hover:shadow-md active:scale-98",
          isOpen && "bg-card shadow-lg",
        )}
      >
        {/* Minimalist Avatar or Monogram Disc */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 text-foreground font-bold text-xs shadow-inner overflow-hidden">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-[11px] font-extrabold tracking-tight text-zinc-100 uppercase">
              {user.name ? user.name.slice(0, 2) : "U"}
            </span>
          )}
          {/* Tiny Active Session Dot */}
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-background" />
        </div>

        {/* Minimalist Clean First Name */}
        <span className="hidden sm:inline-block max-w-[90px] truncate text-xs font-semibold text-foreground/90 group-hover:text-foreground">
          {user.name.split(" ")[0]}
        </span>

        <ChevronDown
          className={cn(
            "hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            isOpen && "rotate-180 text-amber-500",
          )}
        />
      </button>

      {/* ── Profile Dropdown Menu (Borderless with luxury shadow) ── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-64 origin-top-right rounded-3xl bg-popover/98 p-2 text-popover-foreground shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.75)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
          {/* User Summary Header */}
          <div className="px-3 py-2.5 bg-muted/40 rounded-2xl mb-1.5">
            <p className="text-xs font-bold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
            {user.phone && (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                {user.phone}
              </p>
            )}
          </div>

          {/* Menu Links */}
          <div className="space-y-1 text-xs font-medium">
            <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Customer Account
            </div>

            <Link
              href={ROUTES.ACCOUNT}
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
