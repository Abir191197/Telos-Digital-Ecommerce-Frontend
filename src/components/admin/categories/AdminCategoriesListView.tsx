"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useAdminStore } from "@/stores";
import { CATEGORY_ICON_MAP } from "@/components/categories/categoryConfig";

export interface AdminCategoriesListViewProps {
  onSwitchToCreate: () => void;
}

export function AdminCategoriesListView({ onSwitchToCreate }: AdminCategoriesListViewProps) {
  const { categories, deleteCategory } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured">("all");

  const filteredCategories = categories.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFeatured = filterFeatured === "all" || c.featured;
    return matchSearch && matchFeatured;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories or slugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex rounded-xl bg-muted/40 p-1 border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setFilterFeatured("all")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterFeatured === "all"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterFeatured("featured")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterFeatured === "featured"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Featured ({categories.filter((c) => c.featured).length})
            </button>
          </div>

          <button
            type="button"
            onClick={onSwitchToCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Grid of Categories */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-3">
          <p className="text-sm font-bold text-foreground">No categories found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or create a new category catalog entry.
          </p>
          <button
            type="button"
            onClick={onSwitchToCreate}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const IconComponent =
              (category.icon && CATEGORY_ICON_MAP[category.icon]) || LayoutGrid;

            return (
              <div
                key={category.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-amber-500/50 shadow-xs hover:shadow-lg transition-all duration-200"
              >
                {/* Visual Banner */}
                <div className="relative h-28 w-full bg-muted/20 overflow-hidden">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-background/90 backdrop-blur-md text-foreground shadow-xs">
                    <IconComponent className="h-3.5 w-3.5 text-amber-500" />
                  </div>

                  {category.featured && (
                    <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black shadow-xs">
                      <Sparkles className="h-2.5 w-2.5" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-foreground truncate">
                        {category.name}
                      </h4>
                      <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                        {category.itemCount} items
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                      /{category.slug}
                    </p>
                    {category.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Subcategories count badge if any */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Layers className="h-3 w-3 text-amber-500" />
                      <span>{category.subcategories.length} subcategories</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <Link
                      href={`/category/${category.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Storefront View</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
