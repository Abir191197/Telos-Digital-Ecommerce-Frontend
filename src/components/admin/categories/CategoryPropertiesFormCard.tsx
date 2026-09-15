"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home,
  Shirt,
  Sparkles,
  Footprints,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Glasses,
  Plus,
  X,
  Lock,
  Unlock,
  Layers,
} from "lucide-react";

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  icon: string;
  itemCount: number;
  featured: boolean;
}

export const POPULAR_CATEGORY_ICONS = [
  { label: "Smartphone", name: "Smartphone", Icon: Smartphone },
  { label: "Laptop", name: "Laptop", Icon: Laptop },
  { label: "Headphones", name: "Headphones", Icon: Headphones },
  { label: "Watch", name: "Watch", Icon: Watch },
  { label: "Gamepad", name: "Gamepad2", Icon: Gamepad2 },
  { label: "Camera", name: "Camera", Icon: Camera },
  { label: "Cpu", name: "Cpu", Icon: Cpu },
  { label: "Tv", name: "Tv", Icon: Tv },
  { label: "Smart Home", name: "Home", Icon: Home },
  { label: "Apparel", name: "Shirt", Icon: Shirt },
  { label: "Accessories", name: "Sparkles", Icon: Sparkles },
  { label: "Footwear", name: "Footprints", Icon: Footprints },
  { label: "Luxury", name: "Gem", Icon: Gem },
  { label: "Security", name: "ShieldCheck", Icon: ShieldCheck },
  { label: "Networking", name: "Wifi", Icon: Wifi },
  { label: "Printers", name: "Printer", Icon: Printer },
  { label: "Fitness", name: "Dumbbell", Icon: Dumbbell },
  { label: "Automotive", name: "Car", Icon: Car },
  { label: "Books", name: "BookOpen", Icon: BookOpen },
  { label: "Travel", name: "Luggage", Icon: Luggage },
  { label: "Eyewear", name: "Glasses", Icon: Glasses },
];

export interface CategoryPropertiesFormCardProps {
  values: CategoryFormValues;
  onChange: <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K]
  ) => void;
  subcategories: string[];
  onAddSubcategory: (name: string) => void;
  onRemoveSubcategory: (index: number) => void;
}

export function CategoryPropertiesFormCard({
  values,
  onChange,
  subcategories,
  onAddSubcategory,
  onRemoveSubcategory,
}: CategoryPropertiesFormCardProps) {
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [subcategoryInput, setSubcategoryInput] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onChange("name", newName);

    if (!isSlugCustom) {
      const generatedSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      onChange("slug", generatedSlug);
    }
  };

  const handleAddSubcategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = subcategoryInput.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      onAddSubcategory(trimmed);
      setSubcategoryInput("");
    }
  };

  const handleSubcategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubcategory();
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
      <div className="pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Category Properties & Attributes
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
            Metadata
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Define category naming, URL routing slug, iconography, and catalog hierarchy.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name & Slug Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              <span>Category Title</span>
              <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={values.name}
              onChange={handleNameChange}
              placeholder="e.g. Smart Watches & Wearables"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all font-medium"
            />
          </div>

          {/* URL Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <span>URL Slug</span>
                <span className="text-amber-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSlugCustom(!isSlugCustom)}
                className="text-[11px] font-semibold text-muted-foreground hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isSlugCustom ? (
                  <>
                    <Unlock className="h-3 w-3" /> Custom
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" /> Auto
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                /category/
              </span>
              <input
                type="text"
                required
                disabled={!isSlugCustom}
                value={values.slug}
                onChange={(e) => onChange("slug", e.target.value)}
                placeholder="smart-watches"
                className="w-full pl-22 pr-3.5 py-2.5 rounded-xl border border-border/80 bg-background disabled:bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 font-mono transition-all disabled:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Category Icon</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                (Storefront badge & mobile menus)
              </span>
            </span>
            <span className="text-[11px] font-bold text-amber-500">
              Selected: {values.icon}
            </span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-44 overflow-y-auto p-2 rounded-2xl border border-border/70 bg-muted/15">
            {POPULAR_CATEGORY_ICONS.map(({ label, name, Icon }) => {
              const isSelected = values.icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onChange("icon", name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center gap-1 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 scale-102"
                      : "bg-background/80 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60"
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] truncate max-w-full">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">
              Description & SEO Meta
            </label>
            <span className="text-[10px] text-muted-foreground">
              {values.description.length}/240 chars
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={240}
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="High-performance wearables, fitness trackers, and smart luxury accessories with official warranty..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Subcategories Tag Builder */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-500" />
              <span>Subcategories</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {subcategories.length} item{subcategories.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={subcategoryInput}
              onChange={(e) => setSubcategoryInput(e.target.value)}
              onKeyDown={handleSubcategoryKeyDown}
              placeholder="e.g. Flagship Wearables (Press Enter)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => handleAddSubcategory()}
              disabled={!subcategoryInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Subcategories Chips */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {subcategories.map((sub, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted border border-border/70 text-xs font-semibold text-foreground animate-in fade-in"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSubcategory(index)}
                    className="p-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Options: Featured + Item Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50 items-center">
          {/* Featured Toggle */}
          <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/70 cursor-pointer hover:bg-muted/40 transition-colors">
            <div>
              <p className="text-xs font-bold text-foreground">
                Featured on Homepage
              </p>
              <p className="text-[10px] text-muted-foreground">
                Display on homepage category grid carousel
              </p>
            </div>
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
              className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500 border-border cursor-pointer accent-amber-500"
            />
          </label>

          {/* Initial Products Count */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/70">
            <div>
              <p className="text-xs font-bold text-foreground">
                Initial Stock Items
              </p>
              <p className="text-[10px] text-muted-foreground">
                Assigned active product listings
              </p>
            </div>
            <input
              type="number"
              min={0}
              value={values.itemCount}
              onChange={(e) => onChange("itemCount", Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 px-2.5 py-1.5 rounded-lg border border-border/80 bg-background text-xs text-center font-bold text-foreground focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
