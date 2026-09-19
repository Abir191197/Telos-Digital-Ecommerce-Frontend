"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  History,
  Search,
  X,
  Filter,
  Download,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { ActivityLog } from "@/types/activity.types";
import {
  useGetActivityLogsQuery,
  useGetActivitySummaryQuery,
} from "@/services/api/activity/activityApi";
import { Loader2 } from "lucide-react";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import { PaymentFloatingFilterFab } from "@/components/admin/payments/PaymentFloatingFilterFab";
import {
  ActivityKpiStrip,
  ActivityFilterDock,
  ActivityDesktopTable,
  ActivityCardGrid,
  ActivityMobileList,
  ActivityMobileFilterModal,
} from "./activity";

const PAGE_SIZE = 8;

export function AdminActivityView() {
  // Live RTK Query Activity Stream & Summary
  const {
    data: activityResponse,
    isFetching,
    refetch,
  } = useGetActivityLogsQuery({
    limit: 100,
  });
  const { data: summaryResponse } = useGetActivitySummaryQuery();

  const logs = useMemo(() => {
    return activityResponse?.data ?? [];
  }, [activityResponse]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Desktop dropdown state
  const [openDropdown, setOpenDropdown] = useState<
    "category" | "severity" | "sort" | null
  >(null);

  // Close thematic dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-thematic-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Mobile Filter Drawer & Floating Action Button
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [fabPosition, setFabPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 90,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
  }>({
    startX: 0,
    startY: 0,
    posX: 16,
    posY: 90,
  });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: fabPosition.x,
      posY: fabPosition.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMovedRef.current = true;
    }

    const newX = Math.max(16, Math.min(window.innerWidth - 64, dragStartRef.current.posX - deltaX));
    const newY = Math.max(70, Math.min(window.innerHeight - 120, dragStartRef.current.posY - deltaY));

    setFabPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (!hasMovedRef.current) {
      setShowMobileFilters(true);
    }
  };

  // Filter & Search computation
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesCategory =
          categoryFilter === "all" || log.category === categoryFilter;
        const matchesSeverity =
          severityFilter === "all" || log.severity === severityFilter;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          log.action.toLowerCase().includes(q) ||
          log.entity?.toLowerCase().includes(q) ||
          log.actor.name.toLowerCase().includes(q) ||
          log.actor.email.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.ipAddress.toLowerCase().includes(q);

        return matchesCategory && matchesSeverity && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortBy === "date-desc" ? timeB - timeA : timeA - timeB;
      });
  }, [logs, categoryFilter, severityFilter, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  // KPI Metrics
  const criticalCount = useMemo(() => {
    return logs.filter((l) => l.severity === "danger" || l.severity === "warning").length;
  }, [logs]);

  const securityCount = useMemo(() => {
    return logs.filter((l) => l.category === "security" || l.category === "auth").length;
  }, [logs]);

  const isFiltered =
    categoryFilter !== "all" || severityFilter !== "all" || sortBy !== "date-desc";

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* ── Mobile Dedicated Sticky Search Bar ── */}
      <div className="md:hidden sticky top-16 z-25 -mx-4 -mt-4 sm:-mt-6 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activity events..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60 border border-border/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Top Header Banner ── */}
      <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              System Audit
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              Immutable Administrator Trail
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
            Activity &amp; Audit Logs
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setSeverityFilter("all");
              setSortBy("date-desc");
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/40 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metric Summary Strip ── */}
      <ActivityKpiStrip
        totalCount={logs.length}
        criticalCount={criticalCount}
        securityCount={securityCount}
      />

      {/* ── Desktop Thematic Filter Dock ── */}
      <ActivityFilterDock
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onResetPage={() => setCurrentPage(1)}
      />

      {/* ── Main Log Streams ── */}
      <div className="space-y-4">
        {/* Mobile View: Cards */}
        <ActivityMobileList logs={paginatedLogs} />

        {/* Desktop View: Table vs Cards */}
        {viewMode === "table" ? (
          <ActivityDesktopTable logs={paginatedLogs} />
        ) : (
          <div className="hidden md:block">
            <ActivityCardGrid logs={paginatedLogs} />
          </div>
        )}

        {/* Shared Pagination Footer */}
        {filteredLogs.length > 0 && (
          <CategoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={filteredLogs.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* ── Floating Draggable Action Button (Mobile) ── */}
      <PaymentFloatingFilterFab
        position={fabPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        isFiltered={isFiltered}
      />

      {/* ── Mobile Filter Drawer Modal ── */}
      <ActivityMobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetPage={() => setCurrentPage(1)}
      />
    </div>
  );
}
