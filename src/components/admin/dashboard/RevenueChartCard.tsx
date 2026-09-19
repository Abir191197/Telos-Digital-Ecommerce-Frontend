"use client";

import React, { useState } from "react";
import { TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetRevenueAnalyticsQuery } from "@/services/api/dashboard/dashboardApi";

const FALLBACK_DAILY = [
  { label: "Mon", revenue: 42000, orders: 4, secondary: 35000 },
  { label: "Tue", revenue: 68000, orders: 7, secondary: 50000 },
  { label: "Wed", revenue: 54000, orders: 5, secondary: 48000 },
  { label: "Thu", revenue: 92000, orders: 9, secondary: 70000 },
  { label: "Fri", revenue: 145000, orders: 14, secondary: 110000 },
  { label: "Sat", revenue: 180000, orders: 18, secondary: 130000 },
  { label: "Sun", revenue: 125000, orders: 11, secondary: 95000 },
];

export function RevenueChartCard() {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const { data: response } = useGetRevenueAnalyticsQuery(viewMode);
  const analyticsData = response?.data;

  const dataset = analyticsData?.data && analyticsData.data.length > 0 ? analyticsData.data : FALLBACK_DAILY;
  const pace = analyticsData?.pace || "+24.6% Pace";
  const totalRevenue = analyticsData?.totalSales || dataset.reduce((acc, curr) => acc + curr.revenue, 0);

  const maxRevenue = Math.max(...dataset.map((d) => d.revenue), 1000);
  const minRevenue = Math.min(...dataset.map((d) => d.revenue), 0);

  // SVG dimensions
  const width = 800;
  const height = 280;
  const paddingX = 36;
  const paddingTop = 16;
  const paddingBottom = 32;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate mapping
  const points = dataset.map((d, index) => {
    const x = paddingX + (index / (dataset.length - 1)) * chartWidth;
    const y =
      height -
      paddingBottom -
      ((d.revenue - minRevenue) / (maxRevenue - minRevenue || 1)) * chartHeight;
    const secondaryY =
      height -
      paddingBottom -
      (((d.secondary || d.revenue * 0.8) - minRevenue) / (maxRevenue - minRevenue || 1)) * chartHeight;
    return { ...d, x, y, secondaryY };
  });

  // Generate smooth SVG bezier path
  const generateBezier = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const primaryLine = generateBezier(points);
  const secondaryLine = generateBezier(points.map((p) => ({ x: p.x, y: p.secondaryY })));
  const primaryArea = points.length > 0
    ? `${primaryLine} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  const activePoint =
    activePointIndex !== null && points[activePointIndex]
      ? points[activePointIndex]
      : points[points.length - 1] || { label: "Current", revenue: 0, orders: 0 };

  const formatBdt = (val: number) => {
    if (val >= 1000000) return `৳${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `৳${(val / 1000).toFixed(0)}k`;
    return `৳${val.toLocaleString()}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-4 sm:p-6 border-none admin-card flex flex-col justify-between h-full gap-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Revenue Analytics
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <TrendingUp className="h-3 w-3" />
              {pace}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total {viewMode === "daily" ? "7-Day Sales" : "Annual Sales"}:{" "}
            <span className="text-foreground font-bold">{formatBdt(totalRevenue)}</span>
          </p>
        </div>

        {/* Legend + Filter Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Legend tags */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-medium text-muted-foreground mr-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500/50" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400/50" />
              <span>Baseline</span>
            </div>
          </div>

          {/* Daily / Monthly Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/70 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setViewMode("daily");
                setActivePointIndex(null);
              }}
              className={cn(
                "px-3 py-1 rounded-lg transition-all cursor-pointer",
                viewMode === "daily"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("monthly");
                setActivePointIndex(null);
              }}
              className={cn(
                "px-3 py-1 rounded-lg transition-all cursor-pointer",
                viewMode === "monthly"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Compact Header Metric Strip */}
      <div className="flex items-center justify-between text-xs pt-0.5 border-b border-border/30 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-muted-foreground">
            Point: <strong className="text-foreground">{activePoint.label}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="font-bold text-cyan-600 dark:text-cyan-400">
            ৳{activePoint.revenue.toLocaleString()}
          </span>
          <span className="text-[11px] font-normal text-muted-foreground">
            ({activePoint.orders} ord.)
          </span>
        </div>
      </div>

      {/* Neon Cyan/Indigo Wave SVG Canvas */}
      <div className="relative w-full overflow-hidden flex-1 min-h-[240px] pt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyberCyanGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.35" />
            </filter>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = height - paddingBottom - ratio * chartHeight;
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.07"
                  strokeDasharray="4 6"
                />
              </g>
            );
          })}

          <path
            d={secondaryLine}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-muted-foreground"
          />

          <path
            d={primaryArea}
            fill="url(#cyberCyanGlow)"
          />

          <path
            d={primaryLine}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            className="transition-all duration-300"
          />

          {points.map((p, idx) => {
            const isHovered = activePointIndex === idx || (activePointIndex === null && idx === points.length - 1);
            return (
              <g
                key={p.label}
                className="cursor-pointer"
                onMouseEnter={() => setActivePointIndex(idx)}
              >
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={height - paddingBottom}
                    stroke="#06b6d4"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill="#06b6d4"
                    fillOpacity="0.25"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "5" : "3.5"}
                  fill={isHovered ? "#06b6d4" : "#ffffff"}
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  className="transition-all duration-150 shadow-xs"
                />

                <text
                  x={p.x}
                  y={height - 12}
                  textAnchor="middle"
                  className={cn(
                    "text-[12px] transition-all select-none",
                    isHovered
                      ? "fill-cyan-500 dark:fill-cyan-400 font-bold"
                      : "fill-muted-foreground font-medium"
                  )}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
