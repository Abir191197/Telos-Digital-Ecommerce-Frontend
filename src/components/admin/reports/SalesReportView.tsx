"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  CircleDollarSign,
  Truck,
  Tag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  ReportHeader,
  ReportKpiCards,
  KpiCardItem,
  ReportPrintSheet,
  SalesReportSkeleton,
} from "./";
import {
  useGetSalesReportMutation,
  SalesReportItem,
  SalesReportSummary,
  ReportDatePreset,
} from "@/services/api/reports/reportApi";

export function SalesReportView() {
  const [dateRange, setDateRange] = useState<ReportDatePreset>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [fetchReport, { data: reportResponse, isLoading }] =
    useGetSalesReportMutation();

  const [isExporting, setIsExporting] = useState(false);
  const [printData, setPrintData] = useState<{
    summary: SalesReportSummary;
    items: SalesReportItem[];
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
      console.error("Export Sales PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards: KpiCardItem[] = [
    {
      label: "Total Net Sales",
      value: `৳${(summary?.totalNetSales || 0).toLocaleString("en-BD")}`,
      subtitle: `Gross: ৳${(summary?.totalGrossSales || 0).toLocaleString("en-BD")}`,
      icon: CircleDollarSign,
    },
    {
      label: "Total Orders Placed",
      value: (summary?.totalOrdersCount || 0).toLocaleString("en-BD"),
      subtitle: `Items Sold: ${summary?.totalItemsSold || 0}`,
      icon: ShoppingBag,
    },
    {
      label: "Discounts Absorbed",
      value: `৳${(summary?.totalDiscounts || 0).toLocaleString("en-BD")}`,
      subtitle: "Vouchers & promo deductions",
      icon: Tag,
    },
    {
      label: "Delivery Fees Collected",
      value: `৳${(summary?.totalDeliveryFees || 0).toLocaleString("en-BD")}`,
      subtitle: `Average Order: ৳${(summary?.averageOrderValue || 0).toLocaleString("en-BD")}`,
      icon: Truck,
    },
  ];

  if (isLoading && !reportResponse) {
    return <SalesReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Sales & Revenue Performance Report"
        description="Executive sales analytics, subtotal volume, discounts, courier fees, and customer demand."
        badge="Executive Sales"
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
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
                <th className="py-3.5 px-4 text-right">Discount</th>
                <th className="py-3.5 px-4 text-right">Delivery</th>
                <th className="py-3.5 px-4 text-right">Order Net Total</th>
                <th className="py-3.5 px-4 text-center">Method</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <p className="font-semibold text-xs">Compiling sales performance...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                      <p className="font-semibold text-sm text-foreground">No Sales Orders Found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your date range or search keyword.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
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

                      {/* Customer & City */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{row.customerName}</p>
                        <span className="text-[11px] text-muted-foreground">
                          {row.customerCity}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-center font-semibold text-foreground">
                        {row.itemsCount}
                      </td>

                      {/* Subtotal */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ৳{row.subtotal.toLocaleString("en-BD")}
                      </td>

                      {/* Discount */}
                      <td className="py-3.5 px-4 text-right font-mono text-rose-600 dark:text-rose-400">
                        {row.discount > 0 ? `-৳${row.discount.toLocaleString("en-BD")}` : "৳0"}
                      </td>

                      {/* Delivery */}
                      <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                        ৳{row.deliveryFee.toLocaleString("en-BD")}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                        ৳{row.total.toLocaleString("en-BD")}
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-muted text-foreground">
                          {row.paymentMethod}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-foreground/10 text-foreground">
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
            of <span className="font-bold text-foreground">{meta.total}</span> sales orders
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
          title="Sales & Revenue Performance Report"
          dateRangeText={dateRange.replace("_", " ").toUpperCase()}
          generatedAt={new Date().toLocaleString("en-GB")}
          summaryMetrics={[
            { label: "Net Sales", value: `৳${printData.summary.totalNetSales.toLocaleString("en-BD")}` },
            { label: "Gross Sales", value: `৳${printData.summary.totalGrossSales.toLocaleString("en-BD")}` },
            { label: "Discounts", value: `৳${printData.summary.totalDiscounts.toLocaleString("en-BD")}` },
            { label: "Total Orders", value: printData.summary.totalOrdersCount },
          ]}
          tableHeaders={[
            "Order #",
            "Date",
            "Customer",
            "City",
            "Items",
            "Subtotal (৳)",
            "Discount (৳)",
            "Total (৳)",
            "Method",
            "Status",
          ]}
          tableRows={printData.items.map((it) => [
            `#${it.orderNumber}`,
            new Date(it.createdAt).toLocaleDateString("en-GB"),
            it.customerName,
            it.customerCity,
            it.itemsCount,
            it.subtotal.toLocaleString("en-BD"),
            it.discount.toLocaleString("en-BD"),
            it.total.toLocaleString("en-BD"),
            it.paymentMethod,
            it.orderStatus,
          ])}
          isOpen={Boolean(printData)}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
