"use client";

import React from "react";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { Sparkles, TrendingUp, Flame, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "featured" | "trending" | "new" | "topRated";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "featured", label: "Featured", icon: Sparkles },
  { key: "trending", label: "Trending", icon: TrendingUp },
  { key: "new", label: "New Arrivals", icon: Flame },
  { key: "topRated", label: "Top Rated", icon: Award },
];

export function FeaturedProductsTabs() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("featured");

  const filteredProducts = React.useMemo(() => {
    switch (activeTab) {
      case "featured":
        return products.filter((p) => p.isFeatured).slice(0, 8);
      case "trending":
        return products.filter((p) => p.badge === "Trending" || p.badge === "Hot" || p.reviewCount > 15).slice(0, 8);
      case "new":
        return products.filter((p) => p.isNewArrival).slice(0, 8);
      case "topRated":
        return products.filter((p) => p.rating >= 4.5).slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  }, [activeTab]);

  return (
    <section aria-label="Curated Products" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Curated Products For You
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Hand-picked selections guaranteed authentic with official Bangladesh warranty
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-muted/50 border border-border/60 self-start sm:self-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-amber-500" : "")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid: 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
