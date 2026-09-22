"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ExternalLink,
  Edit3,
  Trash2,
  MoreVertical,
  Calendar,
  Sparkles,
  Power,
  PowerOff,
  Loader2,
} from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandDesktopTableProps {
  brands: Brand[];
  currentPage?: number;
  pageSize?: number;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  getNumericId?: (id: string, index: number) => string;
  formatDate?: (dateStr?: string) => string;
  onEdit?: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  onToggleStatus?: (brand: Brand) => void;
  togglingId?: string | null;
}

interface MenuPosition {
  top: number;
  right: number;
}

const defaultGetNumericId = (id: string, index: number) => {
  const matches = id.match(/\d+/g);
  if (matches && matches.length > 0) {
    const numStr = matches.join("");
    return numStr.length > 6 ? numStr.slice(-5) : numStr;
  }
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return String(1000 + (hash % 9000));
};

const defaultFormatDate = (dateStr?: string) => {
  if (!dateStr) return "Sep 12, 2026";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Sep 12, 2026";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Sep 12, 2026";
  }
};

export function BrandDesktopTable({
  brands,
  currentPage = 1,
  pageSize = 8,
  activeMenuId,
  setActiveMenuId,
  getNumericId,
  formatDate,
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
}: BrandDesktopTableProps) {
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, brandId: string) => {
      e.stopPropagation();
      if (activeMenuId === brandId) {
        setActiveMenuId(null);
        setMenuPos(null);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
      setActiveMenuId(brandId);
    },
    [activeMenuId, setActiveMenuId]
  );

  // Close on outside click
  useEffect(() => {
    if (!activeMenuId) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
        setMenuPos(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeMenuId, setActiveMenuId]);

  // Close on scroll
  useEffect(() => {
    if (!activeMenuId) return;
    const handleScroll = () => {
      setActiveMenuId(null);
      setMenuPos(null);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [activeMenuId, setActiveMenuId]);

  const activeBrand = brands.find((b) => b.id === activeMenuId) ?? null;

  return (
    <>
      <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Brand ID</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Tagline / Badge</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {brands.map((brand, index) => {
                const isMenuOpen = activeMenuId === brand.id;
                const rowNumber = (currentPage - 1) * pageSize + index + 1;
                const numericId = (getNumericId || defaultGetNumericId)(brand.id, index);
                const formattedDate = (formatDate || defaultFormatDate)(brand.createdAt);
                const itemCount = brand.itemCount ?? brand._count?.products ?? 0;

                return (
                  <tr
                    key={brand.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Row index */}
                    <td className="py-3 px-4 text-center text-[11px] font-mono text-muted-foreground">
                      {rowNumber}
                    </td>

                    {/* Brand ID Column */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-foreground bg-muted/50 border border-border/60 px-2.5 py-0.5 rounded-md">
                        {numericId}
                      </span>
                    </td>

                    {/* Brand logo & name & featured badge */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/60 p-1 flex items-center justify-center shadow-xs">
                          {brand.image ? (
                            <Image
                              src={brand.image}
                              alt={brand.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          ) : (
                            <Award className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground text-xs truncate">
                              {brand.name}
                            </span>
                            {brand.isFeaturedMarquee && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                                <Sparkles className="h-2 w-2" />
                                Featured
                              </span>
                            )}
                          </div>
                          {brand.description ? (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                              {brand.description}
                            </p>
                          ) : (
                            <p className="text-[10px] font-mono text-muted-foreground/80 truncate mt-0.5">
                              /{brand.slug}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tagline / Badge */}
                    <td className="py-3 px-4">
                      {brand.tagline ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {brand.tagline}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">-</span>
                      )}
                    </td>

                    {/* Item Count */}
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono font-bold text-foreground">
                        {itemCount}
                      </span>
                    </td>

                    {/* Created Date Column */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="font-medium whitespace-nowrap">
                          {formattedDate}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {onToggleStatus ? (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(brand)}
                          disabled={togglingId === brand.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            brand.isActive !== false
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20 hover:bg-zinc-500/20"
                          } ${togglingId === brand.id ? "opacity-60 cursor-wait" : "active:scale-95"}`}
                          title={brand.isActive !== false ? "Status: Active (Click to Deactivate)" : "Status: Inactive (Click to Activate)"}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${brand.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                          {brand.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            brand.isActive !== false
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                          }`}
                        >
                          {brand.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => openMenu(e, brand.id)}
                        className={`h-8 w-8 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                          isMenuOpen
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Brand Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed-position dropdown - outside overflow containers */}
      {activeMenuId && menuPos && activeBrand && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
          }}
          className="w-48 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          <Link
            href={`/products?brand=${encodeURIComponent(activeBrand.name)}`}
            target="_blank"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Storefront</span>
          </Link>
          <Link
            href={`/dashboard/brands/${activeBrand.slug}/edit`}
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left"
          >
            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Details</span>
          </Link>
          {onToggleStatus && (
            <button
              type="button"
              onClick={() => {
                const b = activeBrand;
                setActiveMenuId(null);
                setMenuPos(null);
                onToggleStatus(b);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left cursor-pointer"
            >
              {activeBrand.isActive !== false ? (
                <>
                  <PowerOff className="h-3.5 w-3.5 text-amber-500" />
                  <span>Deactivate Brand</span>
                </>
              ) : (
                <>
                  <Power className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Activate Brand</span>
                </>
              )}
            </button>
          )}
          <div className="my-1 border-t border-border/60" />
          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
              onDelete(activeBrand);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Brand</span>
          </button>
        </div>
      )}
    </>
  );
}
