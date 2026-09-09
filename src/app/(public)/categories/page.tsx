import type { Metadata } from "next";
import { categories, products } from "@/data";
import { CategoriesView } from "@/components/categories";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "All Categories | Telos Cart - Digital Storefront",
  description:
    "Explore all product categories at Telos Cart: Smartphones, Laptops, Gaming, Wearables, Fashion, Audio, and more with genuine BD warranty.",
};

export default function CategoriesPage() {
  const totalProducts = categories.reduce((sum, c) => sum + (c.itemCount || 0), 0);

  // Grab highest rated products across catalog for the bottom mini rail
  const popularProducts = [...products]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Hero Banner Section ── */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-10 md:py-14 mb-6 sm:mb-8">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Layers className="h-3.5 w-3.5" />
              Complete Catalog
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Browse All Categories
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl">
              Explore {categories.length} curated categories and over {totalProducts} verified authentic products with official Bangladesh warranty.
            </p>
          </div>
        </div>
      </section>

      {/* ── Client View with Filters, Subcategories & Popular Rail ── */}
      <CategoriesView
        categories={categories}
        popularProducts={popularProducts}
      />
    </div>
  );
}
