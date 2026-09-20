"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Percent,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  ReportHeader,
  ReportKpiCards,
  KpiCardItem,
  ReportPrintSheet,
  ProfitReportSkeleton,
} from "./";
import {
  useGetProfitReportMutation,
  ProfitReportItem,
  ProfitReportSummary,
  ReportDatePreset,
} from "@/services/api/reports/reportApi";

export function ProfitReportView() {
  const [dateRange, setDateRange] = useState<ReportDatePreset>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [fetchReport, { data: reportResponse, isLoading }] =
    useGetProfitReportMutation();

  // Export PDF State
  const [isExporting, setIsExporting] = useState(false);
  const [printData, setPrintData] = useState<{
    summary: ProfitReportSummary;
    items: ProfitReportItem[];
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

  // Handle PDF Export
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
      console.error("Export PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards: KpiCardItem[] = [
    {
      label: "Total Net Revenue",
      value: `৳${(summary?.totalRevenue || 0).toLocaleString("en-BD")}`,
      subtitle: `Delivered Orders: ${summary?.deliveredOrdersCount || 0}`,
      icon: DollarSign,
    },
    {
      label: "Estimated Product Cost",
      value: `৳${(summary?.totalCost || 0).toLocaleString("en-BD")}`,
      subtitle: "Cost of Goods Sold (COGS)",
      icon: PackageCheck,
    },
    {
      label: "Gross Profit",
      value: `৳${(summary?.grossProfit || 0).toLocaleString("en-BD")}`,
      subtitle: "Revenue minus Product Cost",
      icon: TrendingUp,
    },
    {
      label: "Profit Margin",
      value: `${summary?.profitMargin || 0}%`,
      subtitle: `Avg Order: ৳${(summary?.averageOrderValue || 0).toLocaleString("en-BD")}`,
      icon: Percent,
    },
  ];

  if (isLoading && !reportResponse) {
    return <ProfitReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters & Export */}
      <ReportHeader
        title="Profit & Margins Report"
        description="Monitor real-time business profitability, cost of goods, and net profit margins."
        badge="Financial Integrity"
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

      {/* KPI Cards */}
      <ReportKpiCards cards={kpiCards} />

      {/* Main Table */}
      <div className="admin-card rounded-2xl bg-card border-none overflow-hidden flex flex-col shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-bold tracking-wider uppercase text-[10px] border-b border-border/40">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4 text-center">Items Sold</th>
                <th className="py-3.5 px-4 text-right">Order Revenue</th>
                <th className="py-3.5 px-4 text-right">Product Cost</th>
                <th className="py-3.5 px-4 text-right">Gross Profit</th>
                <th className="py-3.5 px-4 text-center">Margin %</th>
                <th className="py-3.5 px-4 text-center">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <p className="font-semibold text-xs">Computing profit margins...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                      <p className="font-semibold text-sm text-foreground">No Profit Records Found</p>
                      <p className="text-xs text-muted-foreground">
                        Try expanding your date range filter or clearing your search term.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const isProfitPositive = row.grossProfit >= 0;
                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      {/* Order & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-foreground">
                          #{row.orderNumber}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(row.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{row.customerName}</p>
                        {row.customerPhone && (
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {row.customerPhone}
                          </p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-center font-semibold text-foreground">
                        {row.itemsCount}
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right font-black text-foreground">
                        ৳{row.orderTotal.toLocaleString("en-BD")}
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-4 text-right font-medium text-muted-foreground">
                        ৳{row.estimatedCost.toLocaleString("en-BD")}
                      </td>

                      {/* Gross Profit */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-black ${
                            isProfitPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isProfitPositive ? "+" : ""}৳{row.grossProfit.toLocaleString("en-BD")}
                        </span>
                      </td>

                      {/* Margin % */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            row.profitMargin >= 30
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : row.profitMargin >= 15
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {row.profitMargin}%
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground">
                          {row.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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
            of <span className="font-bold text-foreground">{meta.total}</span> orders
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

      {/* Printable Sheet for PDF Export */}
      {printData && (
        <ReportPrintSheet
          title="Profit & Margins Financial Report"
          dateRangeText={dateRange.replace("_", " ").toUpperCase()}
          generatedAt={new Date().toLocaleString("en-GB")}
          summaryMetrics={[
            { label: "Net Revenue", value: `৳${printData.summary.totalRevenue.toLocaleString("en-BD")}` },
            { label: "Product Cost", value: `৳${printData.summary.totalCost.toLocaleString("en-BD")}` },
            { label: "Gross Profit", value: `৳${printData.summary.grossProfit.toLocaleString("en-BD")}` },
            { label: "Profit Margin", value: `${printData.summary.profitMargin}%` },
          ]}
          tableHeaders={[
            "Order #",
            "Date",
            "Customer",
            "Items",
            "Revenue (৳)",
            "Cost (৳)",
            "Profit (৳)",
            "Margin %",
            "Status",
          ]}
          tableRows={printData.items.map((it) => [
            `#${it.orderNumber}`,
            new Date(it.createdAt).toLocaleDateString("en-GB"),
            it.customerName,
            it.itemsCount,
            it.orderTotal.toLocaleString("en-BD"),
            it.estimatedCost.toLocaleString("en-BD"),
            it.grossProfit.toLocaleString("en-BD"),
            `${it.profitMargin}%`,
            it.orderStatus,
          ])}
          isOpen={Boolean(printData)}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
