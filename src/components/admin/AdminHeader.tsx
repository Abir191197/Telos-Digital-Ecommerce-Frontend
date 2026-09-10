"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/constants";
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  User,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const router = useRouter();
  const { setMobileOpen } = useSidebarStore();
  const storeLogout = useAuthStore((state) => state.logout);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    setShowProfileMenu(false);
    router.push(ROUTES.LOGIN);
  };

  const notifications = [
    {
      id: "n-1",
      title: "New Order #TC-93821",
      desc: "Apple Watch Ultra 2 paid via bKash (৳96,500)",
      time: "10m ago",
      read: false,
    },
    {
      id: "n-2",
      title: "Stock Alert: Sony WH-1000XM5",
      desc: "Stock fell below threshold (4 units remaining)",
      time: "1h ago",
      read: false,
    },
    {
      id: "n-3",
      title: "Return Request Submitted",
      desc: "Order #TC-84920 requested exchange for replacement",
      time: "3h ago",
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Menu Trigger + Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, customers, SKUs..."
            className="h-9 w-full rounded-xl border border-border/80 bg-muted/30 pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:bg-background focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Store status, Notifications, Theme toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Store indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dhaka Logistics Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/80 bg-card p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1">
                <span className="text-xs font-bold text-foreground">
                  Admin Notifications
                </span>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>

              <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 text-xs space-y-0.5 hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill & Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-border/60" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1 sm:px-2 sm:py-1 hover:bg-muted/80 transition-colors cursor-pointer text-left"
            aria-label="Admin account menu"
            aria-expanded={showProfileMenu}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-foreground leading-none">
                Store Admin
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">
                Superadmin BD
              </p>
            </div>
            <ChevronDown
              className={cn(
                "hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                showProfileMenu && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              {/* Account summary */}
              <div className="px-3 py-2.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
                    AD
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      Store Admin
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      admin@telos.com.bd
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ● Active Session
                  </span>
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    BD Region
                  </span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="py-1 space-y-0.5">
                <Link
                  href={ROUTES.HOME}
                  target="_blank"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Store className="h-4 w-4 text-amber-500" />
                  <span>View Public Store</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                </Link>
                <Link
                  href={ROUTES.ACCOUNT}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-blue-500" />
                  <span>Customer Account Hub</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1 mt-1 border-t border-border/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
