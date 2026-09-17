"use client";

import React, { use } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { ChevronRight, Loader2 } from "lucide-react";
import { useGetCategoryBySlugQuery } from "@/services/api/categories/categoryApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { useGetCategoryTreeQuery } from "@/services/api/categories/categoryApi";
import { CategoryDetailView as CategoryDetailViewUI } from "@/components/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export function CategoryDetailView({ params }: Props) {
  const { slug } = use(params);
  const { data: category, isLoading: catLoading } = useGetCategoryBySlugQuery(slug);
  const { data: productsResponse, isLoading: prodsLoading } = useGetProductsQuery(
    { categoryId: category?.id },
    { skip: !category?.id },
  );
  const { data: allCategories = [] } = useGetCategoryTreeQuery();

  const categoryProducts = productsResponse?.data || [];
  const sisterCategories = allCategories.filter((c) => c.slug !== slug).slice(0, 6);

  if (catLoading || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <Link href={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="font-semibold text-foreground truncate">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Category Detail Rich Hub ── */}
      <CategoryDetailViewUI
        category={category}
        initialProducts={categoryProducts}
        sisterCategories={sisterCategories}
      />
    </div>
  );
}
