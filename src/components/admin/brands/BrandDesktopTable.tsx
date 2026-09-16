"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, Edit3, Trash2, MoreVertical } from "lucide-react";
import type { Brand } from "@/types/ecommerce.types";

interface BrandDesktopTableProps {
  brands: Brand[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  getProductCount: (brandName: string) => number;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandDesktopTable({
  brands,
  activeMenuId,
  setActiveMenuId,
  getProductCount,
  onEdit,
  onDelete,
}: BrandDesktopTableProps) {
  return (
    <div className="hidden md:block rounded-3xl bg-card border-none overflow-visible shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Tagline / Badge</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {brands.map((brand, index) => {
              const isMenuOpen = activeMenuId === brand.id;
              const count = getProductCount(brand.name);

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
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
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
                          /{brand.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Badge */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {brand.tag}
                    </span>
                  </td>

                  {/* Product count */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-foreground">
                    {count} items
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    {brand.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ★ Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                        Standard
                      </span>
                    )}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3 px-4 text-right relative" data-action-menu>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : brand.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-4 top-11 z-30 w-44 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
                        <Link
                          href={`/products?brand=${encodeURIComponent(brand.name)}`}
                          target="_blank"
                          onClick={() => setActiveMenuId(null)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Storefront</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onEdit(brand);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                          <span>Edit Brand</span>
                        </button>
                        <div className="my-1 border-t border-border/60" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete(brand);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          <span>Delete Brand</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
