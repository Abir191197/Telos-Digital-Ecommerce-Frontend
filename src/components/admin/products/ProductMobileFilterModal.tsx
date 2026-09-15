import React from "react";
import { X, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  stockStatusFilter: string;
  setStockStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
  totalResults: number;
  openDropdown: "category" | "stock" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"category" | "stock" | "sort" | null>>;
  onReset: () => void;
}

export function ProductMobileFilterModal({
  isOpen,
  onClose,
  categories,
  categoryFilter,
  setCategoryFilter,
  stockStatusFilter,
  setStockStatusFilter,
  sortBy,
  setSortBy,
  totalResults,
  openDropdown,
  setOpenDropdown,
  onReset,
}: ProductMobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
      <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground tracking-tight">Filters &amp; Sorting</h3>
              <p className="text-[11px] text-muted-foreground">Adjust catalog view criteria</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thematic Dropdown Cards */}
        <div className="space-y-4 text-xs">
          {/* 1. Category Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Category
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "category"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : categoryFilter !== "all"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Cat
                </span>
                <span className="text-xs font-bold truncate">
                  {categoryFilter === "all" ? "All Categories" : categoryFilter}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "category" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "category" && (
              <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-56 overflow-y-auto space-y-0.5 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter("all");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      categoryFilter === "all"
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>All Categories</span>
                    {categoryFilter === "all" && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(cat);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        categoryFilter === cat
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      {categoryFilter === cat && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Stock Health Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Stock Health
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "stock"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : stockStatusFilter !== "all"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Stock
                </span>
                <span className="text-xs font-bold truncate">
                  {stockStatusFilter === "all"
                    ? "All Stock"
                    : stockStatusFilter === "in-stock"
                    ? "In Stock (>5 units)"
                    : stockStatusFilter === "low-stock"
                    ? "Low Stock (1-5 units)"
                    : "Out of Stock (0 units)"}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "stock" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "stock" && (
              <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="space-y-0.5 py-1">
                  {[
                    { id: "all", label: "All Stock", sub: "Show everything in catalog" },
                    { id: "in-stock", label: "In Stock (>5)", sub: "Ample quantity available" },
                    { id: "low-stock", label: "Low Stock (1-5)", sub: "Running low, reorder soon" },
                    { id: "out-stock", label: "Out of Stock (0)", sub: "Zero inventory remaining" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStockStatusFilter(s.id);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        stockStatusFilter === s.id
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <div>
                        <p className="font-bold text-xs">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                      </div>
                      {stockStatusFilter === s.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Sort Order Dropdown Card */}
          <div className="relative" data-thematic-dropdown>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Sort Catalog
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              className={cn(
                "w-full h-12 rounded-2xl border px-4 flex items-center justify-between transition-all cursor-pointer bg-card/80",
                openDropdown === "sort"
                  ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5"
                  : sortBy !== "name"
                  ? "border-amber-500/70 bg-amber-500/5 text-foreground font-bold"
                  : "border-border/70 text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Sort
                </span>
                <span className="text-xs font-bold truncate">
                  {sortBy === "name"
                    ? "Name: Alphabetical (A - Z)"
                    : sortBy === "price-asc"
                    ? "Price: Low to High"
                    : sortBy === "price-desc"
                    ? "Price: High to Low"
                    : sortBy === "stock-desc"
                    ? "Stock: High to Low"
                    : "Stock: Low to High"}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  openDropdown === "sort" && "rotate-180 text-amber-500"
                )}
              />
            </button>

            {openDropdown === "sort" && (
              <div className="mt-2 w-full rounded-2xl border border-border/80 bg-popover shadow-2xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <div className="space-y-0.5 py-1">
                  {[
                    { id: "name", label: "Alphabetical (A - Z)", sub: "Sort by product title" },
                    { id: "price-asc", label: "Price: Low to High", sub: "Cheapest first" },
                    { id: "price-desc", label: "Price: High to Low", sub: "Most expensive first" },
                    { id: "stock-desc", label: "Stock: High to Low", sub: "Highest stock first" },
                    { id: "stock-asc", label: "Stock: Low to High", sub: "Lowest stock first" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSortBy(st.id as any);
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                        sortBy === st.id
                          ? "bg-amber-500/15 text-amber-500 font-bold"
                          : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <div>
                        <p className="font-bold text-xs">{st.label}</p>
                        <p className="text-[10px] text-muted-foreground">{st.sub}</p>
                      </div>
                      {sortBy === st.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center gap-2.5 border-t border-border/40">
          <button
            type="button"
            onClick={onReset}
            className="py-3 px-4 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-98"
          >
            Apply ({totalResults} items)
          </button>
        </div>
      </div>
    </div>
  );
}
