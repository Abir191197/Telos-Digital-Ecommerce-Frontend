"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Edit3, Trash2, MoreVertical } from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandDesktopTableProps {
  brands: Brand[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onEdit?: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

interface MenuPosition {
  top: number;
  right: number;
}

export function BrandDesktopTable({
  brands,
  activeMenuId,
  setActiveMenuId,
  onEdit,
  onDelete,
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
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Tagline / Badge</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {brands.map((brand, index) => {
                const isMenuOpen = activeMenuId === brand.id;

                return (
                  <tr
                    key={brand.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Row index */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-muted-foreground">
                      {index + 1}
                    </td>

                    {/* Brand logo & name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-muted/40 p-1 flex items-center justify-center shadow-xs">
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
                          <p className="font-extrabold text-foreground truncate">
                            {brand.name}
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate">
                            {brand.tagline || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {brand.tagline || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {brand.isFeaturedMarquee ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => openMenu(e, brand.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isMenuOpen
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Actions"
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

      {/* Fixed-position dropdown — outside overflow containers */}
      {activeMenuId && menuPos && activeBrand && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
          }}
          className="w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          <Link
            href={`/products?brand=${encodeURIComponent(activeBrand.name)}`}
            target="_blank"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
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
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors text-left"
          >
            <Edit3 className="h-3.5 w-3.5 text-amber-500" />
            <span>Edit Brand</span>
          </Link>
          <div className="my-1 border-t border-border/60" />
          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
              onDelete(activeBrand);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Delete Brand</span>
          </button>
        </div>
      )}
    </>
  );
}
