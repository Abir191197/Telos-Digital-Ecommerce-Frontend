import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/ecommerce.types";
import { AlertTriangle } from "lucide-react";

interface InventoryAlertListProps {
  products: Product[];
}

export function InventoryAlertList({ products }: InventoryAlertListProps) {
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6 border-none admin-card space-y-4">
      {/* Subtle top edge glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Stock Alerts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Replenishment needed</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
          {lowStock.length} Low
        </span>
      </div>

      {/* List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {lowStock.slice(0, 5).map((prod) => (
          <div
            key={prod.id}
            className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors"
          >
            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={prod.thumbnail}
                alt={prod.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-foreground truncate">{prod.name}</p>
              <p className="text-[11px] font-bold text-rose-500 mt-0.5">
                {prod.stock} left in stock
              </p>
            </div>
            <Link
              href="/dashboard/products"
              className="px-2.5 py-1 rounded-lg bg-background text-[11px] font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
            >
              Restock
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/products"
        className="block text-center text-xs font-semibold text-muted-foreground hover:text-foreground pt-1"
      >
        View full inventory &rarr;
      </Link>
    </div>
  );
}
