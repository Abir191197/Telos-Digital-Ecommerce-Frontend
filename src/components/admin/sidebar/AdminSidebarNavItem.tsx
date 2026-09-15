import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavGroupItem } from "./adminNavConfig";

interface AdminSidebarNavItemProps {
  item: NavGroupItem;
  isOpen: boolean;
  isMobileOpen: boolean;
  isItemActive: boolean;
  isItemOpen: boolean;
  onToggleExpand: (title: string) => void;
  onCloseMobile: () => void;
  isSubRouteActive: (href: string) => boolean;
}

export function AdminSidebarNavItem({
  item,
  isOpen,
  isMobileOpen,
  isItemActive,
  isItemOpen,
  onToggleExpand,
  onCloseMobile,
  isSubRouteActive,
}: AdminSidebarNavItemProps) {
  const hasChildren = Boolean(item.children?.length);

  // Collapsed sidebar icon item
  if (!isOpen && !isMobileOpen) {
    return (
      <Link
        href={item.href || (item.children ? item.children[0].href : "#")}
        onClick={onCloseMobile}
        className={cn(
          "relative flex h-10 w-10 mx-auto items-center justify-center rounded-xl transition-all duration-150",
          isItemActive
            ? "bg-foreground text-background font-bold shadow-sm"
            : "text-zinc-800 dark:text-zinc-200 hover:bg-muted hover:text-foreground"
        )}
        title={item.title}
      >
        <item.icon className="h-5 w-5 shrink-0 stroke-[2.2]" />
      </Link>
    );
  }

  // Expanded Item without children
  if (!hasChildren) {
    return (
      <Link
        href={item.href || "#"}
        onClick={onCloseMobile}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight transition-all duration-150",
          isItemActive
            ? "bg-foreground text-background font-bold shadow-sm"
            : "text-zinc-900 dark:text-zinc-100 hover:bg-muted"
        )}
      >
        <item.icon
          className={cn(
            "h-5 w-5 shrink-0 stroke-[2.2] transition-colors",
            isItemActive
              ? "text-background"
              : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
          )}
        />
        <span className="truncate flex-1 font-semibold">{item.title}</span>
        {item.badge && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-xs font-bold",
              isItemActive
                ? "bg-background/20 text-background"
                : "bg-muted text-foreground border border-border"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  }

  // Collapsible parent with sub-items
  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onToggleExpand(item.title)}
        className={cn(
          "w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold tracking-tight transition-all duration-150 cursor-pointer text-left",
          isItemActive
            ? "text-foreground font-bold bg-muted"
            : "text-zinc-900 dark:text-zinc-100 hover:bg-muted"
        )}
      >
        <item.icon
          className={cn(
            "h-5 w-5 shrink-0 stroke-[2.2] transition-colors",
            isItemActive
              ? "text-foreground"
              : "text-zinc-700 dark:text-zinc-300 group-hover:text-foreground"
          )}
        />
        <span className="truncate flex-1 font-semibold">{item.title}</span>
        {item.badge && (
          <span className="rounded-md px-1.5 py-0.5 text-xs font-bold bg-muted text-foreground border border-border mr-1">
            {item.badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 stroke-[2.2] transition-transform duration-200 text-zinc-600 dark:text-zinc-400 group-hover:text-foreground",
            isItemOpen && "rotate-180"
          )}
        />
      </button>

      {/* Sub-menu drawer */}
      {isItemOpen && (
        <div className="pl-5 pr-1 py-1 space-y-1 border-l-2 border-border ml-5 mt-0.5">
          {item.children!.map((sub) => {
            const isSubActive = isSubRouteActive(sub.href);
            return (
              <Link
                key={sub.title}
                href={sub.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-colors",
                  isSubActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-muted"
                )}
              >
                <span className="truncate">{sub.title}</span>
                {sub.badge && (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-xs font-semibold",
                      isSubActive
                        ? "bg-background/25 text-background"
                        : "bg-muted text-foreground border border-border"
                    )}
                  >
                    {sub.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
