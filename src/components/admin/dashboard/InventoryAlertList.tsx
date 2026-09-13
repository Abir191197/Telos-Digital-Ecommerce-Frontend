import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/ecommerce.types";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface InventoryAlertListProps {
  products: Product[];
}

export function InventoryAlertList({ products }: InventoryAlertListProps) {
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Stock Alert</h3>
            <p className="text-[11px] text-muted-foreground">Items needing replenishment</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
          {lowStock.length} Low
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {lowStock.slice(0, 5).map((prod) => (
          <div
            key={prod.id}
            className="flex items-center gap-3 p-2 rounded-xl bg-muted/20 border border-border/60 hover:border-amber-500/30 transition-colors"
          >
            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted">
              <Image
                src={prod.thumbnail}
                alt={prod.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-foreground truncate">{prod.name}</p>
              <p className="text-[11px] font-bold text-rose-500">
                {prod.stock} units remaining
              </p>
            </div>
            <Link
              href="/dashboard/products"
              className="px-2.5 py-1 rounded-lg border border-border/80 bg-background hover:bg-muted text-[11px] font-bold text-foreground transition-colors cursor-pointer"
            >
              Restock
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/products"
        className="block text-center text-xs font-bold text-muted-foreground hover:text-foreground pt-1"
      >
        View full inventory &rarr;
      </Link>
    </div>
  );
}
