"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/constants";
import { useGetOrderStatsQuery } from "@/services/api/orders/orderApi";
import {
  ADMIN_NAV_GROUPS,
  NavGroupItem,
  AdminSidebarHeader,
  AdminSidebarNavItem,
  AdminSidebarFooter,
} from "./sidebar";

// Re-export types and navigation configurations for consumers
export * from "./sidebar";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const storeLogout = useAuthStore((state) => state.logout);
  const { isOpen, isMobileOpen, toggleSidebar, setMobileOpen } =
    useSidebarStore();

  // Check active routes
  const searchParams = useSearchParams();
  const { data: statsData } = useGetOrderStatsQuery();
  const pendingCount = statsData?.data?.pendingDispatchCount;

  const dynamicNavGroups = React.useMemo(() => {
    return ADMIN_NAV_GROUPS.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        if (item.title === "Orders") {
          const badgeVal = pendingCount && pendingCount > 0 ? String(pendingCount) : null;
          return {
            ...item,
            badge: badgeVal,
            children: item.children?.map((sub) =>
              sub.title === "Pending Dispatch" ? { ...sub, badge: badgeVal } : sub
            ),
          };
        }
        return item;
      }),
    }));
  }, [pendingCount]);

  const isSubRouteActive = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;

    if (!query) {
      return searchParams.toString().length === 0;
    }

    const params = new URLSearchParams(query);
    for (const [key, val] of params.entries()) {
      if (searchParams.get(key) !== val) {
        return false;
      }
    }
    return true;
  };

  const isParentRouteActive = (item: NavGroupItem) => {
    if (item.href) {
      if (item.href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
      return pathname.startsWith(item.href.split("?")[0]);
    }
    if (item.children) {
      return item.children.some((sub) => isSubRouteActive(sub.href));
    }
    return false;
  };

  // Expanded parent tracking (open if active sub-route matches current URL on load/refresh)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ADMIN_NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (
          item.children?.some((sub) => {
            const [path] = sub.href.split("?");
            return pathname === path;
          })
        ) {
          initial[item.title] = true;
        }
      });
    });
    return initial;
  });

  // Sync expanded state when pathname / searchParams change
  React.useEffect(() => {
    ADMIN_NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children && isParentRouteActive(item)) {
          setExpanded((prev) =>
            prev[item.title] ? prev : { ...prev, [item.title]: true },
          );
        }
      });
    });
  }, [pathname, searchParams]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "authRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    if (isMobileOpen) setMobileOpen(false);
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed top-0 left-0 right-0 bottom-16 z-40 bg-foreground/20 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Seamless Liquid Shadow Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex flex-col border-none bg-sidebar text-sidebar-foreground transition-all duration-300 select-none",
          "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06),12px_0_48px_-12px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_30px_-4px_rgba(0,0,0,0.45),12px_0_60px_-10px_rgba(0,0,0,0.35)]",
          "bottom-16 lg:bottom-0 border-r border-border/70 lg:border-r-0",
          isOpen ? "lg:w-64" : "lg:w-20",
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Top Header Area */}
        <AdminSidebarHeader
          isOpen={isOpen}
          onToggleSidebar={toggleSidebar}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Hierarchical Navigation List */}
        <nav className="relative flex-1 space-y-5 px-3 pt-4 pb-4 mt-2 overflow-y-auto subpixel-antialiased sidebar-scrollbar">
          {dynamicNavGroups.map((section) => (
            <div key={section.group} className="space-y-1">
              {(isOpen || isMobileOpen) && (
                <div className="flex items-center justify-between px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-foreground/70 dark:text-zinc-400">
                  <span>{section.group}</span>
                  {section.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold tracking-normal bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {section.badge}
                    </span>
                  )}
                </div>
              )}

              {section.items.map((item) => (
                <AdminSidebarNavItem
                  key={item.title}
                  item={item}
                  isOpen={isOpen}
                  isMobileOpen={isMobileOpen}
                  isItemActive={isParentRouteActive(item)}
                  isItemOpen={expanded[item.title] ?? false}
                  onToggleExpand={toggleExpand}
                  onCloseMobile={() => setMobileOpen(false)}
                  isSubRouteActive={isSubRouteActive}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <AdminSidebarFooter
          isOpen={isOpen}
          isMobileOpen={isMobileOpen}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}
