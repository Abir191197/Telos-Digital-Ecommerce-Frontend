"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  MoreVertical,
  Calendar,
} from "lucide-react";
import type { Category } from "@/types/ecommerce.types";
import { getCategoryIcon } from "@/components/categories/categoryConfig";

export interface CategoryDesktopTableProps {
  categories: Category[];
  currentPage: number;
  pageSize: number;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  getNumericId: (id: string, index: number) => string;
  formatDate: (dateStr?: string) => string;
  onEdit?: (category: Category) => void;
  onDelete: (category: Category) => void;
}

interface MenuPosition {
  top: number;
  right: number;
}

export function CategoryDesktopTable({
  categories,
  currentPage,
  pageSize,
  activeMenuId,
  setActiveMenuId,
  getNumericId,
  formatDate,
  onEdit,
  onDelete,
}: CategoryDesktopTableProps) {
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
      e.stopPropagation();
      if (activeMenuId === categoryId) {
        setActiveMenuId(null);
        setMenuPos(null);
        return;
      }
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
      setActiveMenuId(categoryId);
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

  // Close on scroll (so the fixed menu doesn't float away)
  useEffect(() => {
    if (!activeMenuId) return;
    const handleScroll = () => {
      setActiveMenuId(null);
      setMenuPos(null);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [activeMenuId, setActiveMenuId]);

  const activeCategory = categories.find((c) => c.id === activeMenuId) ?? null;

  return (
    <>
      <div className="hidden md:block rounded-3xl bg-card border-none overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Category ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {categories.map((category, index) => {
                const IconComponent = getCategoryIcon(category.icon);
                const isMenuOpen = activeMenuId === category.id;
                const rowNumber = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={category.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-[11px] font-mono text-muted-foreground">
                      {rowNumber}
                    </td>

                    {/* Category ID Column (Numeric) */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-foreground bg-muted/50 border border-border/60 px-2.5 py-0.5 rounded-md">
                        {getNumericId(category.id, index)}
                      </span>
                    </td>

                    {/* Category Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-muted/40 border border-border/60 flex items-center justify-center">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <IconComponent className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground text-xs truncate">
                              {category.name}
                            </span>
                            {category.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                                <Sparkles className="h-2 w-2" />
                                Featured
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs mt-0.5">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Item Count */}
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-mono font-bold text-foreground">
                        {category.itemCount || 0}
                      </span>
                    </td>

                    {/* Created Time/Date Column */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                        <span className="font-medium whitespace-nowrap">
                          {formatDate(category.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          category.isActive !== false
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        {category.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Three-Dot Action Column */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => openMenu(e, category.id)}
                        className={`h-8 w-8 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                          isMenuOpen
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        title="Category Actions"
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

      {/* Fixed-position dropdown — renders outside overflow containers */}
      {activeMenuId && menuPos && activeCategory && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
          }}
          className="w-44 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left"
        >
          <Link
            href={`/category/${activeCategory.slug}`}
            target="_blank"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>View in Store</span>
          </Link>
          <Link
            href={`/dashboard/categories/${activeCategory.slug}/edit`}
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors text-left"
          >
            <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Edit Details</span>
          </Link>
          <div className="my-1 border-t border-border/60" />
          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              setMenuPos(null);
              onDelete(activeCategory);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Category</span>
          </button>
        </div>
      )}
    </>
  );
}
