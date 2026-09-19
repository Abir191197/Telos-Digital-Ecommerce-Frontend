"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  Package,
  CircleDollarSign,
  AlertTriangle,
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
  useGetStockReportMutation,
  StockReportItem,
  StockReportSummary,
  ReportDatePreset,
} from "@/services/api/reports/reportApi";

export function StockReportView() {
  const [dateRange, setDateRange] = useState<ReportDatePreset>("all_time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [fetchReport, { data: reportResponse, isLoading }] =
    useGetStockReportMutation();

  const [isExporting, setIsExporting] = useState(false);
  const [printData, setPrintData] = useState<{
    summary: StockReportSummary;
    items: StockReportItem[];
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
      console.error("Export Stock PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards: KpiCardItem[] = [
    {
      label: "Total Units In Stock",
      value: (summary?.totalUnitsInStock || 0).toLocaleString("en-BD"),
      subtitle: `Total Products: ${summary?.totalProductsCount || 0}`,
      icon: Boxes,
    },
    {
      label: "Cost Valuation (Asset)",
      value: `৳${(summary?.totalInventoryCostValue || 0).toLocaleString("en-BD")}`,
      subtitle: "Capital tied up in inventory",
      icon: Package,
    },
    {
      label: "Retail Valuation",
      value: `৳${(summary?.totalInventoryRetailValue || 0).toLocaleString("en-BD")}`,
      subtitle: `Potential Profit: ৳${(summary?.potentialProfit || 0).toLocaleString("en-BD")}`,
      icon: CircleDollarSign,
    },
    {
      label: "Low / Out of Stock",
      value: (summary?.outOfStockCount || 0) + (summary?.lowStockCount || 0),
      subtitle: `Out of Stock: ${summary?.outOfStockCount || 0}`,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Stock & Inventory Valuation Report"
        description="Comprehensive inventory audit, stock counts, cost asset valuation, and retail potential."
        badge="Warehouse Asset"
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
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Category / Brand</th>
                <th className="py-3.5 px-4 text-center">In Stock</th>
                <th className="py-3.5 px-4 text-right">Unit Cost</th>
                <th className="py-3.5 px-4 text-right">Retail Price</th>
                <th className="py-3.5 px-4 text-right">Total Cost Value</th>
                <th className="py-3.5 px-4 text-right">Retail Valuation</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <p className="font-semibold text-xs">Evaluating inventory stock...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                      <p className="font-semibold text-sm text-foreground">No Products Found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{row.name}</p>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {row.sku}
                        </span>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-foreground">{row.categoryName}</p>
                        {row.brandName && (
                          <span className="text-[11px] text-muted-foreground">
                            {row.brandName}
                          </span>
                        )}
                      </td>

                      {/* In Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm ${
                            row.stock === 0
                              ? "text-rose-600 dark:text-rose-400"
                              : row.stock <= row.lowStockThreshold
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-foreground"
                          }`}
                        >
                          {row.stock}
                        </span>
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ৳{row.unitCost.toLocaleString("en-BD")}
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                        ৳{row.unitPrice.toLocaleString("en-BD")}
                      </td>

                      {/* Total Cost Value */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ৳{row.totalCostValue.toLocaleString("en-BD")}
                      </td>

                      {/* Total Retail Value */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                        ৳{row.totalRetailValue.toLocaleString("en-BD")}
                      </td>

                      {/* Stock Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            row.stock === 0
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : row.stock <= row.lowStockThreshold
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {row.stockStatus.replace("_", " ")}
                        </span>
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
            of <span className="font-bold text-foreground">{meta.total}</span> items
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
          title="Inventory & Stock Asset Valuation Report"
          dateRangeText={dateRange.replace("_", " ").toUpperCase()}
          generatedAt={new Date().toLocaleString("en-GB")}
          summaryMetrics={[
            { label: "Total Stock Units", value: printData.summary.totalUnitsInStock.toLocaleString("en-BD") },
            { label: "Cost Asset Value", value: `৳${printData.summary.totalInventoryCostValue.toLocaleString("en-BD")}` },
            { label: "Retail Valuation", value: `৳${printData.summary.totalInventoryRetailValue.toLocaleString("en-BD")}` },
            { label: "Potential Profit", value: `৳${printData.summary.potentialProfit.toLocaleString("en-BD")}` },
          ]}
          tableHeaders={[
            "SKU",
            "Product Name",
            "Category",
            "Stock",
            "Unit Cost (৳)",
            "Retail (৳)",
            "Cost Val (৳)",
            "Retail Val (৳)",
            "Status",
          ]}
          tableRows={printData.items.map((it) => [
            it.sku,
            it.name,
            it.categoryName,
            it.stock,
            it.unitCost.toLocaleString("en-BD"),
            it.unitPrice.toLocaleString("en-BD"),
            it.totalCostValue.toLocaleString("en-BD"),
            it.totalRetailValue.toLocaleString("en-BD"),
            it.stockStatus.replace("_", " "),
          ])}
          isOpen={Boolean(printData)}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
