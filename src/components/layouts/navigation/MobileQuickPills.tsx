"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Tag, Truck, Sparkles, ShoppingBag } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const MOBILE_QUICK_LINKS = [
  {
    label: "Flash Deals",
    href: ROUTES.FLASH_DEALS,
    icon: Flame,
    badge: "Live",
    highlight: true,
  },
  {
    label: "Brands",
    href: ROUTES.BRANDS,
    icon: Tag,
    badge: null,
    highlight: false,
  },
  {
    label: "All Products",
    href: ROUTES.PRODUCTS,
    icon: ShoppingBag,
    badge: null,
    highlight: false,
  },
  {
    label: "Track Order",
    href: ROUTES.TRACKING,
    icon: Truck,
    badge: null,
    highlight: false,
  },
];

export function MobileQuickPills() {
  const pathname = usePathname();

  return (
    <div className="md:hidden border-t border-border/50 bg-background/80 backdrop-blur-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2">
        {MOBILE_QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all select-none active:scale-95",
                item.highlight
                  ? isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-xs"
                    : "bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20"
                  : isActive
                  ? "bg-muted text-foreground font-bold border border-border"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  item.highlight
                    ? isActive
                      ? "text-zinc-950 fill-zinc-950"
                      : "text-amber-500 fill-amber-500 animate-flame"
                    : isActive
                    ? "text-amber-500"
                    : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider",
                    isActive
                      ? "bg-zinc-950 text-amber-400"
                      : "bg-amber-500 text-zinc-950"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
