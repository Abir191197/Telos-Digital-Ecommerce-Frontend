"use client";

import React from "react";
import { products } from "@/data";
import { ProductCard } from "@/components/common";
import { Wallet, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BudgetTier = {
  id: string;
  label: string;
  sublabel: string;
  filter: (price: number) => boolean;
};

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "under-5k",
    label: "Under ৳5,000",
    sublabel: "Everyday essentials & gadgets",
    filter: (p) => p <= 5000,
  },
  {
    id: "under-15k",
    label: "Under ৳15,000",
    sublabel: "Wearables & accessories",
    filter: (p) => p > 5000 && p <= 15000,
  },
  {
    id: "under-35k",
    label: "Under ৳35,000",
    sublabel: "Mid-range phones & audio",
    filter: (p) => p > 15000 && p <= 35000,
  },
  {
    id: "premium",
    label: "৳35,000+",
    sublabel: "Flagship phones & laptops",
    filter: (p) => p > 35000,
  },
];

export function ShopByBudgetSection() {
  const [selectedTier, setSelectedTier] = React.useState<string>("under-5k");

  const activeTier = BUDGET_TIERS.find((t) => t.id === selectedTier) || BUDGET_TIERS[0];

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => activeTier.filter(p.price)).slice(0, 10);
  }, [activeTier]);

  return (
    <section aria-label="Shop By Budget" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Shop By Budget
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-3 w-3" />
              Best Value
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Discover verified products tailored to your exact budget
          </p>
        </div>

        {/* Tier filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {BUDGET_TIERS.map((tier) => {
            const isActive = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer",
                  isActive
                    ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                    : "bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <Tag className="h-3 w-3" />
                <span>{tier.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid: 2-col on mobile, 3 on md, 5-col on xl desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
