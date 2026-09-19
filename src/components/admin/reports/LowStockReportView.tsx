"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Flame,
  Boxes,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  ReportHeader,
  ReportKpiCards,
  KpiCardItem,
  ReportPrintSheet,
} from "./";
import {
  useGetLowStockReportMutation,
  LowStockReportItem,
  LowStockReportSummary,
  ReportDatePreset,
} from "@/services/api/reports/reportApi";

export function LowStockReportView() {
  const [dateRange, setDateRange] = useState<ReportDatePreset>("all_time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [fetchReport, { data: reportResponse, isLoading }] =
    useGetLowStockReportMutation();

  const [isExporting, setIsExporting] = useState(false);
  const [printData, setPrintData] = useState<{
    summary: LowStockReportSummary;
    items: LowStockReportItem[];
  } | null>(null);

  const executeFetch = (page: number) => {
    fetchReport({
      dateRange,
      startDate: dateRange === "custom" ? startDate : undefined,
      endDate: dateRange === "custom" ? endDate : undefined,
      search: search || undefined,
      page,
      limit: pageSize,
      isExport: false,
    });
  };

  useEffect(() => {
    executeFetch(currentPage);
  }, [dateRange, startDate, endDate, search, currentPage]);

  const summary = reportResponse?.data?.summary;
  const items = reportResponse?.data?.items || [];
  const meta = reportResponse?.meta || { total: 0, totalPage: 1, page: 1, limit: pageSize };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const res = await fetchReport({
        dateRange,
        startDate: dateRange === "custom" ? startDate : undefined,
        endDate: dateRange === "custom" ? endDate : undefined,
        search: search || undefined,
        page: 1,
        limit: 5000,
        isExport: true,
      }).unwrap();

      if (res?.data) {
        setPrintData({
          summary: res.data.summary,
          items: res.data.items,
        });
      }
    } catch (err) {
      console.error("Export Low Stock PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards: KpiCardItem[] = [
    {
      label: "Out of Stock (Zero)",
      value: (summary?.outOfStockItemsCount || 0).toLocaleString("en-BD"),
      subtitle: "Requires immediate replenishment",
      icon: Flame,
    },
    {
      label: "Low Stock Alert",
      value: (summary?.lowStockItemsCount || 0).toLocaleString("en-BD"),
      subtitle: "At or below threshold limit",
      icon: AlertTriangle,
    },
    {
      label: "Reorder Units Deficit",
      value: (summary?.totalUnitsDeficit || 0).toLocaleString("en-BD"),
      subtitle: "Units needed to restore safety stock",
      icon: Boxes,
    },
    {
      label: "Restock Capital Needed",
      value: `৳${(summary?.estimatedRestockCost || 0).toLocaleString("en-BD")}`,
      subtitle: "Estimated supplier purchase funds",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Low-Stock & Replenishment Alert"
        description="Identify catalog items approaching exhaustion and forecast purchase funds needed."
        badge="Supply Chain"
        dateRange={dateRange}
        setDateRange={(r) => {
          setDateRange(r);
          setCurrentPage(1);
        }}
        startDate={startDate}
        setStartDate={(d) => {
          setStartDate(d);
          setCurrentPage(1);
        }}
        endDate={endDate}
        setEndDate={(d) => {
          setEndDate(d);
          setCurrentPage(1);
        }}
        search={search}
        setSearch={(s) => {
          setSearch(s);
          setCurrentPage(1);
        }}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

      <ReportKpiCards cards={kpiCards} />

      {/* Main Table */}
      <div className="admin-card rounded-2xl bg-card border-none overflow-hidden flex flex-col shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px] border-b border-border/40">
                <th className="py-3.5 px-4">Urgency</th>
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Safety Threshold</th>
                <th className="py-3.5 px-4 text-center">Deficit Units</th>
                <th className="py-3.5 px-4 text-right">Unit Cost</th>
                <th className="py-3.5 px-4 text-right">Restock Funds Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <p className="font-semibold text-xs">Scanning inventory thresholds...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Boxes className="h-6 w-6 text-emerald-500" />
                      <p className="font-semibold text-sm text-foreground">All Stock Levels Healthy</p>
                      <p className="text-xs text-muted-foreground">
                        No products are currently at or below their safety reorder thresholds.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      {/* Urgency */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            row.urgency === "CRITICAL"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : row.urgency === "WARNING"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20"
                          }`}
                        >
                          {row.urgency === "CRITICAL" && <Flame className="h-3 w-3" />}
                          {row.urgency}
                        </span>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{row.name}</p>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {row.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-foreground font-medium">
                          {row.categoryName}
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm ${
                            row.currentStock === 0
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {row.currentStock}
                        </span>
                      </td>

                      {/* Threshold */}
                      <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                        {row.lowStockThreshold}
                      </td>

                      {/* Deficit Units */}
                      <td className="py-3.5 px-4 text-center font-black text-amber-600 dark:text-amber-400">
                        +{row.deficitUnits}
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ৳{row.unitCost.toLocaleString("en-BD")}
                      </td>

                      {/* Restock Investment */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                        ৳{row.estimatedRestockInvestment.toLocaleString("en-BD")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border/40 text-xs text-muted-foreground">
          <p>
            Showing{" "}
            <span className="font-bold text-foreground">
              {items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * pageSize, meta.total)}
            </span>{" "}
            of <span className="font-bold text-foreground">{meta.total}</span> alert items
          </p>

          {meta.totalPage > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted font-bold text-xs disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-3 py-1 text-xs font-bold text-foreground">
                {currentPage} / {meta.totalPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= meta.totalPage}
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPage, p + 1))}
                className="h-8 px-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted font-bold text-xs disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {printData && (
        <ReportPrintSheet
          title="Low-Stock & Replenishment Alert Report"
          dateRangeText={dateRange.replace("_", " ").toUpperCase()}
          generatedAt={new Date().toLocaleString("en-GB")}
          summaryMetrics={[
            { label: "Out of Stock", value: printData.summary.outOfStockItemsCount },
            { label: "Low Stock Items", value: printData.summary.lowStockItemsCount },
            { label: "Total Units Deficit", value: printData.summary.totalUnitsDeficit },
            { label: "Restock Capital Needed", value: `৳${printData.summary.estimatedRestockCost.toLocaleString("en-BD")}` },
          ]}
          tableHeaders={[
            "Urgency",
            "SKU",
            "Product Name",
            "Category",
            "Current Stock",
            "Threshold",
            "Deficit (+)",
            "Cost (৳)",
            "Funds Needed (৳)",
          ]}
          tableRows={printData.items.map((it) => [
            it.urgency,
            it.sku,
            it.name,
            it.categoryName,
            it.currentStock,
            it.lowStockThreshold,
            `+${it.deficitUnits}`,
            it.unitCost.toLocaleString("en-BD"),
            it.estimatedRestockInvestment.toLocaleString("en-BD"),
          ])}
          isOpen={Boolean(printData)}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
