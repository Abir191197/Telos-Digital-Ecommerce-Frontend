"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Edit3, Trash2, Sparkles, Package, Power, PowerOff, Loader2 } from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandMobileListProps {
  brands: Brand[];
  onEdit?: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  onToggleStatus?: (brand: Brand) => void;
  togglingId?: string | null;
}

export function BrandMobileList({
  brands,
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
}: BrandMobileListProps) {
  return (
    <div className="block md:hidden space-y-3.5">
      {brands.map((brand) => {
        const itemCount = brand.itemCount ?? brand._count?.products ?? 0;

        return (
          <div
            key={brand.id}
            className="p-4 rounded-3xl bg-card border-none space-y-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_16px_40px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5),0_18px_50px_-8px_rgba(0,0,0,0.35)]"
          >
            {/* Top row: Brand Emblem + Name/Tag + Status pill */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-11 w-11 shrink-0 rounded-2xl bg-muted/50 p-1 flex items-center justify-center overflow-hidden border border-border/40">
                  {brand.image ? (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={38}
                      height={38}
                      className="object-contain"
                    />
                  ) : (
                    <Award className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-black text-foreground">{brand.name}</h4>
                    {brand.isFeaturedMarquee && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                        <Sparkles className="h-2 w-2" />
                        Featured
                      </span>
                    )}
                  </div>
                  {brand.tagline && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {brand.tagline}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                  brand.isActive !== false
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                }`}
              >
                {brand.isActive !== false ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Middle row: Items count and slug */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span className="inline-flex items-center gap-1 font-bold text-foreground">
                <Package className="h-3 w-3 text-muted-foreground" />
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="text-[10px] text-muted-foreground/80">/{brand.slug}</span>
            </div>

            {brand.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {brand.description}
              </p>
            )}

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              {onToggleStatus && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(brand)}
                  disabled={togglingId === brand.id}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                    brand.isActive !== false
                      ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
                  } ${togglingId === brand.id ? "opacity-60 cursor-wait" : "active:scale-95"}`}
                  title={brand.isActive !== false ? "Click to Deactivate" : "Click to Activate"}
                >
                  {togglingId === brand.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : brand.isActive !== false ? (
                    <Power className="h-3.5 w-3.5" />
                  ) : (
                    <PowerOff className="h-3.5 w-3.5" />
                  )}
                  <span>{brand.isActive !== false ? "Active" : "Inactive"}</span>
                </button>
              )}
              <Link
                href={`/dashboard/brands/${brand.slug}/edit`}
                className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-amber-500 hover:text-zinc-950 text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-500 group-hover:text-inherit" />
                <span>Edit</span>
              </Link>

              <button
                type="button"
                onClick={() => onDelete(brand)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>

              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                target="_blank"
                className="p-2 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                title="View in store"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
