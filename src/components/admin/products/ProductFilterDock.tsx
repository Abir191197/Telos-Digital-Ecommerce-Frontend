import React from "react";
import { Search, X, ChevronDown, Check, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFilterDockProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  categories: string[];
  stockStatusFilter: string;
  setStockStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
  viewMode: "table" | "card";
  setViewMode: (mode: "table" | "card") => void;
  openDropdown: "category" | "stock" | "sort" | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<"category" | "stock" | "sort" | null>>;
  onResetPage: () => void;
}

export function ProductFilterDock({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories,
  stockStatusFilter,
  setStockStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  openDropdown,
  setOpenDropdown,
  onResetPage,
}: ProductFilterDockProps) {
  return (
    <div className="hidden md:flex sticky top-16 z-20 px-4 py-3 bg-card/90 backdrop-blur-xl border rounded-2xl border-border/50 shadow-xs items-center justify-between gap-3 transition-all">
      {/* Desktop Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search title, brand, or SKU..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onResetPage();
          }}
          className="h-10 w-full rounded-xl bg-muted/40 pl-10 pr-8 text-xs sm:text-sm font-medium text-foreground focus:bg-background focus:ring-1.5 focus:ring-amber-500/40 focus:outline-none transition-all placeholder:text-muted-foreground/60"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Desktop Custom Thematic Dropdown Cards & View Mode Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Category Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
            aria-label="Filter products by category"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "category"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : categoryFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Cat:</span>
            <span className="max-w-[110px] truncate">
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "category" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "category" && (
            <div className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Filter By Category
              </div>
              <div className="max-h-60 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter("all");
                    onResetPage();
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
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
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
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

        {/* Stock Status Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "stock" ? null : "stock")}
            aria-label="Filter products by stock status"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "stock"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : stockStatusFilter !== "all"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Stock:</span>
            <span>
              {stockStatusFilter === "all"
                ? "All Stock"
                : stockStatusFilter === "in-stock"
                ? "In Stock"
                : stockStatusFilter === "low-stock"
                ? "Low Stock"
                : "Out of Stock"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "stock" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "stock" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Stock Health
              </div>
              <div className="space-y-0.5 py-1">
                {[
                  { id: "all", label: "All Stock Statuses", countDesc: "Everything" },
                  { id: "in-stock", label: "In Stock (>5 units)", countDesc: "Healthy" },
                  { id: "low-stock", label: "Low Stock (1-5 units)", countDesc: "Needs Reorder" },
                  { id: "out-stock", label: "Out of Stock (0 units)", countDesc: "Urgent" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStockStatusFilter(s.id);
                      onResetPage();
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      stockStatusFilter === s.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <div>
                      <p className="font-semibold">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.countDesc}</p>
                    </div>
                    {stockStatusFilter === s.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Order Dropdown */}
        <div className="relative" data-thematic-dropdown>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
            aria-label="Sort product catalog"
            className={cn(
              "h-10 rounded-xl border bg-muted/30 px-3.5 text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer select-none",
              openDropdown === "sort"
                ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                : sortBy !== "name"
                ? "border-amber-500/60 bg-amber-500/5 text-foreground font-bold"
                : "border-border/60 text-foreground hover:border-border hover:bg-muted/50"
            )}
          >
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Sort:</span>
            <span>
              {sortBy === "name"
                ? "Name (A-Z)"
                : sortBy === "price-asc"
                ? "Price: Low to High"
                : sortBy === "price-desc"
                ? "Price: High to Low"
                : sortBy === "stock-desc"
                ? "Stock: High to Low"
                : "Stock: Low to High"}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                openDropdown === "sort" && "rotate-180 text-amber-500"
              )}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Sort Order
              </div>
              <div className="space-y-0.5 py-1">
                {[
                  { id: "name", label: "Name (Alphabetical A - Z)" },
                  { id: "price-asc", label: "Price (Low to High)" },
                  { id: "price-desc", label: "Price (High to Low)" },
                  { id: "stock-desc", label: "Stock Count (High to Low)" },
                  { id: "stock-asc", label: "Stock Count (Low to High)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortBy(s.id as any);
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer text-left",
                      sortBy === s.id
                        ? "bg-amber-500/15 text-amber-500 font-bold"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <Check className="h-3.5 w-3.5 text-amber-500 stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-muted/40 p-1 border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Table View"
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              viewMode === "card"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Card Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Cards</span>
          </button>
        </div>
      </div>
    </div>
  );
}
