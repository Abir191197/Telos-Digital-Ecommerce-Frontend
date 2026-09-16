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
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle, Logo } from "@/components/common";

export function AdminHeader() {
  const router = useRouter();
  const { setMobileOpen } = useSidebarStore();
  const storeLogout = useAuthStore((state) => state.logout);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showProfileMenu || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, showNotifications]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore unsupported or denied browser fullscreen requests
    }
  };

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between lg:justify-end border-none bg-sidebar/95 backdrop-blur-md px-4 sm:px-6 transition-colors shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_12px_48px_-12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.45),0_12px_60px_-10px_rgba(0,0,0,0.35)]">
      {/* Mobile Brand Logo on Mobile Only */}
      <Link
        href={ROUTES.DASHBOARD}
        className="lg:hidden flex items-center gap-2 group min-w-0"
      >
        <Logo size={32} showText={true} />
      </Link>

      {/* Right-Aligned Navigation Cluster */}
      <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
        {/* Compact Search Bar */}
        <div className="relative w-48 sm:w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-border/80 bg-background/50 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none transition-all"
          />
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-foreground" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border/80 bg-card p-3 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1">
                <span className="text-xs font-semibold text-foreground">
                  Notifications
                </span>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  2 Unread
                </span>
              </div>

              <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 text-xs space-y-0.5 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">
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

        {/* Theme Toggle */}
        <ThemeToggle className="border-border/80 bg-background/50" />

        {/* Profile */}
        <div className="relative pl-1 sm:pl-2 border-l border-border/60" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-lg p-1 sm:px-2 sm:py-1 hover:bg-muted/70 transition-colors cursor-pointer text-left"
            aria-label="Admin account menu"
            aria-expanded={showProfileMenu}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs shadow-2xs">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-foreground leading-none">
                Admin
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">
                Store Console
              </p>
            </div>
            <ChevronDown
              className={cn(
                "hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                showProfileMenu && "rotate-180"
              )}
            />
          </button>

          {/* Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/80 bg-card p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border/60">
                <p className="text-xs font-semibold text-foreground">
                  Store Administrator
                </p>
                <p className="text-[10px] text-muted-foreground">
                  admin@telos.com.bd
                </p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href={ROUTES.ADMIN_PROFILE}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <span>Admin Profile & Security</span>
                </Link>

                <Link
                  href={ROUTES.HOME}
                  target="_blank"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Store className="h-4 w-4" />
                  <span>View Public Store</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-border/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
