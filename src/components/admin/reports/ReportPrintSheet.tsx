"use client";

import React, { useEffect } from "react";
import { Printer, X } from "lucide-react";

interface ReportPrintSheetProps {
  title: string;
  dateRangeText: string;
  generatedAt: string;
  summaryMetrics: { label: string; value: string | number }[];
  tableHeaders: string[];
  tableRows: (string | number)[][];
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPrintSheet({
  title,
  dateRangeText,
  generatedAt,
  summaryMetrics,
  tableHeaders,
  tableRows,
  isOpen,
  onClose,
}: ReportPrintSheetProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:p-0 print:static print:bg-transparent animate-in fade-in duration-150">
      {/* Top Modal Controls (Hidden when printing) */}
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-2xl space-y-6 relative print:p-0 print:border-none print:shadow-none print:max-h-none print:w-full">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
              Official TelosCart Report Print
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The Printable Page Body */}
        <div id="report-print-sheet" className="space-y-6 text-foreground text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-amber-500">
                  TELOS CART
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Official Store Report
                </span>
              </div>
              <p className="text-muted-foreground text-[11px] mt-1">
                Telos Digital E-Commerce Operations
              </p>
              <p className="text-muted-foreground text-[11px]">
                Dhaka, Bangladesh | https://www.teloscart.website/
              </p>
            </div>

            <div className="text-right space-y-1">
              <h2 className="text-base font-black uppercase tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Period:</span> {dateRangeText}
              </p>
              <p className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Generated:</span> {generatedAt}
              </p>
              <p className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Authority:</span> Super Administrator
              </p>
            </div>
          </div>

          {/* Executive Summary Metrics Box */}
          <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            {summaryMetrics.map((met, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {met.label}
                </p>
                <p className="text-base font-black text-foreground mt-0.5">
                  {met.value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-muted text-muted-foreground font-bold uppercase text-[9px] tracking-wider border-b border-border">
                  {tableHeaders.map((th, i) => (
                    <th key={i} className="py-2.5 px-3">
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="py-8 text-center text-muted-foreground">
                      No records found for the selected period.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="border-t border-border pt-3 flex justify-between items-center text-[10px] text-muted-foreground">
            <p>TelosCart Automated Executive Reporting System - Confidential</p>
            <p>Total Records: {tableRows.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
