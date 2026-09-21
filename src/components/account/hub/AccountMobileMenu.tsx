import React from "react";
import Link from "next/link";
import { AppImage } from "@/components/shared";
import {
  User,
  ShieldCheck,
  Edit3,
  ChevronRight,
  LogOut,
  Flame,
  Tag,
  LayoutGrid,
  ShoppingBag,
  Headphones,
  FileQuestion,
  FileText,
  ShieldAlert,
  Info,
} from "lucide-react";
import { ROUTES } from "@/constants";
import type { CustomerUser } from "@/stores/auth.store";
import type { Order } from "@/types/order.types";
import {
  ACCOUNT_NAV_GROUPS,
  AccountTabKey,
  CustomerReview,
} from "../accountNavData";

interface AccountMobileMenuProps {
  user: CustomerUser;
  orders: Order[];
  wishlistCount: number;
  pendingReviewCount: number;
  onSelectTab: (tab: AccountTabKey) => void;
  onLogout: () => void;
}

export function AccountMobileMenu({
  user,
  orders,
  wishlistCount,
  pendingReviewCount,
  onSelectTab,
  onLogout,
}: AccountMobileMenuProps) {
  return (
    <div className="space-y-3 pb-8">
      {/* Top User Profile Card */}
      <div className="rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 p-4.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-2xl border-2 border-amber-500/80 shadow-md shadow-amber-500/20 flex items-center justify-center bg-muted/40 overflow-hidden text-foreground">
            <AppImage
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
              fallbackIcon={<User className="h-8 w-8 stroke-[1.5] text-muted-foreground" />}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground truncate">
                {user.name}
              </h2>
              <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {user.phone}
            </p>

            <div className="flex items-center justify-between pt-1 gap-2">
              <p className="text-xs text-muted-foreground truncate flex-1 font-medium">
                {user.email}
              </p>

              {/* Edit Profile Action Icon Button */}
              <button
                type="button"
                onClick={() => onSelectTab("profile")}
                className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/50 bg-muted/50 hover:bg-amber-500/15 hover:border-amber-500/40 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 cursor-pointer shadow-2xs"
                aria-label="Edit Profile"
                title="Edit Profile"
              >
                <Edit3 className="h-3.5 w-3.5 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation List */}
      <div className="space-y-4">
        {ACCOUNT_NAV_GROUPS.map((group) => {
          const isPreferences = group.group === "Preferences & Wallet";

          return (
            <React.Fragment key={group.group}>
              {/* Insert Shop & Discovery right before Preferences & Wallet (after My Activity) */}
              {isPreferences && (
                <div className="space-y-2 pt-1">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Shop &amp; Discovery
                  </p>
                  <div className="space-y-2">
                    <Link
                      href={ROUTES.FLASH_DEALS}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:from-amber-500/15 transition-all duration-300 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                          <Flame className="h-4.5 w-4.5 fill-amber-500 animate-flame" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-foreground">
                              Flash Deals
                            </span>
                            <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black px-1.5 py-0.2 text-[9px] uppercase tracking-wider">
                              Live
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            Limited-time discounts &amp; mega savings
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href={ROUTES.BRANDS}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                        <span className="text-sm font-semibold text-foreground">
                          All Brands
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href={ROUTES.CATEGORIES}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                        <span className="text-sm font-semibold text-foreground">
                          All Categories
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href={ROUTES.PRODUCTS}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                        <span className="text-sm font-semibold text-foreground">
                          Catalog &amp; All Products
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    // Dynamic badges synced to sidebar logic
                    let badgeContent: React.ReactNode = null;
                    if (item.id === "orders" && orders.length > 0) {
                      badgeContent = (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                          {orders.length}
                        </span>
                      );
                    } else if (item.id === "tracking") {
                      badgeContent = (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          Live Courier
                        </span>
                      );
                    } else if (item.id === "wishlist" && wishlistCount > 0) {
                      badgeContent = (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                          {wishlistCount}
                        </span>
                      );
                    } else if (item.id === "reviews" && pendingReviewCount > 0) {
                      badgeContent = (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                          {pendingReviewCount} new
                        </span>
                      );
                    } else if (item.id === "addresses") {
                      badgeContent = (
                        <span className="text-xs text-muted-foreground font-medium">
                          {user.addresses.length} saved
                        </span>
                      );
                    } else if (item.id === "vouchers") {
                      badgeContent = (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                          3 Active
                        </span>
                      );
                    } else if (item.id === "payments") {
                      badgeContent = (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          ৳ 70
                        </span>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectTab(item.id)}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 hover:bg-gradient-to-r hover:from-amber-500/[0.06] hover:via-amber-500/[0.02] hover:to-transparent transition-all duration-300 cursor-pointer shadow-2xs text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                          <span className="text-sm font-semibold text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {badgeContent}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* ── Customer Care & Help ── */}
        <div className="space-y-2 pt-2">
          <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Customer Care &amp; Help
          </p>
          <div className="space-y-2">
            <Link
              href={ROUTES.CONTACT}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    24/7 Support Hotline &amp; Contact
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    +880 1700-000000 · Live assistance
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => onSelectTab("returns")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileQuestion className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold text-foreground">
                  FAQ &amp; Returns Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Legal & Info ── */}
        <div className="space-y-2 pt-2">
          <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Legal &amp; Information
          </p>
          <div className="space-y-2">
            <Link
              href={ROUTES.TERMS}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold text-foreground">
                  Terms &amp; Conditions
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href={ROUTES.PRIVACY_POLICY}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold text-foreground">
                  Privacy Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href={ROUTES.ABOUT}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 hover:bg-muted/40 transition-all duration-300 shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-amber-500/90 dark:text-amber-400 stroke-[1.8] group-hover:scale-105 transition-transform" />
                <span className="text-sm font-semibold text-foreground">
                  About Telos Cart
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span className="text-sm font-semibold">Sign Out</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
