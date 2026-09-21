"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/ecommerce.types";

interface StockPreviewPanelProps {
  product: Product;
  currentStock: number;
  actionType: "INCREASE" | "DECREASE";
  quantity: number;
  resultingStock: number;
  isInvalidReduction: boolean;
  note: string;
  setNote: (note: string) => void;
}

export function StockPreviewPanel({
  product,
  currentStock,
  actionType,
  quantity,
  resultingStock,
  isInvalidReduction,
  note,
  setNote,
}: StockPreviewPanelProps) {
  return (
    <div className="md:col-span-5 space-y-3.5">
      {/* Product Snapshot */}
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/50">
        <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/40">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground font-bold">
              No Pic
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-muted-foreground font-mono">
            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
              SKU: {product.sku || "N/A"}
            </span>
            {product.categoryName && (
              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                {product.categoryName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Math Preview Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/60 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Balance Trajectory</span>
          <span className="text-[10px] font-normal text-muted-foreground">Preview</span>
        </div>

        <div className="grid grid-cols-3 gap-2 items-center text-center">
          {/* Current */}
          <div className="p-2 rounded-xl bg-background/80 border border-border/50">
            <p className="text-[10px] text-muted-foreground font-semibold">Current</p>
            <p className="text-base font-black font-mono text-foreground mt-0.5">
              {currentStock}
            </p>
          </div>

          {/* Delta */}
          <div
            className={cn(
              "p-2 rounded-xl border font-mono font-black text-sm",
              actionType === "INCREASE"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
            )}
          >
            <p className="text-[10px] font-semibold opacity-80">Change</p>
            <p className="mt-0.5">
              {actionType === "INCREASE" ? `+${quantity}` : `-${quantity}`}
            </p>
          </div>

          {/* Resulting */}
          <div
            className={cn(
              "p-2 rounded-xl border",
              resultingStock < 0
                ? "bg-rose-500/15 border-rose-500/40"
                : "bg-background/80 border-border/50"
            )}
          >
            <p className="text-[10px] text-muted-foreground font-semibold">New Total</p>
            <p
              className={cn(
                "text-base font-black font-mono mt-0.5",
                resultingStock < 0
                  ? "text-rose-600"
                  : resultingStock <= (product.lowStockThreshold || 5)
                  ? "text-amber-500"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {resultingStock}
            </p>
          </div>
        </div>

        {isInvalidReduction && (
          <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Exceeds available stock ({currentStock} units)</span>
          </div>
        )}
      </div>

      {/* Optional Reference Note */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
          Note / Reference (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. PO #1042 or damaged box receipt"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-10 w-full rounded-xl bg-background border border-border/60 px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1.5 focus:ring-amber-500/40 placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
