import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { products } from "@/data";
import { CatalogView } from "@/components/catalog";
import { ROUTES } from "@/constants";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Products Catalog | Telos Cart - Digital Storefront",
  description:
    "Browse the entire verified catalog at Telos Cart. Smartphones, laptops, gaming rigs, audio devices, and genuine accessories with official BD warranty.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Bar ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="font-semibold text-foreground">Catalog & All Products</span>
          </nav>
        </div>
      </div>

      {/* ── Main Catalog View ── */}
      <Suspense fallback={<div className="container px-3 sm:px-6 py-10 min-h-[400px]" />}>
        <CatalogView
          initialProducts={products}
          title="Complete Product Catalog"
          subtitle="Explore over 250+ verified authentic tech devices, smartphones, computing workstations, audio gear, and lifestyle products with official Bangladesh warranty."
        />
      </Suspense>
    </div>
  );
}
