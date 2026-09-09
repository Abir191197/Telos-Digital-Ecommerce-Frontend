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
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: ROUTES.HOME,
    icon: Home,
    exact: true,
  },
  {
    label: "Categories",
    href: ROUTES.CATEGORIES,
    icon: LayoutGrid,
  },
  {
    label: "Wishlist",
    href: ROUTES.PROFILE, // or dedicated wishlist route when available
    icon: Heart,
    badge: 0,
  },
  {
    label: "Cart",
    href: ROUTES.HOME, // or dedicated cart route / drawer trigger
    icon: ShoppingCart,
    badge: 5, // preview badge matching reference image
  },
  {
    label: "Account",
    href: ROUTES.PROFILE,
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/70 bg-background/95 backdrop-blur-lg shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== ROUTES.HOME;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 select-none",
                isActive
                  ? "text-amber-600 font-semibold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              {/* Active subtle top indicator bar */}
              {isActive && (
                <span className="absolute top-0 h-0.5 w-7 rounded-full bg-amber-500 transition-all duration-200" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110 stroke-[2.4]"
                  )}
                />

                {/* Notification / Counter Badge */}
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] tracking-tight truncate max-w-full leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS Safe Area spacing */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
