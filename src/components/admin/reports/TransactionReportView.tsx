"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
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
  TransactionReportSkeleton,
} from "./";
import {
  useGetTransactionReportMutation,
  TransactionReportItem,
  TransactionReportSummary,
  ReportDatePreset,
} from "@/services/api/reports/reportApi";

export function TransactionReportView() {
  const [dateRange, setDateRange] = useState<ReportDatePreset>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [fetchReport, { data: reportResponse, isLoading }] =
    useGetTransactionReportMutation();

  const [isExporting, setIsExporting] = useState(false);
  const [printData, setPrintData] = useState<{
    summary: TransactionReportSummary;
    items: TransactionReportItem[];
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
      console.error("Export Transaction PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const kpiCards: KpiCardItem[] = [
    {
      label: "Total Transactions Volume",
      value: `৳${(summary?.totalAmount || 0).toLocaleString("en-BD")}`,
      subtitle: `Total Count: ${summary?.totalTransactionsCount || 0}`,
      icon: CircleDollarSign,
    },
    {
      label: "Verified / Paid Volume",
      value: `৳${(summary?.successfulAmount || 0).toLocaleString("en-BD")}`,
      subtitle: "Confirmed payment collections",
      icon: CheckCircle2,
    },
    {
      label: "Pending Verification",
      value: `৳${(summary?.pendingAmount || 0).toLocaleString("en-BD")}`,
      subtitle: "Awaiting gateway / manual approval",
      icon: Clock,
    },
    {
      label: "Top Payment Method",
      value: summary?.breakdownByMethod?.[0]?.method || "COD",
      subtitle: summary?.breakdownByMethod?.[0]
        ? `৳${summary.breakdownByMethod[0].amount.toLocaleString("en-BD")}`
        : "None",
      icon: CreditCard,
    },
  ];

  if (isLoading && !reportResponse) {
    return <TransactionReportSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Payment & Transactions Audit Report"
        description="Verify financial payment transactions, gateway receipts, MFS numbers, and settlement statuses."
        badge="Payment Ledger"
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
                <th className="py-3.5 px-4">Transaction ID & Date</th>
                <th className="py-3.5 px-4">Order Number</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Method & Sender</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <p className="font-semibold text-xs">Auditing payment transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                      <p className="font-semibold text-sm text-foreground">No Transactions Found</p>
                      <p className="text-xs text-muted-foreground">
                        Try adjusting your date range or search keyword.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const normStatus = row.status.toLowerCase();
                  const isVerified = normStatus === "paid" || normStatus === "verified";
                  const isPending = normStatus === "pending";

                  return (
                    <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                      {/* TrxID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-foreground">
                          {row.trxId || "N/A (Cash / Unrecorded)"}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(row.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      {/* Order Number */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-foreground">
                          #{row.orderNumber}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{row.customerName}</p>
                        {row.customerPhone && (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {row.customerPhone}
                          </span>
                        )}
                      </td>

                      {/* Method & Sender */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold uppercase bg-muted text-foreground">
                          {row.paymentMethod}
                        </span>
                        {row.mfsNumber && (
                          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                            Sender: {row.mfsNumber}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-foreground">
                        ৳{row.amount.toLocaleString("en-BD")}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isVerified
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : isPending
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {row.status}
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
            of <span className="font-bold text-foreground">{meta.total}</span> transactions
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
          title="Payment & Transactions Audit Report"
          dateRangeText={dateRange.replace("_", " ").toUpperCase()}
          generatedAt={new Date().toLocaleString("en-GB")}
          summaryMetrics={[
            { label: "Total Trx Volume", value: `৳${printData.summary.totalAmount.toLocaleString("en-BD")}` },
            { label: "Verified Volume", value: `৳${printData.summary.successfulAmount.toLocaleString("en-BD")}` },
            { label: "Pending Volume", value: `৳${printData.summary.pendingAmount.toLocaleString("en-BD")}` },
            { label: "Total Trx Count", value: printData.summary.totalTransactionsCount },
          ]}
          tableHeaders={[
            "TrxID",
            "Order #",
            "Date",
            "Customer",
            "Method",
            "Sender MFS",
            "Amount (৳)",
            "Status",
          ]}
          tableRows={printData.items.map((it) => [
            it.trxId || "N/A",
            `#${it.orderNumber}`,
            new Date(it.createdAt).toLocaleDateString("en-GB"),
            it.customerName,
            it.paymentMethod,
            it.mfsNumber || "N/A",
            it.amount.toLocaleString("en-BD"),
            it.status,
          ])}
          isOpen={Boolean(printData)}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
