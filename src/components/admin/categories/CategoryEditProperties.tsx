"use client";

import React from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { POPULAR_CATEGORY_ICONS } from "./CategoryPropertiesFormCard";
import {
  normalizeCategoryIconName,
  getCategoryIcon,
} from "@/components/categories/categoryConfig";

interface CategoryEditPropertiesProps {
  description: string;
  setDescription: (desc: string) => void;
  icon: string;
  setIcon: (icon: string) => void;
  featured: boolean;
  setFeatured: (feat: boolean) => void;
  subcategories: string[];
  subInput: string;
  setSubInput: (val: string) => void;
  onAddSub: () => void;
  onRemoveSub: (idx: number) => void;
}

export function CategoryEditProperties({
  description,
  setDescription,
  icon,
  setIcon,
  featured,
  setFeatured,
  subcategories,
  subInput,
  setSubInput,
  onAddSub,
  onRemoveSub,
}: CategoryEditPropertiesProps) {
  const SelectedIcon = getCategoryIcon(icon);

  return (
    <>
      {/* Category Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-foreground">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short overview shown in catalog highlights..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
        />
      </div>

      {/* Visual Icon Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span>Storefront Icon</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({icon})
            </span>
          </label>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg">
            <SelectedIcon className="h-3.5 w-3.5" />
            <span>Active Icon</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 rounded-2xl bg-muted/20 border border-border/70 max-h-36 overflow-y-auto">
          {POPULAR_CATEGORY_ICONS.map((item) => {
            const ItemIcon = item.Icon;
            const isSelected = normalizeCategoryIconName(icon) === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setIcon(item.name)}
                title={item.name}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/15 text-amber-500 ring-2 ring-amber-500/30 font-bold"
                    : "border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                <span className="text-[9px] mt-1 truncate max-w-full">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-muted/15">
        <div>
          <h4 className="text-xs font-bold text-foreground">
            Featured on Homepage
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Promote this category with hero banners on storefront home screen.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFeatured(!featured)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            featured ? "bg-amber-500" : "bg-muted"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              featured ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Subcategories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-foreground">
          Subcategories / Taxonomies
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddSub();
              }
            }}
            placeholder="e.g. Wireless Earbuds"
            className="flex-1 px-3.5 py-2 rounded-xl border border-border/80 bg-background text-xs text-foreground focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={onAddSub}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {subcategories.map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 border border-border/70 text-xs font-medium text-foreground"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => onRemoveSub(idx)}
                  className="p-0.5 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
