"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StockAuditLog } from "@/services/api/inventory/inventoryApi";

interface InventoryAuditDesktopTableProps {
  logs: StockAuditLog[];
}

function formatAuditDateTime(dateStr?: string) {
  if (!dateStr) return { date: "-", time: "-" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: "-", time: "-" };
    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  } catch {
    return { date: "-", time: "-" };
  }
}

function formatShortTitle(title: string, wordLimit = 14): string {
  if (!title) return "";
  const words = title.trim().split(/\s+/);
  if (words.length <= wordLimit) return title;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export function InventoryAuditDesktopTable({ logs }: InventoryAuditDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl border-none bg-card shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto min-h-[340px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">
              <th className="py-3.5 px-5">Timestamp</th>
              <th className="py-3.5 px-5">Product Details</th>
              <th className="py-3.5 px-5 text-center">Adjustment</th>
              <th className="py-3.5 px-6 text-center">Stock Shift</th>
              <th className="py-3.5 px-6">Reason &amp; Reference</th>
              <th className="py-3.5 px-5 text-right">Logged By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck className="h-10 w-10 text-muted-foreground/40 stroke-1" />
                    <p className="font-bold text-sm text-foreground">No audit entries found</p>
                    <p className="text-xs text-muted-foreground">
                      Any stock additions or reductions made by administrators will automatically be recorded here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const { date, time } = formatAuditDateTime(log.createdAt);
                const isIncrease = log.actionType === "INCREASE";
                const prod = log.product;

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {date}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />
                          {time}
                        </span>
                      </div>
                    </td>

                    {/* Product Details */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${prod?.slug || prod?.id}`}
                          className="relative h-11 w-11 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30 hover:opacity-85 transition-opacity block cursor-pointer"
                          title="View product"
                        >
                          {prod?.thumbnail ? (
                            <Image
                              src={prod.thumbnail}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted/60 text-[9px] font-bold text-muted-foreground">
                              No Pic
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0 max-w-[240px] lg:max-w-[320px]">
                          <Link
                            href={`/products/${prod?.slug || prod?.id}`}
                            className="font-extrabold text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1 block text-xs leading-snug cursor-pointer"
                            title={prod?.name}
                          >
                            {formatShortTitle(prod?.name || "Deleted Product", 14)}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 font-mono text-[10.5px] text-muted-foreground">
                            <span>SKU: {prod?.sku || "N/A"}</span>
                            {prod?.category?.name && (
                              <span className="text-[9.5px] font-sans px-1.5 py-0.2 rounded bg-muted/70 text-foreground/80">
                                {prod.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Adjustment Badge */}
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      {isIncrease ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold border border-emerald-500/25">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>+{log.quantity} units</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 px-3 py-1 text-xs font-bold border border-rose-500/25">
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span>-{log.quantity} units</span>
                        </span>
                      )}
                    </td>

                    {/* Stock Shift (Previous -> New) */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap font-mono">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-muted/40 border border-border/50 text-xs">
                        <span className="text-muted-foreground font-semibold">
                          {log.previousStock}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className={cn(
                          "font-black text-sm",
                          isIncrease
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}>
                          {log.newStock}
                        </span>
                        <span className="text-[10px] text-muted-foreground/80 font-sans">units</span>
                      </div>
                    </td>

                    {/* Reason & Note */}
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col max-w-[260px] lg:max-w-[340px]">
                        <span className="font-bold text-foreground text-xs line-clamp-1">
                          {log.reason}
                        </span>
                        {log.note ? (
                          <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 italic">
                            &ldquo;{log.note}&rdquo;
                          </span>
                        ) : (
                          <span className="text-[10.5px] text-muted-foreground/60 mt-0.5">
                            Standard warehouse adjustment
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Logged By */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/40">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{log.performedBy || "Super Admin"}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
